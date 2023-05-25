import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProdcutPage() {
  const [productInfo, setProductInfo] = useState(null);
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    id &&
      axios.get("/api/products?id=" + id).then((res) => {
        setProductInfo(res.data);
      });
  }, [id]);

  return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm initialValue={productInfo} />}
    </Layout>
  );
}
