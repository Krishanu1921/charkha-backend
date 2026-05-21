import mongoose, {Schema, Types} from "mongoose";

const productSchema = new Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true
        },
        description : {
            type : String,
            required : true,
            trim : true
        },
        price : {
            type : Number,
            required : true,
            min : 1
        },
        discountPrice : {
            type : Number
        },
        brand : {
            type : String,
            trim : true
        },
        categoryId : { 
            type : Schema.Types.ObjectId,
            ref : "Category",
            required : true
        },
        images : [
            {
                url : {
                    type : String,
                    required : true,
                    trim : true
                },
                public_id : {
                    type : String,
                    required : true,
                    trim : true
                },
            }
        ],
        stock : {
            type : Number,
            required : true
        },
        ratingsAverage : {
            type : Number,
            default : 0,
            min : 0,
            max : 5
        },
        ratingsCount : {
            type : Number,
            default : 0
        }
    },{timestamps : true}
);

//Instance methods...

productSchema.methods.getFinalPrice = function(){
    return this.discountPrice || this.price;
};

productSchema.methods.isInStock = function(qty = 1){
    return this.stock >= qty;
};

productSchema.methods.decreaseStock = async function(qty = 1){
    if(this.stock < qty){
        throw new Error("Not Enough Stock");
    }
    this.stock -= qty;
    return await this.save();
};

productSchema.methods.increaseStock = async function(qty = 1){
    this.stock += qty;
    return await this.save();
};

productSchema.methods.updateRatings = async function(newRating){
    const totalRating = this.ratingsAverage * this.ratingsCount;
    this.ratingsCount++;
    this.ratingsAverage = (totalRating + newRating)/this.ratingsCount;
    return await this.save();
};

//static methods...

productSchema.statics.getByCategory = function(categoryId){
    return this.find({categoryId});
};

productSchema.statics.getInStock = function(){
    return this.find({stock : { $gt: 0}});
};

productSchema.statics.searchProducts = function(keyword){
    return this.find(
        {title : {$regex : keyword, $options : "i"}}
        ).populate("categoryId", "name").sort({createdAt : -1});
};

productSchema.statics.getTopRated = function(){
    return this.find().sort({ ratingsAverage : -1 }).limit(limit);
};

productSchema.statics.getDiscounted = function () {
  return this.find({ discountPrice: { $exists: true, $ne: null } });
};

const Product = mongoose.model("Product", productSchema);
export default Product;