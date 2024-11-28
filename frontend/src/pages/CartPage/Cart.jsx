import { useEffect, useState } from "react";
import NavWithoutLogin from "../../components/NavBar/navbar";
import api from "../../Axios_Interceptor/api.js";
import { useSelector } from "react-redux";
import cartCss from "./Cart.module.css";
const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const { _id } = useSelector((state) => state);

  ///getcartProducts
  useEffect(() => {
    async function getCart() {
      try {
        let res = await api.get(`/getcartProducts/${_id}`);
        console.log("getCart-", res.data.cart);
        setCartData(res.data.cart);
        let total = res.data.cart.reduce(
          (acc, curr) => acc + curr.product.price,
          0
        );
        setTotalPrice(total);
      } catch (error) {
        console.log(error);
      }
    }
    getCart();
  }, []);

  return (
    <div>
      <NavWithoutLogin />
      <h1>Cart</h1>
      {/* Cart summary.. */}
      {cartData.length > 0 && (
        <section className={cartCss.summary}>
          <h2>Card summary</h2>
          <p>Number of products: {cartData.length} </p>
          <p>
            Total price:{totalPrice}
            {}
          </p>
          <p>discount: 10%</p>
          <h3>
            Total:
            {totalPrice - Math.ceil(totalPrice / 10)}
          </h3>
          <button className={cartCss.PlaceOrder}>Place order</button>
        </section>
      )}

      <section className={cartCss.allCart_Products_container}>
        {cartData.length > 0 ? (
          cartData.map((obj) => (
            <div key={obj._id}>
              <img src={obj.product.image} alt="img" />
              <h2>name: {obj.product.name}</h2>
              <h2>price: {obj.product.price}</h2>
              <h2>quantity: {obj.quantity}</h2>
            </div>
          ))
        ) : (
          <p>Empty Card.</p>
        )}
      </section>
    </div>
  );
};

export default Cart;
