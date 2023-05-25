import AlertDialog from "@/components/AlertDialog";
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  const fetchCategories = async () => {
    const res = await axios.get("/api/categories");
    setCategories(res.data);
  };

  const resetFormState = () => {
    setName("");
    setParentCategory("");
    setEditedCategory(null);
    setProperties([])
    fetchCategories();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, parent: parentCategory, properties };

    if (editedCategory) {
      data._id = editedCategory?._id;
      await axios.put("/api/categories", data);
    } else {
      await axios.post("/api/categories", data);
    }
    resetFormState();
  };

  const handleClickEdit = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setProperties(category.properties);
    setParentCategory(category.parent?._id || "");
  };

  async function handleDeleteCategory(id) {
    await axios.delete("/api/categories?id=" + id);
    fetchCategories();
  }

  const handlePropertyAdd = () => {
    setProperties((prev) => {
      return (
        [...prev, { name: "", values: []}]
      )
    })
  };
  const handlePropertyRemove = (removeIndex) => {
    const newProperties = properties.filter((p, index) => index !== removeIndex);
    setProperties(newProperties);
  }
  const handlePropertyNameChange = (indexChange, newName) => {
    const newProperties = properties.map((p, index) => {
      if(indexChange === index) {
        return (
          { ...p, name: newName }
        )
      } else {

        return (
          {...p}
        )
      }
    });
    setProperties(newProperties)
  }
  const handlePropertyValuesChange = (indexOn, newValue) => {
    setProperties((prev) => {
      const newProperties = [...prev];
      newProperties[indexOn].values = newValue.split(",");
      return newProperties;
    })
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1>Categories</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="categoryName">
            {editedCategory
              ? `Edit categoray name: ${editedCategory.name}`
              : `New Category Name`}
          </label>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  placeholder="Category name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <select
                  className=""
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <option value="">No parent category</option>
                  {!!categories.length &&
                    categories.map((category) => {
                      return (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <p>Properties</p>
                <button className="btn-default w-fit" type="button" onClick={handlePropertyAdd}>Add new property</button>
                {!!properties.length &&
                  properties.map((p, index) => {
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="property name (example: Color)"
                          value={p.name}
                          onChange={(e) => handlePropertyNameChange(index, e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="values, comma, separated"
                          value={p.values.join(",")}
                          onChange={(e) => handlePropertyValuesChange(index, e.target.value)}
                        />
                        <button type="button" onClick={() => handlePropertyRemove(index)} className="btn-red">
                          Remove
                        </button>
                      </div>
                    );
                  })}
              </div>

              <div className="flex gap-2">
                {editedCategory && (
                  <button
                    type="button"
                    className="btn-default"
                    onClick={() => resetFormState()}
                  >
                    Cancel
                  </button>
                )}
                <button className="btn-primary" type="submit">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
        {!editedCategory && (
          <div className="flex flex-col">
            <table className="basic">
              <thead>
                <tr>
                  <td>Category Name</td>
                  <td>Parent Category</td>
                  <td></td>
                </tr>
              </thead>

              <tbody>
                {!!categories.length > 0 &&
                  categories.map((category) => {
                    const { _id: id } = category;
                    return (
                      <tr key={category._id}>
                        <td>{category.name}</td>
                        <td>{category.parent?.name}</td>
                        <td className="flex gap-1">
                          <button
                            type="button"
                            className="btn-default flex items-center justify-center gap-1 text-sm "
                            onClick={() => handleClickEdit(category)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                            <span>Edit</span>
                          </button>

                          <AlertDialog
                            onClickYes={() =>
                              (function (id) {
                                handleDeleteCategory(id);
                              })(id)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

{
  /* <button
                          type="button"
                          className="btn-primary flex items-center justify-center gap-1 text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4 rounded-sm bg-red-700"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                          <span>Delete</span>
                        </button> */
}
