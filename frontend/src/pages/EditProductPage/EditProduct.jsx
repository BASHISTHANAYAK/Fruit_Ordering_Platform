import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Axios_Interceptor/api.js"; // Make sure the API interceptor is set up
import NavBar from "../../components/NavBar/navbar.js";
import { useSelector } from "react-redux";

const EditProduct = () => {
  
  const reduxData = useSelector((state) => state);
  // console.log("EditProduct redux",reduxData)
  const navigate = useNavigate();
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Vegetable", // Default to a valid category
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the product details when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/getProductById/${productId}`); // Fetch the product details
        console.log("fetchProduct-", res);
        if (res.data) {
          setProduct(res.data); // Set product data to state
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Error fetching product data");
      }
    };
    fetchProduct();
  }, [productId]); // Run this effect when productId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("product-", product);
    setLoading(true);

    try {
      const res = await api.put(`/editProduct/${productId}`, {
        ...product,
        adminId: reduxData._id, // You need to pass the admin's ID here (e.g., from Redux state)
      });
      console.log(res);
      alert("Product updated successfully");
      navigate("/adminDashboard"); // Redirect to admin dashboard after edit
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>; // Show loading indicator while data is being fetched

  return (
    <div>
      <NavBar />

      <h1>Edit Product</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={product.name || ""}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={product.price || ""}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={product.image || ""}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Category:
          <select
            name="category"
            value={product.category || "Vegetable"}
            onChange={handleChange}
            required
          >
            <option value="Vegetable">Vegetable</option>
            <option value="Fruit">Fruit</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
