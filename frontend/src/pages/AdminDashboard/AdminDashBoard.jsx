import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../components/NavBar/navbar.js";
import { useNavigate } from "react-router-dom";
import api from "../../Axios_Interceptor/api.js";

const STATUS_CONFIG = {
  Pending: { color: "#d97706", bg: "#fef3c7", icon: "⏳" },
  "In Progress": { color: "#7c3aed", bg: "#ede9fe", icon: "🔄" },
  Delivered: { color: "#16a34a", bg: "#dcfce7", icon: "✅" },
  Shipped: { color: "#2563eb", bg: "#dbeafe", icon: "🚚" },
  Cancelled: { color: "#dc2626", bg: "#fee2e2", icon: "❌" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { color: "#64748b", bg: "#f1f5f9", icon: "•" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 700,
        color: cfg.color,
        background: cfg.bg,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      <span>{cfg.icon}</span> {status}
    </span>
  );
};

const AdminDashBoard = () => {
  const adminDetails = useSelector((state) => state);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // "products" | "orders"
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Fetch admin products
  async function fetchProducts() {
    if (!adminDetails._id) return;
    setIsLoadingProducts(true);
    try {
      const res = await api.get(`/getProducts/${adminDetails._id}`);
      const list = res.data?.products || [];
      setProducts(list);
    } catch (error) {
      // 404 means the admin simply has 0 products yet - do NOT show a toast error!
      if (error?.response?.status === 404) {
        setProducts([]);
      } else {
        console.error("Error fetching admin products:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch products");
      }
    } finally {
      setIsLoadingProducts(false);
    }
  }

  // Fetch placed orders
  async function getPlaceOrders() {
    if (!adminDetails._id) return;
    setIsLoadingOrders(true);
    try {
      const res = await api.get(`/getAllPlacedOrdersByAdmin/${adminDetails._id}`);
      const list = res.data?.orders || [];
      setOrders(list);
    } catch (error) {
      // 404 means the admin has 0 orders placed yet - do NOT show a toast error!
      if (error?.response?.status === 404) {
        setOrders([]);
      } else {
        console.error("Error fetching placed orders:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
      }
    } finally {
      setIsLoadingOrders(false);
    }
  }

  // Automatically fetch on mount so dashboard isn't blank
  useEffect(() => {
    if (adminDetails._id) {
      fetchProducts();
      getPlaceOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminDetails._id]);

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(productId);
    try {
      await api.delete(`/deleteProduct/${productId}`);
      toast.success("Product deleted successfully! 🗑️");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // Update order status with loading state
  async function changeStatus(event, orderId, productId) {
    const status = event.target.value;
    if (!status) return;
    const key = `${orderId}-${productId}`;
    setUpdatingStatusId(key);
    try {
      await api.put(`/updateProductStatus/${orderId}/${productId}`, { status });
      toast.success("Order status updated successfully! 📦");
      getPlaceOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  // Calculate revenue
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
        margin: 0,
        padding: 0,
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <ToastContainer />
      <NavBar />

      {/* Admin Banner Header */}
      <section
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
          padding: "3.5rem 1.5rem 4rem",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.8rem",
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Admin Management Console
          </div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              marginBottom: "0.5rem",
            }}
          >
            Hello, {adminDetails.name || "Admin"}! 👋
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "1rem" }}>
            Monitor and manage your listings, view buyer orders, and update dispatch statuses.
          </p>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "1.5rem 1.5rem 4rem",
        }}
      >
        {/* KPI Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
            marginTop: "-3rem",
            marginBottom: "2.5rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.35rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "#ede9fe",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
              }}
            >
              📦
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1e1b4b" }}>
                {products.length}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                Listed Products
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.35rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "#dcfce7",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
              }}
            >
              🛒
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#15803d" }}>
                {orders.length}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                Total Placed Orders
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.35rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "#fef3c7",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
              }}
            >
              💰
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#b45309" }}>
                ₹{totalRevenue}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                Gross Revenue
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
            background: "#ffffff",
            padding: "1rem 1.25rem",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setActiveTab("products");
                fetchProducts();
              }}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                border: "none",
                background: activeTab === "products" ? "#4338ca" : "#f1f5f9",
                color: activeTab === "products" ? "#ffffff" : "#475569",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>📦</span> My Products ({products.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("orders");
                getPlaceOrders();
              }}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                border: "none",
                background: activeTab === "orders" ? "#4338ca" : "#f1f5f9",
                color: activeTab === "orders" ? "#ffffff" : "#475569",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>🛒</span> Customer Orders ({orders.length})
            </button>
          </div>

          <button
            onClick={() => navigate("/createProduct")}
            style={{
              padding: "0.7rem 1.4rem",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <span>➕</span> Add New Product
          </button>
        </div>

        {/* TAB 1: PRODUCTS LIST */}
        {activeTab === "products" && (
          <div>
            {isLoadingProducts ? (
              <div style={{ textAlign: "center", padding: "4rem" }}>
                <div className="vf-spinner" style={{ marginBottom: "1rem" }} />
                <div style={{ color: "#64748b", fontWeight: 600 }}>Loading your products...</div>
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 1.5rem",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📦</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                  No Products Listed Yet
                </h3>
                <p style={{ color: "#64748b", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                  Get started by adding fresh fruits or vegetables to your store inventory.
                </p>
                <button
                  onClick={() => navigate("/createProduct")}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Create Your First Product
                </button>
              </div>
            ) : (
              <div className="products-grid-container">
                {products.map((product) => (
                  <div
                    key={product._id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                  >
                    {/* Image */}
                    <div style={{ height: "180px", overflow: "hidden", background: "#f8fafc", position: "relative" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80";
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          left: "0.75rem",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "999px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          background: product.category === "Fruit" ? "rgba(234, 88, 12, 0.9)" : "rgba(22, 163, 74, 0.9)",
                          color: "#ffffff",
                          textTransform: "uppercase",
                        }}
                      >
                        {product.category}
                      </span>
                    </div>

                    <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#15803d", marginBottom: "0.5rem" }}>
                        ₹{product.price}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5, flex: 1, marginBottom: "1.2rem" }}>
                        {product.description}
                      </p>

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => navigate(`/editProduct/${product._id}`)}
                          style={{
                            flex: 1,
                            padding: "0.6rem",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          style={{
                            flex: 1,
                            padding: "0.6rem",
                            background: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            opacity: deletingId === product._id ? 0.6 : 1,
                          }}
                        >
                          {deletingId === product._id ? "Deleting..." : "🗑️ Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLACED ORDERS */}
        {activeTab === "orders" && (
          <div>
            {isLoadingOrders ? (
              <div style={{ textAlign: "center", padding: "4rem" }}>
                <div className="vf-spinner" style={{ marginBottom: "1rem" }} />
                <div style={{ color: "#64748b", fontWeight: 600 }}>Loading customer orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 1.5rem",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛒</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                  No Placed Orders Yet
                </h3>
                <p style={{ color: "#64748b", maxWidth: "420px", margin: "0 auto" }}>
                  Orders placed by customers for your harvest will appear here automatically.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {orders.map((order) => (
                  <div
                    key={order._id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: "1.25rem 1.5rem",
                        background: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                          Order Reference
                        </span>
                        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                          #{order._id}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                          Customer Details
                        </span>
                        <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
                          {order.buyer?.name} ({order.buyer?.email})
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                          Order Value
                        </span>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#15803d" }}>
                          ₹{order.totalPrice}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div
                      style={{
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        gap: "1.5rem",
                        flexWrap: "wrap",
                        fontSize: "0.875rem",
                        color: "#475569",
                        background: "#ffffff",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#1e293b" }}>Recipient:</strong> {order.deliveryName}
                      </div>
                      <div>
                        <strong style={{ color: "#1e293b" }}>Contact:</strong> {order.contactInfo}
                      </div>
                      <div>
                        <strong style={{ color: "#1e293b" }}>Shipping Address:</strong>{" "}
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city},{" "}
                        {order.deliveryAddress?.state} - {order.deliveryAddress?.postalCode}
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div style={{ padding: "1.25rem 1.5rem" }}>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Your Harvested Items in this Order:
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {order.products.map((item) => {
                          if (!item.product || item.product.admin !== adminDetails._id) return null;
                          const isUpdating = updatingStatusId === `${order._id}-${item.product._id}`;
                          return (
                            <div
                              key={item.product._id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "#f8fafc",
                                padding: "0.9rem 1.2rem",
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                flexWrap: "wrap",
                                gap: "1rem",
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                                  {item.product.name}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                                  Quantity: <strong>{item.quantity}</strong> × ₹{item.product.price}
                                </div>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                                <StatusBadge status={item.status} />

                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
                                    {isUpdating ? "Updating..." : "Update:"}
                                  </label>
                                  <select
                                    value={item.status}
                                    disabled={isUpdating}
                                    onChange={(e) => changeStatus(e, order._id, item.product._id)}
                                    style={{
                                      padding: "0.4rem 0.8rem",
                                      borderRadius: "8px",
                                      border: "1.5px solid #cbd5e1",
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      color: "#334155",
                                      background: "#ffffff",
                                      cursor: isUpdating ? "not-allowed" : "pointer",
                                      outline: "none",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashBoard;
