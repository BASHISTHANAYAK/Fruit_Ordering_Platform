import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import NavBar from "../../components/NavBar/navbar.js";
import { useNavigate } from "react-router-dom";

const AdminDashBoard = () => {
  const red = useSelector((state) => state);
  console.log("ADmin dash ,redux->", red);
  const navigate = useNavigate();
  return (
    <>
      <ToastContainer />
      <NavBar />
      <h1>Hi {red.name}, Welcome</h1>
      <section>
        <button>Get your products</button>
        <button onClick={() => navigate("/createProduct")}>
          createProduct
        </button>
      </section>
    </>
  );
};

export default AdminDashBoard;
