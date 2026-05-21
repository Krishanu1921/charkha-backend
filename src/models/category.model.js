import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//Instance methods...

categorySchema.methods.updateName =async function(newName){
    this.name = newName;
    return await this.save();
};

//Static methods...

categorySchema.statics.findByName = function(name){
    return this.findOne({ name });
};

categorySchema.statics.getAllCategory = async function(){
    return await this.find().sort({createdAt : -1});
};

const Category = mongoose.model("Category", categorySchema);
export default Category;