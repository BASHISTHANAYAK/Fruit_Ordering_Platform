// ----------------------------------------------------------------------------------------------------------------------
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import NavBar from "../../components/NavBar/navbar.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../Axios_Interceptor/api.js";
import adminDashCss from "./AdminDash.module.css";

const AdminDashBoard = () => {
  const adminDetails = useSelector((state) => state);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isAdminProductsEmpty, setIsAdminProductsEmpty] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false); // Toggle orders section
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products created by the admin
  async function fetchProducts() {
    try {
      const res = await api.get(`/getProducts/${adminDetails._id}`);
      setProducts(res.data.products);
      setIsAdminProductsEmpty(res.data.products.length === 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(error?.response?.data?.message || error.message);
    }
  }

  // Fetch placed orders for the admin's products
  async function getPlaceOrders() {
    setIsLoading(true);
    try {
      const res = await api.get(
        `/getAllPlacedOrdersByAdmin/${adminDetails._id}`
      );
      console.log("getPlaceOrders:-", res.data.orders);
      setOrders(res.data.orders);
      setShowOrders(true);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Delete a product
  const handleDelete = async (productId) => {
    try {
      await api.delete(`/deleteProduct/${productId}`);
      alert("Product deleted successfully");
      fetchProducts(); // Refetch products after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error?.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <NavBar />
      <h1>Hi {adminDetails.name}, Welcome</h1>
      <section className={adminDashCss.buttons_Sec}>
        <button onClick={fetchProducts}>Get your products</button>
        <button onClick={() => navigate("/createProduct")}>
          Create Product
        </button>
        <button onClick={getPlaceOrders}>Get all placed orders</button>
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
                <button onClick={() => navigate(`/editProduct/${product._id}`)}>
                  Edit
                </button>
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

      {/* Display placed orders */}
      {showOrders && (
        <section>
          <h2>Placed Orders</h2>
          {isLoading ? (
            <p>Loading orders...</p>
          ) : orders.length > 0 ? (
            <div>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={adminDashCss.orderCard}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    margin: "10px 0",
                  }}
                >
                  <h3>Order ID: {order._id}</h3>
                  <p>
                    <strong>Buyer:</strong> {order.buyer.name} (
                    {order.buyer.email})
                  </p>
                  <p>
                    <strong>Delivery Address:</strong>{" "}
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    , {order.deliveryAddress.state},{" "}
                    {order.deliveryAddress.postalCode},{" "}
                    {order.deliveryAddress.country}
                  </p>
                  <p>
                    <strong>Contact:</strong> {order.contactInfo}
                  </p>
                  <h4>Ordered Items:</h4>
                  <ul>
                    {order?.products?.map((objec) => (
                      <li key={objec?.product?._id}>
                        {objec?.product?.name}- Quantity:{objec?.quantity}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Total Price:</strong> ₹{order.totalPrice}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No placed orders found.</p>
          )}
        </section>
      )}
    </>
  );
};

export default AdminDashBoard;
