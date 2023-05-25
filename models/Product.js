import { Schema, SchemaTypes, model, models } from "mongoose";

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: SchemaTypes.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
  },
  properties : {
    type: Object,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [
      {
        type: String,
      },
    ],
  },
});

// module.exports = mongoose.model.Product || mongoose.model("Product", ProductSchema)
export const Product = models.Product || model("Product", ProductSchema);
