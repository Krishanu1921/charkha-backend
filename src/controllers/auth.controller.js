import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res)=>{
    try{
        const {name, email, password, phone} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success : false,
                message : "User Already Exists"
            });
        }
        await User.create(
            {
                name,
                email,
                password,
                phone
            }
        );
        return res.status(201).json(
            {
                success : true,
                message : "User Created Scuccessfully"
            }
        );
    }catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        });
    }
};

const loginUser = async(req, res)=>{
    const {email, password} = req.body;
    const user = await User.findByEmail(email);
    if(!user){
        return res.status(401).json(
            {
                success : false,
                message : "Invalid Credentials"
            }
        );
    }
    const isMatch = await user.isPasswordCorrect(password);
    if(!isMatch){
        return res.status(401).json(
            {
                success : false,
                message : "Invalid Credentials"
            }
        );
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    
    

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            {
                success : true,
                loggedInUser,
                message : "User Logged In Successfully"
            }
        );

};

const logoutUser = async(req, res)=>{

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set : {
                    refreshToken : undefined
                }
            },
            {
                new : true
            }
        );
    
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        };
    
        return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(
                {
                    success : true,
                    message : "User Logged Out Successfully"
                }
            );
    } catch (error) {
        return res.status(401).json(
            {
                success : false,
                message : "error.message"
            }
        );
    }
};

const refreshAccessToken = async(req, res)=>{
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        if(!incomingRefreshToken){
            return res.status(401).json(
                {
                    success : false,
                    message : "Unauthorized request"
                }
            );
        }
        const decodedToken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);
        if(!user){
            return res.status(401).json(
                {
                    success : false,
                    message : "Unauthorized request"
                }
            );
        }
        if(incomingRefreshToken !== user.refreshToken){
            return res.status(401).json(
                {
                    success : false,
                    message : "Refresh Token Is Expired or Used"
                }
            );
        }
        const accessToken = await user.generateAccessToken();
    
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        };


        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .json(
                {
                    success : true,
                    message : "Access Token refreshed successfully"
                }
            )
    } catch (error) {
        return res.status(401).json(
            {
                success : true,
                message : error.message || "Invalid Refresh Token"
            }
        );
    }
};

export{
    registerUser, loginUser, logoutUser, refreshAccessToken
};
