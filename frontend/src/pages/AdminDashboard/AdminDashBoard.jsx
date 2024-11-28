import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import NavBar from "../../components/NavBar/navbar.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../Axios_Interceptor/api.js";
import adminDashCss from "./AdminDash.module.css";

const AdminDashBoard = () => {
  const red = useSelector((state) => state);
  console.log("Admin dashboard, redux->", red);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isAdminProductsEmpty, setIsAdminProductsEmpty] = useState(false);

  // Fetch products created by the admin
  async function fetchProducts() {
    try {
      const res = await api.get(`/getProducts/${red._id}`); // Make sure red._id is the adminId
      console.log("Fetched Products:", res.data.products);
      setProducts(res.data.products);
      if (res.data.products > 0) {
        setIsAdminProductsEmpty(true);
      } else {
        setIsAdminProductsEmpty(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again.");
    }
  }

  //delete
  const handleDelete = async (productId) => {
    console.log("productId-", productId);
    try {
      let res = await api.delete(`/deleteProduct/${productId}`);
      console.log("res-", res);
      alert("Product deleted successfully");
      fetchProducts(); // Refetch products after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <NavBar />
      <h1>Hi {red.name}, Welcome</h1>
      <section>
        <button onClick={fetchProducts}>Get your products</button>
        <button onClick={() => navigate("/createProduct")}>
          Create Product
        </button>
      </section>

      {/* Display fetched products */}
      {products.length > 0 ? (
        <section>
          <h2>Your Products</h2>
          <div className={adminDashCss.productsDIV}>
            {products.map((product) => (
              <div key={product._id} className={adminDashCss.aProductCard}>
                <h3>{product.name}</h3>
                <p>Price: ₹{product.price}</p>
                <p>Description: {product.description}</p>
                {product.image && (
                  <img src={product.image} alt={product.name} />
                )}
                <p>Category: {product.category}</p>
                <p>Created By: {product.admin.name}</p>

                <button onClick={() => navigate(`/editProduct/${product._id}`)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        isAdminProductsEmpty && <p>No products found</p>
      )}
    </>
  );
};

export default AdminDashBoard;
