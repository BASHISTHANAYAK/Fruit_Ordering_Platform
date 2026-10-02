import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitForm } from "./productFunction.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/navbar.js";
import { setProducts } from "../../ReduxPersist/actions.js";

// Handy sample presets so admin can quickly create real-looking products with 1 click!
const PRESETS = [
  {
    name: "Crisp Red Apple",
    category: "Fruit",
    price: "120",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80",
    description: "Crispy, sweet, and juicy red apples freshly harvested from organic orchards.",
  },
  {
    name: "Fresh Organic Broccoli",
    category: "Vegetable",
    price: "80",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&q=80",
    description: "Nutrient-packed green broccoli crowns, crisp and full of vital vitamins.",
  },
  {
    name: "Sweet Alphonso Mango",
    category: "Fruit",
    price: "250",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80",
    description: "Aromatic and pulpy golden Alphonso mangoes, hand-picked at peak ripeness.",
  },
  {
    name: "Vine Ripe Tomatoes",
    category: "Vegetable",
    price: "45",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80",
    description: "Plump, red tomatoes bursting with rich natural flavor for your daily cooking.",
  },
  {
    name: "Fresh Orange Carrots",
    category: "Vegetable",
    price: "60",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80",
    description: "Crunchy sweet carrots straight from the earth, washed and ready to enjoy.",
  },
  {
    name: "Sweet Yellow Bananas",
    category: "Fruit",
    price: "50",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80",
    description: "Rich in potassium and natural energy, perfectly ripe and naturally sweetened.",
  },
];

const CreateProduct = () => {
  const { _id } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [productDetails, setproductDetails] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "Fruit",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleEnterDetails = (e) => {
    const { name, value } = e.target;
    setproductDetails((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setPreviewError(false);
  };

  const applyPreset = (preset) => {
    setproductDetails(preset);
    setPreviewError(false);
    toast.info(`Filled with ${preset.name} details! ✨`, { autoClose: 1200 });
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    if (!productDetails.name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (!productDetails.price || Number(productDetails.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!productDetails.category) {
      toast.error("Please select a category");
      return;
    }
    if (!productDetails.image.trim()) {
      toast.error("Please provide an image URL");
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitForm(productDetails, _id);
      if (result.status === 201 || result.status === 200) {
        // Clear cached products in Redux so homepage will fetch latest listings
        dispatch(setProducts([]));

        toast.success("✅ Product published successfully!", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored",
        });
        setTimeout(() => navigate("/adminDashboard"), 1500);
      } else {
        toast.error(result?.data?.message || "Failed to create product");
      }
    } catch (error) {
      toast.error(error.message || "Error creating product");
    } finally {
      setIsLoading(false);
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

  const helpTextStyle = {
    fontSize: "0.75rem",
    color: "#64748b",
    marginTop: "0.35rem",
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
            ➕ Add New Farm Produce
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>
            List your freshly harvested fruit or vegetable on the Vegefoods marketplace.
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
        {/* Quick Presets Recommendation Bar */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.2rem" }}>⚡</span>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1e293b" }}>
              Quick Fill with Popular Templates (Click to fill all fields):
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 0.9rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  border: "1.5px solid #cbd5e1",
                  background: "#f8fafc",
                  color: "#334155",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#16a34a";
                  e.currentTarget.style.color = "#16a34a";
                  e.currentTarget.style.background = "#f0fdf4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#334155";
                  e.currentTarget.style.background = "#f8fafc";
                }}
              >
                <span>{p.category === "Fruit" ? "🍎" : "🥦"}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="two-col-layout">
          {/* Main Form Box */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e2e8f0",
              padding: "2rem",
            }}
          >
            <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Field 1: Name */}
              <div>
                <label style={labelStyle}>
                  🏷️ Product Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Crisp Red Apples"
                  onChange={handleEnterDetails}
                  value={productDetails.name}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
                <div style={helpTextStyle}>The product title buyers will see in the catalog.</div>
              </div>

              {/* Field 2 & 3: Category & Price */}
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
                    required
                    onChange={handleEnterDetails}
                    value={productDetails.category}
                    onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                  >
                    <option value="Fruit">🍎 Fruit</option>
                    <option value="Vegetable">🥦 Vegetable</option>
                  </select>
                  <div style={helpTextStyle}>Choose Fruit or Vegetable.</div>
                </div>

                <div>
                  <label style={labelStyle}>
                    💰 Price (in ₹) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    style={inputStyle}
                    type="number"
                    name="price"
                    required
                    placeholder="100"
                    min="1"
                    onChange={handleEnterDetails}
                    value={productDetails.price}
                    onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                  />
                  <div style={helpTextStyle}>Price per unit or kg in Rupees.</div>
                </div>
              </div>

              {/* Field 4: Description */}
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
                  placeholder="Describe your produce (e.g. Naturally sweet, farm-fresh, pesticide-free)..."
                  onChange={handleEnterDetails}
                  value={productDetails.description}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
                <div style={helpTextStyle}>Highlight freshness, taste, and harvesting details.</div>
              </div>

              {/* Field 5: Image URL */}
              <div>
                <label style={labelStyle}>
                  🖼️ Image URL <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputStyle}
                  type="url"
                  name="image"
                  required
                  placeholder="https://images.unsplash.com/..."
                  onChange={handleEnterDetails}
                  value={productDetails.image}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
                <div style={helpTextStyle}>
                  Direct HTTPS image URL (or click any template at the top to auto-fill).
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.95rem",
                  background: isLoading ? "#94a3b8" : "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: isLoading ? "none" : "0 4px 14px rgba(22, 163, 74, 0.35)",
                  marginTop: "0.5rem",
                  transition: "all 0.2s",
                }}
              >
                {isLoading ? (
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
                    Publishing Listing...
                  </>
                ) : (
                  "🚀 Save & Publish Product"
                )}
              </button>
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
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>👁️</span> Live Marketplace Preview
              </div>

              {/* Preview Image */}
              <div style={{ height: "190px", background: "#f0fdf4", overflow: "hidden", position: "relative" }}>
                {productDetails.image && !previewError ? (
                  <img
                    src={productDetails.image}
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#16a34a",
                    }}
                  >
                    <span style={{ fontSize: "3rem" }}>
                      {productDetails.category === "Vegetable" ? "🥦" : "🍎"}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                      Image preview will show here
                    </span>
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
                    background: productDetails.category === "Fruit" ? "rgba(234, 88, 12, 0.9)" : "rgba(22, 163, 74, 0.9)",
                    color: "#ffffff",
                    textTransform: "uppercase",
                  }}
                >
                  {productDetails.category}
                </span>
              </div>

              {/* Preview Body */}
              <div style={{ padding: "1.25rem" }}>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.25rem", color: "#0f172a" }}>
                  {productDetails.name || <span style={{ color: "#cbd5e1" }}>Product Name</span>}
                </div>
                <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#15803d", marginBottom: "0.5rem" }}>
                  ₹{productDetails.price || 0}{" "}
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>/ unit</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5, minHeight: "40px" }}>
                  {productDetails.description || (
                    <span style={{ color: "#cbd5e1" }}>Description will appear here...</span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      background: "#f0fdf4",
                      color: "#15803d",
                      borderRadius: "8px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    🛒 Add to Cart (Customer View)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
