import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === "GET") {
    if (req.query?.id !== undefined) {
      const product = await Product.findOne({ _id: req.query.id });
      res.json(product);
    } else {
      const products = await Product.find();
      res.json(products);
    }
  }

  if (method === "POST") {
    const { title, category, properties, description, price, images } =
      req.body;
    const product = new Product({
      title,
      category: category || undefined,
      properties: properties || undefined,
      description,
      price,
      images,
    });
    await product.save();
    res.json(product);
  }

  if (method === "PUT") {
    const { title, category, properties, description, price, _id, images } =
      req.body;
    if (category === "") {
      const product = await Product.updateOne(
        { _id },
        {
          $set: { title, description, price, images },
          $unset: { category: "", properties: "" },
        }
      );
      res.json(product);
    } else {
      const product = await Product.updateOne(
        { _id },
        { $set: { title, category, properties, description, price, images } }
      );
      res.json(product);
    }
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
