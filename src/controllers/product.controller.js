import { uploadOnCloudinary } from "../config/cloudinary.js";
import Product from "../models/product.model.js";
const createProduct = async(req, res)=>{
    try {
        const {title, description, price, discountPrice, brand, categoryId, stock} = req.body;
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
            success: false,
            message: "Product images are required",
        });
    }
        let uploadedImages = [];
        for(const file of files){
            const cloudinary_response = await uploadOnCloudinary(file.path);
            
            if(!cloudinary_response){
                return res.status(500).json({
                    success : false,
                    message : "Image upload failed"
                });
            }
            uploadedImages.push(
                {
                    url : cloudinary_response.secure_url,
                    public_id : cloudinary_response.public_id,
                }
            );
        }
            const product = await Product.create(
                {
                    title,
                    description,
                    price,
                    discountPrice,
                    brand,
                    categoryId,
                    stock,
                    images : uploadedImages
                }
            );
            return res.status(201).json({
                    success : true,
                    message : "Product created successfully",
                    data : product });
    }
    catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message || "Internal Server Error"
        });
    }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getProductById = async(req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id).populate("categoryId", "name");
        if(!product){
            return res.status(404).json({
                success : false,
                message : "Product not found"
            });
        }
            return res.status(200).json({
                success : true,
                message : "Product found successfully",
                data : product
            });
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : error.message || "Invalid Product Id"
        })
    }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ categoryId }).populate(
      "categoryId",
      "name"
    ).sort({createdAt : -1});
    if(!products){
            return res.status(404).json({
                success : false,
                message : "Product not found"
            });
        }
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid category id",
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    const products = await Product.searchProducts(keyword);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid product id",
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    product.stock = stock;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request",
    });
  }
};

const uploadProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body; // array of image URLs

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.images = [...product.images, ...images];
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};

export {createProduct,
        getAllProducts,
        getProductById,
        getProductsByCategory,
        searchProducts,
        updateProduct,
        deleteProduct,
        updateStock,
        uploadProductImages,
};