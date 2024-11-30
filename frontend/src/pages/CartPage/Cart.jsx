import { useEffect, useState } from "react";
import NavWithoutLogin from "../../components/NavBar/navbar";
import api from "../../Axios_Interceptor/api.js";
import { useSelector } from "react-redux";
import cartCss from "./Cart.module.css";
import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
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
  const [showCartORPreviousOrders, setShowCartORPreviousOrders] =
    useState("showCart");

  const { _id } = useSelector((state) => state);

  // Fetch cart products
  async function getCart() {
    setOrders([])
    setShowCartORPreviousOrders("showCart")
    console.log("Fetch cart products...")
    try {
      let res = await api.get(`/getcartProducts/${_id}`);
      // console.log("getCart-", res.data.cart);
      setCartData(res.data.cart);

      // Calculate total price
      let total = res.data.cart.reduce(
        (acc, curr) => acc + curr.product.price * curr.quantity,
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {

    getCart();
  }, []);

  // Handle form/delivery  input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails({ ...deliveryDetails, [name]: value });
  };

  // Place order by filling address details
  async function placeOrder(event) {
    event.preventDefault();
    if (
      !deliveryDetails.deliveryName ||
      !deliveryDetails.contactInfo ||
      !deliveryDetails.street ||
      !deliveryDetails.city ||
      !deliveryDetails.state ||
      !deliveryDetails.postalcode ||
      !deliveryDetails.country
    ) {
      toast.error("Please fill in all delivery details!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      getCart();
      return;
    } else {
      console.log("deliveryDetails-", deliveryDetails);
    }

    try {
      const res = await api.post("/placeOrder", {
        buyerId: _id,
        cartItems: cartData.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        totalPrice,
        ...deliveryDetails,
      });

      // console.log("Order placed successfully:", res.data);
      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Clear cart data after successful order
      setCartData([]);
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
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Error placing order:", error);
    }
  }

  //fetch placed orders of buyer 
  async function fetchOrders() {
    setCartData([])
    setShowCartORPreviousOrders(() => "showPlacedOrders");
    try {
      const res = await api.get(`/getOrders/${_id}`);
      // console.log("Fetched Orders:", res.data.orders);
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error?.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }


  async function changeQuantity(productId, changeQuantity) {
    changeQuantity = Number(changeQuantity)
    let buyerId = _id
    // console.log("changeQuantity-", { buyerId, productId, changeQuantity })
    try {
      let result = await api.post(`/addToCart/${buyerId}`, {
        productId,
        quantity: changeQuantity,
        areYouUpdatingQuantity: true
      });

      // console.log("changeQuantity result--", result);
      if (result.status === 200) {
        getCart();

        toast.success("Quantity updated", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  //  "/removeFromCart/:buyerId",
  async function removeFrom_Cart(objToDeleteId) {
    let buyerId = _id;
    // console.log("removeFrom_Cart-", { objToDeleteId, buyerId })
    try {
      let result = await api.delete(`/removeFromCart/${buyerId}/${objToDeleteId}`);

      // console.log("removeFrom_Cart result--", result);
      if (result.status === 200) {

        toast.success("Product removed", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        getCart();

      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

  }
  return (
    <div>
      <ToastContainer />

      <NavWithoutLogin />
      <section className={cartCss.heading}>
        <h1>Cart</h1>
        <div>
          {
            showCartORPreviousOrders === "showCart" ? <button onClick={() => fetchOrders()} >show placed orders</button> : <button onClick={() => getCart()}>Go to cart</button>
          }

        </div>
      </section>

      {/* Orders history  */}
      <h2>
        {showCartORPreviousOrders === "showCart" ? null : "Orders History"}
      </h2>

      {orders.length > 0 && showCartORPreviousOrders === "showPlacedOrders" && (
        <section className={cartCss.ordersSection}>
          {orders.map((order, i) => (
            <div key={order._id} className={cartCss.aPlacedOrder_Div}>
              <h3>
                Order ID {i + 1}: {order?._id}
              </h3>
              <p>Status: {order?.status}</p>
              <p>Total Price: ₹{order?.totalPrice}</p>
              <p>
                Delivery Address: {order.deliveryAddress.street},{" "}
                {order?.deliveryAddress?.city}, {order?.deliveryAddress?.state},{" "}
                {order?.deliveryAddress?.postalCode},{" "}
                {order?.deliveryAddress?.country}
              </p>
              <h4>Products:</h4>
              {order.products.map((item) => (
                <div
                  key={item?.product?._id}
                  className={cartCss.single_Placed_Product_DetailsDiv}
                >
                  <img src={item?.product?.image} alt={item?.product?.name} />
                  <p>Name: {item?.product?.name}</p>
                  <p>Price: ₹{item?.product?.price}</p>
                  <p>Quantity: {item?.quantity}</p>
                  <strong>Status: {item?.status}</strong>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      {/*cart summary and address details*/}

      {showCartORPreviousOrders === "showCart" && (
        <main>
          {cartData.length > 0 && orders.length === 0 && (
            <section className={cartCss.summary}>
              <div className={cartCss.cartSummaryDiv}>
                <h1>Cart Summary</h1>
                <p>Number of products: {cartData.length}</p>
                <p>Total Price: ₹{totalPrice}</p>
                <p>Discount: 10%</p>
                <h3>Final Total: ₹{totalPrice - Math.ceil(totalPrice / 10)}</h3>
              </div>
              {/* Delivery Details Form */}
              <h2 className={cartCss.deliveryDetails}>Delivery Details</h2>

              <form className={cartCss.deliveryForm} onSubmit={placeOrder}>
                <div>
                  <label htmlFor="deliveryName">Name:</label>
                  <input
                    type="text"
                    id="deliveryName"
                    name="deliveryName"
                    value={deliveryDetails.deliveryName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactInfo">Contact Info:</label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    value={deliveryDetails.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Enter your contact number"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="deliveryAddress">street:</label>
                  <input
                    id="street"
                    name="street"
                    value={deliveryDetails.street}
                    onChange={handleInputChange}
                    placeholder="Enter your delivery street"
                    required
                  ></input>
                </div>
                <div>
                  <label htmlFor="city">city :</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={deliveryDetails.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city "
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state">state :</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={deliveryDetails.state}
                    onChange={handleInputChange}
                    placeholder="Enter your state "
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postalcode">postalcode :</label>
                  <input
                    type="text"
                    id="postalcode"
                    name="postalcode"
                    value={deliveryDetails.postalcode}
                    onChange={handleInputChange}
                    placeholder="Enter your postalcode "
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country">country :</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={deliveryDetails.country}
                    onChange={handleInputChange}
                    placeholder="Enter your country "
                    required
                  />
                </div>

                <input
                  type="submit"
                  value=" Place Order"
                  className={cartCss.PlaceOrder}
                  disabled={cartData.length === 0}
                />
              </form>
            </section>
          )}

          {/*  products in Cart */}
          <section className={cartCss.allCart_Products_container}>
            {cartData.length > 0 && orders.length === 0
              ? cartData.map((obj) => (
                <div key={obj._id} className={cartCss.singleProduct}>
                  <img src={obj?.product?.image} alt="img" />
                  <h2>Name: {obj?.product?.name}</h2>
                  <h2>Price: ₹{obj?.product?.price}</h2>
                  <h2>Quantity: {obj?.quantity}</h2>
                  <select name="" id="" onChange={(e) => changeQuantity(obj.product._id, e.target.value)}>
                    <option value="1" disabled >--update quantity--</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="4">5</option>

                  </select>
                  <button onClick={() => removeFrom_Cart(obj._id)}>Remove</button>
                </div>
              ))
              : !cartData.length > 0 && <p>Cart is empty.</p>}
          </section>
        </main>
      )}
    </div>
  );
};

export default Cart;
