import Category from "../models/category.model.js";

const createCategory = async(req, res)=>{
    try{

        const {name, description} = req.body;
        const isExisting = await Category.findOne({name: name.trim()});
        if(isExisting){
            return res.status(409).json({
                success : false,
                message : "Category Already Exists"
            });
        }
        const category = await Category.create(
            {
                name: name.trim(),
                description
            }
        );
        return res.status(201)
            .json({
                success : true,
                message : "Category Created Successfully",
                data : category
            });
    }catch(error){
        return res.status(500)
            .json({
                success : false,
                message : error.message || "Server error"
            });
    }
};

const getAllCategories = async(req, res)=>{
    try {
        const categories = await Category.getAllCategory();
        return res.status(200)
            .json(
                {
                    success : true,
                    count : categories.length,
                    data : categories,
                }
            );
    } catch (error) {
        return res.status(500)
            .json(
                {
                    success : false,
                    message : error.message || "Server error"
                }
            );
    }
};

const getCategoryById = async(req, res)=>{
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
          return res.status(404).json({
            success: false,
            message: "Category not found",
          });
        }
        return res.status(200).json({
          success: true,
          data: category,
        });
    } catch (error) {
        res.status(400)
            .json(
                {
                    success : false,
                    message : error.message || "Invalid Category Id"
                }
            );
    }
};

const updateCategory = async(req, res)=>{
    try {
        const {id} = req.params;
        const {name, description} = req.body;

        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json({
                success : false,
                message : "Category not found"
            });
        }
        if(name) category.name = name.trim();
        if(description !== undefined) category.description = description;
        await category.save();

        return res.status(200).json({
            success : true,
            message : "Category updated successfully",
            data : category
        });
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : error.message || "Invalid request"
        });
    }
}

const deleteCategory = async(req, res)=>{
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if(!category){
            return res.status(404).json({
                success : true,
                message : "Category not found"
            });
        }

        await category.deleteOne();
        
        return res.status(200).json({
            success : true,
            message : "Category Deleted Successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : error.message || "Invalid Category Id"
        });
    }
}

export {createCategory, getAllCategories, 
        getCategoryById, updateCategory, 
        deleteCategory};