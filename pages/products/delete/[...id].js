import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const id = router.query?.id;

  const deleteProduct = async () => {
    await axios.delete("/api/products?id=" + id);
    router.push("/products");
  };

  useEffect(() => {
    id &&
      axios.get("/products?id=" + id).then((res) => {
        setProductInfo(res.data);
      });
  }, [id]);
  return (
    <Layout>
      <h1 className="my-2 text-center">
        Do you really want to delete <span>{}</span>
      </h1>
      <div className="flex justify-center gap-2">
        <button onClick={deleteProduct} className="btn-red">
          Yes
        </button>
        <button
          onClick={() => router.push("/products")}
          className="btn-default"
        >
          No
        </button>
      </div>
    </Layout>
  );
}
