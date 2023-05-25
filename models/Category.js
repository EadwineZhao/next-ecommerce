import { Schema, model, models, SchemaTypes } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: SchemaTypes.ObjectId, ref: "Category"},
  properties: [{ type: Object }],
});

// CategorySchema.pre("save", function(next) {
//     console.log("this",this)
//     // if(this.parent === "defaultSelected") {
//     //     this.parent === undefined
//     // }
//     next();
// })

export const Category = models.Category || model("Category", CategorySchema);
