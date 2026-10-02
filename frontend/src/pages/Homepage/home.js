import React, { useEffect, useState, useRef } from "react";
import NavBar from "../../components/NavBar/navbar.js";
import serverUrl from "../../config.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../Axios_Interceptor/api.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProducts, setCart } from "../../ReduxPersist/actions.js";

const categories = ["All", "Fruit", "Vegetable"];

const Home = () => {
  const reduxData = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use cached products from Redux if available (industry-standard caching)
  const [AllData, setAllData] = useState(reduxData.cachedProducts || []);
  const [filteredData, setFilteredData] = useState(reduxData.cachedProducts || []);
  const [productQuantities, setProductQuantities] = useState({});
  const [cartMap, setCartMap] = useState({}); // { [productId]: quantity }
  const [addingProductId, setAddingProductId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [loading, setLoading] = useState(!reduxData.cachedProducts?.length);
  const [hoveredCard, setHoveredCard] = useState(null);
  const productsRef = useRef(null);

  // Fetch all products: Stale-While-Revalidate pattern (instant cache display + fresh background fetch)
  useEffect(() => {
    async function getAllProduct() {
      // 1. Instant display from in-memory cache if available (eliminates blank loading screen)
      if (reduxData.cachedProducts && reduxData.cachedProducts.length > 0) {
        setAllData(reduxData.cachedProducts);
        setFilteredData(reduxData.cachedProducts);
        setLoading(false);
      } else {
        setLoading(true);
      }

      // 2. ALWAYS fetch fresh catalog from backend so newly added/updated products appear immediately
      try {
        const res = await api.get(`${serverUrl}/getAllProducts`);
        const data = Array.isArray(res.data) ? res.data : [];
        setAllData(data);
        setFilteredData(data);
        dispatch(setProducts(data)); // Update in-memory Redux cache
      } catch (error) {
        console.error("getAllProducts error:", error);
      } finally {
        setLoading(false);
      }
    }
    getAllProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Fetch buyer's cart items to show which products are already in cart with exact quantity
  useEffect(() => {
    async function fetchBuyerCart() {
      if (!reduxData.isLoggedIn || reduxData.role !== "Buyer" || !reduxData._id) {
        setCartMap({});
        setProductQuantities({});
        return;
      }
      try {
        const res = await api.get(`/getcartProducts/${reduxData._id}`);
        const items = res.data?.cart || [];
        dispatch(setCart(items)); // Store in Redux

        const map = {};
        const quantities = {};
        items.forEach((item) => {
          if (item.product && item.product._id) {
            map[item.product._id] = item.quantity;
            quantities[item.product._id] = item.quantity;
          }
        });
        setCartMap(map);
        setProductQuantities((prev) => ({ ...prev, ...quantities }));
      } catch (error) {
        console.error("Error fetching buyer cart:", error);
      }
    }
    fetchBuyerCart();
  }, [reduxData.isLoggedIn, reduxData.role, reduxData._id, dispatch]);

  // Filter products by category & search query
  useEffect(() => {
    let data = [...AllData];
    if (activeCategory !== "All") {
      data = data.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      data = data.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    setFilteredData(data);
  }, [activeCategory, searchQuery, AllData]);

  // Quantity handling per product
  const handleQuantityChange = (productId, qty) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Number(qty) || 1,
    }));
  };

  // Add to cart or update quantity with loading feedback
  async function addtocartFun(buyerId, productId) {
    const isAlreadyInCart = !!cartMap[productId];
    const qty = productQuantities[productId] || 1;
    setAddingProductId(productId);

    try {
      let result = await api.post(`/addToCart/${buyerId}`, {
        productId,
        quantity: qty,
        areYouUpdatingQuantity: isAlreadyInCart,
      });

      if (result.status === 200) {
        // Update local cart map state immediately
        setCartMap((prev) => ({
          ...prev,
          [productId]: qty,
        }));

        toast.success(
          isAlreadyInCart
            ? `Updated cart quantity to ${qty} ✓`
            : `Added ${qty} item(s) to cart! 🛒`,
          {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            theme: "colored",
          }
        );

        // Refresh cart in Redux
        const res = await api.get(`/getcartProducts/${buyerId}`);
        dispatch(setCart(res.data?.cart || []));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update cart", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setAddingProductId(null);
    }
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
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

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          width: "100%",
          background: "linear-gradient(135deg, #052e16 0%, #14532d 40%, #16a34a 100%)",
          padding: "5rem 1.5rem 4.5rem",
          textAlign: "center",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "380px",
            height: "380px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "999px",
              padding: "0.45rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
              color: "#ffffff",
            }}
          >
            <span>🌿</span> 100% Farm Fresh &amp; Organic
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1.2rem",
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Fresh Fruits &amp;{" "}
            <span style={{ color: "#86efac" }}>Vegetables</span>
            <br />Delivered Straight to You
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: "560px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            Explore our curated harvest of healthy, delicious farm produce picked daily for your family.
          </p>

          {/* Search Box - HIGHLY INTERACTIVE & VISUALLY RESPONSIVE */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: "560px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#ffffff",
              borderRadius: "999px",
              padding: "0.45rem 0.5rem 0.45rem 1.4rem",
              boxShadow: isSearchFocused
                ? "0 0 0 4px rgba(34, 197, 94, 0.35), 0 20px 35px rgba(0, 0, 0, 0.25)"
                : "0 12px 30px rgba(0, 0, 0, 0.2)",
              border: isSearchFocused ? "2px solid #22c55e" : "2px solid transparent",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isSearchFocused ? "scale(1.02)" : "scale(1)",
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <span style={{ fontSize: "1.2rem", color: "#64748b", flexShrink: 0 }}>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search fruits, vegetables (e.g. Apple, Tomato)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                fontWeight: 500,
                color: "#0f172a",
                background: "transparent",
                fontFamily: "inherit",
                padding: "0.5rem 0.25rem",
                boxSizing: "border-box",
              }}
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  background: "#e2e8f0",
                  border: "none",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  color: "#475569",
                  fontWeight: 700,
                  marginRight: "0.25rem",
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}

            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                color: "#ffffff",
                border: "none",
                borderRadius: "999px",
                padding: "0.75rem 1.6rem",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Search
            </button>
          </form>

          {/* Quick Stats Banner */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              marginTop: "3rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                {AllData.length}+
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)", marginTop: "0.3rem" }}>
                Fresh Products
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                100%
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)", marginTop: "0.3rem" }}>
                Organic Verified
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                Same Day
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)", marginTop: "0.3rem" }}>
                Swift Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0.75rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto" }}>
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.6rem 1.3rem",
                    borderRadius: "999px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    border: active ? "2px solid #16a34a" : "2px solid #e2e8f0",
                    background: active ? "#16a34a" : "#ffffff",
                    color: active ? "#ffffff" : "#475569",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{cat === "All" ? "🛍️" : cat === "Fruit" ? "🍎" : "🥦"}</span>
                  <span>{cat === "All" ? "All Products" : `${cat}s`}</span>
                </button>
              );
            })}
          </div>

          {/* Active search or filter feedback */}
          {searchQuery && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.4rem 0.9rem",
                background: "#f0fdf4",
                borderRadius: "999px",
                border: "1px solid #bbf7d0",
                fontSize: "0.85rem",
                color: "#15803d",
                fontWeight: 600,
              }}
            >
              <span>Found {filteredData.length} items for "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#15803d",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <main
        ref={productsRef}
        id="products-section"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 4rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.025em",
              }}
            >
              {activeCategory === "All"
                ? "All Harvested Produce"
                : `Fresh ${activeCategory}s`}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "0.25rem" }}>
              Showing {filteredData.length} delicious {filteredData.length === 1 ? "item" : "items"} ready to ship
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="products-grid-container">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "1rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ height: "180px", background: "#f1f5f9", borderRadius: "12px" }} />
                <div style={{ height: "20px", width: "60%", background: "#f1f5f9", borderRadius: "6px" }} />
                <div style={{ height: "15px", width: "90%", background: "#f1f5f9", borderRadius: "6px" }} />
                <div style={{ height: "40px", width: "100%", background: "#f1f5f9", borderRadius: "8px", marginTop: "auto" }} />
              </div>
            ))}
          </div>
        ) : filteredData.length > 0 ? (
          /* Products Grid with responsive class */
          <div className="products-grid-container">
            {filteredData.map((obj) => {
              const isHovered = hoveredCard === obj._id;
              const isInCart = !!cartMap[obj._id];
              const cartQty = cartMap[obj._id];
              const selectedQty = productQuantities[obj._id] !== undefined
                ? productQuantities[obj._id]
                : (isInCart ? cartQty : 1);
              const isQtyChanged = isInCart && selectedQty !== cartQty;
              const isAdding = addingProductId === obj._id;

              return (
                <div
                  key={obj._id}
                  onMouseEnter={() => setHoveredCard(obj._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: isHovered
                      ? "0 20px 30px -10px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      : "0 4px 12px rgba(0, 0, 0, 0.05)",
                    border: isInCart ? "2px solid #86efac" : "1px solid #f1f5f9",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                    position: "relative",
                  }}
                >
                  {/* "In Cart" Indicator Badge on Top Right */}
                  {isInCart && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0.85rem",
                        right: "0.85rem",
                        background: "#16a34a",
                        color: "#ffffff",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        zIndex: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span>✓ In Cart ({cartQty})</span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div
                    style={{
                      position: "relative",
                      height: "210px",
                      overflow: "hidden",
                      background: "#f0fdf4",
                    }}
                  >
                    <img
                      src={obj.image}
                      alt={obj.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        transform: isHovered ? "scale(1.06)" : "scale(1)",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "0.85rem",
                        left: "0.85rem",
                        background: obj.category === "Fruit" ? "rgba(234, 88, 12, 0.9)" : "rgba(22, 163, 74, 0.9)",
                        backdropFilter: "blur(6px)",
                        color: "#ffffff",
                        padding: "0.3rem 0.75rem",
                        borderRadius: "999px",
                        fontSize: "0.725rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {obj.category}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div
                    style={{
                      padding: "1.35rem",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {obj.name}
                    </div>

                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#64748b",
                        lineHeight: 1.5,
                        marginBottom: "1rem",
                        flex: 1,
                      }}
                    >
                      {obj.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.35rem",
                        marginBottom: "1.2rem",
                        paddingTop: "0.75rem",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          color: "#15803d",
                        }}
                      >
                        ₹{obj.price}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                        / unit
                      </span>
                    </div>

                    {/* Actions: Add To Cart or Login CTA */}
                    {reduxData.isLoggedIn && reduxData.role === "Buyer" ? (
                      <div style={{ display: "flex", gap: "0.6rem" }}>
                        <select
                          value={selectedQty}
                          disabled={isAdding}
                          onChange={(e) => handleQuantityChange(obj._id, e.target.value)}
                          style={{
                            width: "70px",
                            padding: "0.6rem 0.5rem",
                            border: isInCart ? "2px solid #16a34a" : "1.5px solid #cbd5e1",
                            borderRadius: "10px",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: "#334155",
                            background: isInCart ? "#f0fdf4" : "#ffffff",
                            outline: "none",
                            cursor: "pointer",
                            boxSizing: "border-box",
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => addtocartFun(reduxData._id, obj._id)}
                          disabled={isAdding}
                          style={{
                            flex: 1,
                            padding: "0.75rem",
                            background: isInCart && !isQtyChanged
                              ? "#f0fdf4"
                              : "linear-gradient(135deg, #16a34a, #15803d)",
                            color: isInCart && !isQtyChanged ? "#15803d" : "#ffffff",
                            border: isInCart && !isQtyChanged ? "2px solid #16a34a" : "none",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "0.925rem",
                            cursor: isAdding ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            boxShadow: isInCart && !isQtyChanged ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.4rem",
                            boxSizing: "border-box",
                          }}
                          onMouseEnter={(e) => {
                            if (!isInCart || isQtyChanged) {
                              e.currentTarget.style.transform = "translateY(-1px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          {isAdding ? (
                            <>
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  border: "2px solid currentColor",
                                  borderTopColor: "transparent",
                                  borderRadius: "50%",
                                  animation: "spin 0.7s linear infinite",
                                }}
                              />
                              Updating...
                            </>
                          ) : isQtyChanged ? (
                            `🔄 Update Qty (${selectedQty})`
                          ) : isInCart ? (
                            `✓ In Cart (${cartQty})`
                          ) : (
                            "🛒 Add to Cart"
                          )}
                        </button>
                      </div>
                    ) : reduxData.isLoggedIn && reduxData.role === "Admin" ? (
                      <button
                        onClick={() => navigate("/adminDashboard")}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "#ede9fe",
                          color: "#4338ca",
                          border: "1px solid #c7d2fe",
                          borderRadius: "10px",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      >
                        Manage in Dashboard →
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/selectAccountType")}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "#f0fdf4",
                          color: "#15803d",
                          border: "1.5px solid #bbf7d0",
                          borderRadius: "10px",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          boxSizing: "border-box",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#16a34a";
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.borderColor = "#16a34a";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f0fdf4";
                          e.currentTarget.style.color = "#15803d";
                          e.currentTarget.style.borderColor = "#bbf7d0";
                        }}
                      >
                        Sign In to Order →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
              No products found matching your search
            </h3>
            <p style={{ color: "#64748b", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
              We couldn't find anything matching "{searchQuery}". Try searching for fruits, vegetables, or clear your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              style={{
                padding: "0.75rem 1.6rem",
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                color: "#ffffff",
                border: "none",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
              }}
            >
              View All Harvests
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "#052e16",
          color: "rgba(255, 255, 255, 0.75)",
          padding: "3.5rem 1.5rem 2.5rem",
          width: "100%",
          textAlign: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "1.6rem",
              fontWeight: 900,
              color: "#ffffff",
              marginBottom: "0.75rem",
            }}
          >
            <span>🌿</span> Vegefoods
          </div>
          <p style={{ maxWidth: "500px", margin: "0 auto 2rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Connecting ethical organic farmers with households for healthier, fresher, and happier lives.
          </p>
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "1.5rem",
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            © {new Date().getFullYear()} Vegefoods. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
