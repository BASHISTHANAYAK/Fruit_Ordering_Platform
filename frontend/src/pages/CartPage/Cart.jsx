import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/navbar";
import api from "../../Axios_Interceptor/api.js";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCart } from "../../ReduxPersist/actions.js";

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

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryDetails, setDeliveryDetails] = useState({
    deliveryName: "",
    contactInfo: "",
    street: "",
    city: "",
    state: "",
    postalcode: "",
    country: "",
  });
  const [orders, setOrders] = useState([]);
  const [activeView, setActiveView] = useState("cart"); // "cart" | "orders"
  const [isPlacing, setIsPlacing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const { _id } = useSelector((state) => state);

  async function getCart() {
    setIsLoading(true);
    setActiveView("cart");
    try {
      let res = await api.get(`/getcartProducts/${_id}`);
      const list = res.data?.cart || [];
      setCartData(list);
      dispatch(setCart(list));
      let total = list.reduce(
        (acc, curr) => acc + (curr.product?.price || 0) * (curr.quantity || 1),
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (_id) {
      getCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  async function placeOrder(event) {
    event.preventDefault();
    const fields = Object.values(deliveryDetails);
    if (fields.some((f) => !f.trim())) {
      toast.error("Please fill in all delivery details");
      return;
    }
    if (cartData.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacing(true);
    try {
      await api.post("/placeOrder", {
        buyerId: _id,
        cartItems: cartData.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        totalPrice,
        ...deliveryDetails,
      });

      toast.success("Order placed successfully! 🎉 Confirmation sent to your email.", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      setCartData([]);
      dispatch(setCart([]));
      setTotalPrice(0);
      setDeliveryDetails({
        deliveryName: "",
        contactInfo: "",
        street: "",
        city: "",
        state: "",
        postalcode: "",
        country: "",
      });

      // Switch to orders view after short delay
      setTimeout(() => {
        fetchOrders();
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  }

  async function fetchOrders() {
    setActiveView("orders");
    setIsLoading(true);
    try {
      const res = await api.get(`/getOrders/${_id}`);
      setOrders(res.data?.orders || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }

  async function changeQuantity(productId, qty) {
    setUpdatingItemId(productId);
    try {
      let result = await api.post(`/addToCart/${_id}`, {
        productId,
        quantity: Number(qty),
        areYouUpdatingQuantity: true,
      });
      if (result.status === 200) {
        toast.success("Quantity updated ✓", { autoClose: 1000 });
        await getCart();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function removeFrom_Cart(objToDeleteId) {
    setUpdatingItemId(objToDeleteId);
    try {
      let result = await api.delete(`/removeFromCart/${_id}/${objToDeleteId}`);
      if (result.status === 200) {
        toast.success("Item removed 🗑️", { autoClose: 1000 });
        await getCart();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setUpdatingItemId(null);
    }
  }

  const discount = Math.ceil(totalPrice / 10);
  const finalTotal = totalPrice - discount;

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.75rem 1rem",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    color: "#0f172a",
    outline: "none",
    background: "#ffffff",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#475569",
    marginBottom: "0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

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

      {/* Header Banner */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #16a34a 100%)",
          padding: "3.5rem 2rem 4rem",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
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
            Buyer Checkout
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              marginBottom: "0.5rem",
            }}
          >
            My Shopping Cart
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "1.05rem" }}>
            Review your basket of fresh produce and place your order.
          </p>
        </div>
      </div>

      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "2rem 2rem 4rem",
        }}
      >
        {/* Tab Toggle */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "2rem",
            background: "#ffffff",
            padding: "0.75rem 1rem",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            width: "fit-content",
          }}
        >
          <button
            onClick={getCart}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.4rem",
              background: activeView === "cart" ? "#16a34a" : "#f1f5f9",
              color: activeView === "cart" ? "#ffffff" : "#475569",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>🛒</span> My Cart {cartData.length > 0 && `(${cartData.length})`}
          </button>

          <button
            onClick={fetchOrders}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.4rem",
              background: activeView === "orders" ? "#16a34a" : "#f1f5f9",
              color: activeView === "orders" ? "#ffffff" : "#475569",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>📦</span> Order History
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
            <div style={{ color: "#64748b", fontWeight: 600 }}>Loading...</div>
          </div>
        )}

        {/* CART VIEW */}
        {!isLoading && activeView === "cart" && (
          <>
            {cartData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "5rem 2rem",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                  Your cart is empty
                </h3>
                <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                  Looks like you haven't added any fresh fruits or vegetables yet.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.85rem 1.8rem",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "999px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.3)";
                  }}
                >
                  🍎 Browse Fresh Harvest
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "2.5rem",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                {/* Cart Items List */}
                <div style={{ flex: "1 1 580px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {cartData.map((obj) => (
                    <div
                      key={obj._id}
                      style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        padding: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1.25rem",
                        flexWrap: "wrap",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <div
                        style={{
                          width: "84px",
                          height: "84px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: "#f0fdf4",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={obj?.product?.image}
                          alt={obj?.product?.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80";
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: "160px" }}>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", marginBottom: "0.2rem" }}>
                          {obj?.product?.name}
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#15803d" }}>
                          ₹{obj?.product?.price}{" "}
                          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>/ unit</span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.2rem" }}>
                          Subtotal: <strong>₹{(obj?.product?.price || 0) * (obj?.quantity || 1)}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Qty:</label>
                        <select
                          value={obj?.quantity}
                          disabled={updatingItemId === obj?.product?._id || updatingItemId === obj?._id}
                          onChange={(e) => changeQuantity(obj.product._id, e.target.value)}
                          style={{
                            padding: "0.55rem 0.75rem",
                            border: "1.5px solid #cbd5e1",
                            borderRadius: "8px",
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            background: updatingItemId === obj?.product?._id ? "#f1f5f9" : "#ffffff",
                            cursor: updatingItemId === obj?.product?._id ? "not-allowed" : "pointer",
                            outline: "none",
                            opacity: updatingItemId === obj?.product?._id ? 0.7 : 1,
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>

                        <button
                          disabled={updatingItemId === obj?._id || updatingItemId === obj?.product?._id}
                          onClick={() => removeFrom_Cart(obj._id)}
                          style={{
                            width: "38px",
                            height: "38px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: updatingItemId === obj?._id ? "#f1f5f9" : "#fef2f2",
                            border: "1px solid #fee2e2",
                            borderRadius: "8px",
                            cursor: updatingItemId === obj?._id ? "not-allowed" : "pointer",
                            fontSize: "1rem",
                            color: "#dc2626",
                            transition: "all 0.2s",
                          }}
                          title="Remove item"
                        >
                          {updatingItemId === obj?._id ? "⏳" : "🗑️"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Side: Order Summary & Delivery Form */}
                <div style={{ flex: "1 1 380px", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Summary Box */}
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      padding: "1.5rem",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.2rem" }}>
                      Order Summary
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#475569" }}>
                        <span>Items Subtotal ({cartData.length})</span>
                        <span>₹{totalPrice}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#16a34a", fontWeight: 600 }}>
                        <span>First Order Discount (10%)</span>
                        <span>-₹{discount}</span>
                      </div>
                      <div style={{ height: "1px", background: "#e2e8f0", margin: "0.5rem 0" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 900, color: "#0f172a" }}>
                        <span>Total Due</span>
                        <span style={{ color: "#15803d" }}>₹{finalTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Form */}
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      padding: "1.5rem",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.2rem" }}>
                      📍 Shipping &amp; Delivery Address
                    </h2>

                    <form onSubmit={placeOrder} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input
                          style={inputStyle}
                          type="text"
                          name="deliveryName"
                          placeholder="Recipient full name"
                          value={deliveryDetails.deliveryName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>Contact Phone *</label>
                        <input
                          style={inputStyle}
                          type="tel"
                          name="contactInfo"
                          placeholder="Phone number"
                          value={deliveryDetails.contactInfo}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>Street Address *</label>
                        <input
                          style={inputStyle}
                          type="text"
                          name="street"
                          placeholder="House/Flat, Street name"
                          value={deliveryDetails.street}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <label style={labelStyle}>City *</label>
                          <input
                            style={inputStyle}
                            type="text"
                            name="city"
                            placeholder="City"
                            value={deliveryDetails.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>State *</label>
                          <input
                            style={inputStyle}
                            type="text"
                            name="state"
                            placeholder="State"
                            value={deliveryDetails.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <label style={labelStyle}>Postal Code *</label>
                          <input
                            style={inputStyle}
                            type="text"
                            name="postalcode"
                            placeholder="PIN / Zip"
                            value={deliveryDetails.postalcode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Country *</label>
                          <input
                            style={inputStyle}
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={deliveryDetails.country}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isPlacing || cartData.length === 0}
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.95rem",
                          background: isPlacing
                            ? "#94a3b8"
                            : "linear-gradient(135deg, #16a34a, #15803d)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: 700,
                          fontSize: "1rem",
                          cursor: isPlacing ? "not-allowed" : "pointer",
                          fontFamily: "inherit",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          boxShadow: "0 4px 14px rgba(22, 163, 74, 0.35)",
                        }}
                      >
                        {isPlacing ? "Processing Order..." : "🚀 Place Order Now"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ORDERS VIEW */}
        {!isLoading && activeView === "orders" && (
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>
              Your Past Orders ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📭</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                  No Orders Placed Yet
                </h3>
                <p style={{ color: "#64748b" }}>
                  Once you place an order, its real-time shipping status will appear right here.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {orders.map((order, i) => (
                  <div
                    key={order._id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      overflow: "hidden",
                    }}
                  >
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
                          Order #{i + 1}
                        </span>
                        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e293b" }}>
                          {order._id}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                          Placed Date
                        </span>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                          Total Amount
                        </span>
                        <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#15803d" }}>
                          ₹{order.totalPrice}
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", fontSize: "0.9rem", color: "#475569" }}>
                      📍 <strong>Shipping To:</strong> {order.deliveryAddress?.street},{" "}
                      {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{" "}
                      {order.deliveryAddress?.postalCode} ({order.deliveryName} • {order.contactInfo})
                    </div>

                    <div style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                        Harvest Items:
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {order.products.map((item) => (
                          <div
                            key={item?.product?._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "#f8fafc",
                              padding: "0.75rem 1rem",
                              borderRadius: "10px",
                              flexWrap: "wrap",
                              gap: "1rem",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                              <div
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  background: "#f0fdf4",
                                }}
                              >
                                <img
                                  src={item?.product?.image}
                                  alt={item?.product?.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&q=80";
                                  }}
                                />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                                  {item?.product?.name}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                                  ₹{item?.product?.price} × {item?.quantity}
                                </div>
                              </div>
                            </div>

                            <StatusBadge status={item?.status} />
                          </div>
                        ))}
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

export default Cart;
