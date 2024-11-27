import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const AdminDashBoard = () => {
  const red = useSelector((state) => state);
  console.log("ADmin dash ,redux->", red);

  return (
    <>
      <ToastContainer />
      <h1>Hi Admin, Welcome</h1>
      <section>
        <button>Get your products</button>
      </section>
    </>
  );
};

export default AdminDashBoard;
