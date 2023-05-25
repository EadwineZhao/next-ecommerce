import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  initialValue = {
    _id: undefined,
    title: "",
    description: "",
    price: "",
    images: [],
    category: "",
    properties: {},
  },
}) {
  //   const [title, setTitle] = useState(initialValue.title);
  //   const [description, setDescription] = useState(initialValue.description);
  //   const [price, setPrice] = useState(initialValue.price);
  const [product, setProduct] = useState(initialValue);
  const {
    _id: id,
    title,
    category,
    properties,
    images,
    description,
    price,
  } = product;
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const uploadImages = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      setIsUploading(true);
      const res = await axios.post("/api/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProduct((prev) => {
        return { ...prev, images: [...prev.images, ...res.data.links] };
      });
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      const res = await axios.put("/api/products", product);
    } else {
      const res = await axios.post("/api/products", product);
    }
    router.push("/products");
  };

  const updateImageOrder = (images) => {
    setProduct((prev) => ({ ...prev, images }));
  };

  const propertiesToFill = [];
  if (category) {
    let catInfo = categories.find((c) => c._id === category);
    catInfo?.properties && propertiesToFill.push(...catInfo.properties);

    while (catInfo?.parent) {
      propertiesToFill.push(...catInfo.parent.properties);
      catInfo = catInfo.parent;
    }
  }
  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res?.data));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            required
            value={title}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Product Name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="categories">Category</label>
          <select
            value={category}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="">Uncategorized</option>
            {!!categories.length &&
              categories.map((c) => {
                return (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                );
              })}
          </select>
        </div>
        {!!propertiesToFill.length &&
          propertiesToFill.map((p, index) => {
            return (
              <div key={index} className="flex flex-col gap-2">
                <label className="">
                  {p.name[0].toUpperCase() + p.name.substring(1)}
                </label>
                <select
                  value={properties?.[p.name] || ""}
                  onChange={(e) =>
                    setProduct((prev) => {
                      return {
                        ...prev,
                        properties: {
                          ...properties,
                          [p.name]: e.target.value,
                        },
                      };
                    })
                  }
                >
                  <option value="">Please select {p.name}</option>
                  {!!p.values.length &&
                    p.values.map((v, index) => {
                      return (
                        <option key={index} value={v}>
                          {v}
                        </option>
                      );
                    })}
                </select>
              </div>
            );
          })}

        <div className="flex flex-col gap-1 ">
          <label>Photos</label>
          <div className="flex gap-4 flex-wrap">
            {!!images?.length && (
              <ReactSortable
                list={product.images}
                setList={updateImageOrder}
                className="flex gap-1 flex-wrap justify-start"
              >
                {images.map((link, index) => {
                  return (
                    <div
                      key={index}
                      className="relative h-24 w-24 overflow-hidden rounded-sm bg-white p-4 shadow-sm border border-gray-200"
                    >
                      <img
                        src={link}
                        alt="photo"
                        className=" h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
              </ReactSortable>
            )}

            {isUploading && (
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg">
                <Spinner />
              </div>
            )}
            <label
              htmlFor="images"
              className="flex flex-col h-24 w-24 text-primary cursor-pointer items-center justify-center gap-1 rounded-sm bg-white shadow-sm border border-primary p-1 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                />
              </svg>
              <span>Add images</span>
              <input
                type="file"
                id="images"
                onChange={uploadImages}
                className="hidden"
                multiple
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="price">Price (in USD)</label>
          <input
            type="number"
            id="price"
            value={price}
            required
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, price: e.target.value }))
            }
            placeholder="Price"
          />
        </div>
        <div>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
