import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handler(req, res) {
    const { method } = req;
    const { name, parent, properties } = req.body;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if(method === "GET") {
        const categories = await Category.find().populate("parent");
        res.json(categories);
    }

    if(method === "POST") {

        const category = new Category({ name, parent: parent || undefined, properties });

        await category.save();
        res.json(category);
    }

    if(method === "PUT") {
        if(parent === "") {
          const result =  await Category.updateOne({ _id: req.body._id }, { $unset: { parent: "" }, $set: { name, properties } });
          res.json(result);
        } else {
            const result = await Category.updateOne({ _id: { $eq: req.body._id} }, { $set: { name, parent, properties } });
            res.json(result);
        }
    }

    if(method === "DELETE") {
        if(req.query?.id) {
            await Category.deleteOne({ _id: req.query?.id});
            res.json(true);
        }
    }
}