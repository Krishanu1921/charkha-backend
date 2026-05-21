import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const addressSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    street: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    postalCode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const userSchema = new Schema(
    {
        role: {
            type : String,
            required : true,
            enum: ["user", "admin"],
            default : "user"
        },
        name :{
            type: String,
            required : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            unique: true,
            lowercase: true,
            trim : true
        },
        password : {
            type : String,
            required : true,
            trim : true,
            minlength : 6
        },
        phone : {
            type : String,
            required : true,
            trim : true
        },
        addresses : [addressSchema],
        
        refreshToken : {
            type : String
        }
    },{timestamps : true}
);

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

//Instance methods...

userSchema.methods.isPasswordCorrect = async function(inputPassword){
    return bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id : this._id,
            role : this.role,
            email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.saveRefreshToken = async function(token){
    this.refreshToken = token;
    return await this.save();
};

userSchema.methods.removeRefreshToken = async function(){
    this.refreshToken = null;
    return await this.save();
};

userSchema.methods.isAdmin = async function(){
    return this.role === "admin";
};

userSchema.methods.addAddress = async function(addressId){
    this.addresses.push(addressId);
    return await this.save();
};

userSchema.methods.removeAddress = async function(addressId){
    this.addresses = this.addresses.filter(
        (id)=> id.toString() !== addressId.toString()
    );
    return await this.save();
};

//Static methods...

userSchema.statics.findByEmail = function(email){
    return this.findOne({ email });
};

userSchema.statics.getAdmins = function(){
    return this.find( {role : "admin"} );
};

const User = mongoose.model("User", userSchema);
export default User;