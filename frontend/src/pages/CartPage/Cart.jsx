// import { useEffect, useState } from "react";
// import NavWithoutLogin from "../../components/NavBar/navbar";
// import api from "../../Axios_Interceptor/api.js";
// import { useSelector } from "react-redux";
// import cartCss from "./Cart.module.css";
// const Cart = () => {
//   const [cartData, setCartData] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const { _id, name } = useSelector((state) => state);

//   ///getcartProducts
//   useEffect(() => {
//     async function getCart() {
//       try {
//         let res = await api.get(`/getcartProducts/${_id}`);
//         console.log("getCart-", res.data.cart);
//         setCartData(res.data.cart);
//         let total = res.data.cart.reduce(
//           (acc, curr) => acc + curr.product.price,
//           0
//         );
//         setTotalPrice(total);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     getCart();
//   }, []);

//   //placeOrder
//   function placeOrder(_id, cartData, totalPrice) {}

//   return (
//     <div>
//       <NavWithoutLogin />
//       <h1>Cart</h1>
//       {/* Cart summary.. */}
//       {cartData.length > 0 && (
//         <section className={cartCss.summary}>
//           <h2>Card summary</h2>
//           <p>Number of products: {cartData.length} </p>
//           <p>
//             Total price:{totalPrice}
//             {}
//           </p>
//           <p>discount: 10%</p>
//           <h3>
//             Total:
//             {totalPrice - Math.ceil(totalPrice / 10)}
//           </h3>
//           {/* address */}
//           <form action=""></form>
//           <button className={cartCss.PlaceOrder} onClick={placeOrder}>
//             Place order
//           </button>
//         </section>
//       )}

//       <section className={cartCss.allCart_Products_container}>
//         {cartData.length > 0 ? (
//           cartData.map((obj) => (
//             <div key={obj._id}>
//               <img src={obj.product.image} alt="img" />
//               <h2>name: {obj.product.name}</h2>
//               <h2>price: {obj.product.price}</h2>
//               <h2>quantity: {obj.quantity}</h2>
//             </div>
//           ))
//         ) : (
//           <p>Empty Card.</p>
//         )}
//       </section>
//     </div>
//   );
// };

// export default Cart;
// ----------------------------------
// placeOrder - route

// {
//   buyerId,
//   cartItems,
//   totalPrice,
//   deliveryName,
//   contactInfo,
//   deliveryAddress,
// }

// New fields for delivery details
// deliveryName: { type: String, required: true }, // Name of the person receiving the delivery
// contactInfo: { type: String, required: true }, // Contact info (e.g., phone number)
// deliveryAddress: {
//   street: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   country: { type: String, required: true },
// ---------------------------------------------------------------

import { useEffect, useState } from "react";
import NavWithoutLogin from "../../components/NavBar/navbar";
import api from "../../Axios_Interceptor/api.js";
import { useSelector } from "react-redux";
import cartCss from "./Cart.module.css";

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
  const { _id } = useSelector((state) => state);

  // Fetch cart products
  useEffect(() => {
    async function getCart() {
      try {
        let res = await api.get(`/getcartProducts/${_id}`);
        console.log("getCart-", res.data.cart);
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
    getCart();
  }, [_id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails({ ...deliveryDetails, [name]: value });
  };

  // Place order
  async function placeOrder() {
    if (
      !deliveryDetails.deliveryName ||
      !deliveryDetails.contactInfo ||
      !deliveryDetails.street ||
      !deliveryDetails.city ||
      !deliveryDetails.state ||
      !deliveryDetails.postalcode ||
      !deliveryDetails.country
    ) {
      alert("Please fill in all delivery details!");
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

      console.log("Order placed successfully:", res.data);
      alert("Order placed successfully!");

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
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again later.");
    }
  }

  return (
    <div>
      <NavWithoutLogin />
      <h1>Cart</h1>

      {/* Cart summary */}
      {cartData.length > 0 && (
        <section className={cartCss.summary}>
          <h2>Cart Summary</h2>
          <p>Number of products: {cartData.length}</p>
          <p>Total Price: ₹{totalPrice}</p>
          <p>Discount: 10%</p>
          <h3>Final Total: ₹{totalPrice - Math.ceil(totalPrice / 10)}</h3>

          {/* Delivery Details Form */}
          <form className={cartCss.deliveryForm}>
            <h2>Delivery Details</h2>
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
          </form>
          <button
            className={cartCss.PlaceOrder}
            onClick={placeOrder}
            disabled={cartData.length === 0}
          >
            Place Order
          </button>
        </section>
      )}

      {/* Cart products */}
      <section className={cartCss.allCart_Products_container}>
        {cartData.length > 0 ? (
          cartData.map((obj) => (
            <div key={obj._id} className={cartCss.singleProduct}>
              <img src={obj.product.image} alt="img" />
              <h2>Name: {obj.product.name}</h2>
              <h2>Price: ₹{obj.product.price}</h2>
              <h2>Quantity: {obj.quantity}</h2>
            </div>
          ))
        ) : (
          <p>Cart is empty.</p>
        )}
      </section>
    </div>
  );
};

export default Cart;
