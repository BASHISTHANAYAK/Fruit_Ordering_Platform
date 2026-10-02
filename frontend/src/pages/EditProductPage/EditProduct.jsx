import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Axios_Interceptor/api.js";
import NavBar from "../../components/NavBar/navbar.js";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setProducts } from "../../ReduxPersist/actions.js";

const EditProduct = () => {
  const reduxData = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Vegetable",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/getProductById/${productId}`);
        if (res.data) {
          setProduct(res.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Error fetching product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setPreviewError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/editProduct/${productId}`, {
        ...product,
        adminId: reduxData._id,
      });

      // Clear cached products in Redux so homepage will fetch fresh listings
      dispatch(setProducts([]));

      toast.success("Product updated successfully! ✅", {
        position: "top-right",
        autoClose: 1500,
        theme: "colored",
      });
      setTimeout(() => navigate("/adminDashboard"), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Error updating product", {
        position: "top-right",
        theme: "colored",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.85rem 1rem",
    border: "2px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s",
    background: "#ffffff",
    display: "block",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#334155",
    marginBottom: "0.4rem",
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
        <NavBar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div className="vf-spinner" />
        </div>
      </div>
    );
  }

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
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
          padding: "3rem 1.5rem 3.5rem",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          <button
            onClick={() => navigate("/adminDashboard")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "rgba(255,255,255,0.75)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
              padding: "0.25rem 0",
              marginBottom: "1rem",
            }}
          >
            ← Back to Dashboard
          </button>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              marginBottom: "0.5rem",
            }}
          >
            ✏️ Edit Product Listing
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>
            Update product title, pricing, category, or photography.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          padding: "2rem 1.5rem 4rem",
        }}
      >
        {error && (
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              borderRadius: "10px",
              color: "#dc2626",
              marginBottom: "1.5rem",
              fontWeight: 600,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div className="two-col-layout">
          {/* Main Edit Form */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e2e8f0",
              padding: "2rem",
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={labelStyle}>
                  🏷️ Product Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  name="name"
                  required
                  value={product.name || ""}
                  onChange={handleChange}
                  placeholder="Product name"
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>
                    📁 Category <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                    name="category"
                    value={product.category || "Vegetable"}
                    onChange={handleChange}
                    required
                    onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                  >
                    <option value="Vegetable">🥦 Vegetable</option>
                    <option value="Fruit">🍎 Fruit</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>
                    💰 Price (₹) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    style={inputStyle}
                    type="number"
                    name="price"
                    required
                    value={product.price || ""}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                    onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  📝 Description <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  style={{
                    ...inputStyle,
                    minHeight: "100px",
                    resize: "vertical",
                    lineHeight: 1.5,
                  }}
                  name="description"
                  required
                  value={product.description || ""}
                  onChange={handleChange}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  🖼️ Image URL <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputStyle}
                  type="url"
                  name="image"
                  value={product.image || ""}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => navigate("/adminDashboard")}
                  style={{
                    flex: 1,
                    padding: "0.85rem",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.85rem",
                    background: saving ? "#94a3b8" : "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    boxShadow: saving ? "none" : "0 4px 14px rgba(22, 163, 74, 0.35)",
                  }}
                >
                  {saving ? (
                    <>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#ffffff",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      Saving Changes...
                    </>
                  ) : (
                    "💾 Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="two-col-preview">
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                position: "sticky",
                top: "90px",
              }}
            >
              <div
                style={{
                  padding: "0.9rem 1.25rem",
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Marketplace Preview
              </div>

              <div style={{ height: "190px", background: "#f0fdf4", overflow: "hidden", position: "relative" }}>
                {product.image && !previewError ? (
                  <img
                    src={product.image}
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                    }}
                  >
                    {product.category === "Fruit" ? "🍎" : "🥦"}
                  </div>
                )}
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

              <div style={{ padding: "1.25rem" }}>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.25rem", color: "#0f172a" }}>
                  {product.name || "Product Name"}
                </div>
                <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#15803d", marginBottom: "0.5rem" }}>
                  ₹{product.price || 0}{" "}
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>/ unit</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                  {product.description || "Description"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
