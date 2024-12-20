import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminModel } from "../model/AdminSchema.js";
import { ProductModel } from "../model/ProductSchema.js";
import { OrderModel } from "../model/OrderSchema.js";
import { sendEmail } from "../Utility/mailer.js";
// +++++++++++++++++++++++++++++++********* Admin signUp  *********==================================================

// signUp
const AdminSignupRoute = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("admin siignup-", { name, email, password });

    if (name === "" || email === "" || password === "") {
      return res.status(400).json({ message: "Please enter all details" });
    }

    // to check a valid email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // to check a valid password
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/;
    if (!emailRegex.test(email)) {
      console.log("Please enter a valid email");
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (!passwordRegex.test(password)) {
      console.log(
        "Password must be at least 8 characters long and have at least one uppercase and one lowercase letter"
      );
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and have at least one uppercase and one lowercase letter",
      });
    }

    const adminEMAILexists = await AdminModel.findOne({ email });

    if (adminEMAILexists) {
      console.log("email exists");
      return res.status(400).json({ message: "Use a different email" });
    } else {
      // hasing password
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = await bcryptjs.hashSync(password, salt);

      const adminCreated = await AdminModel.create({
        name: name,
        email: email,
        password: hashedPassword,
      });

      if (adminCreated) {
        const jwttoken = jwt.sign(
          adminCreated.toJSON(),
          process.env.ADMIN_JWT_SECRET_KEY,
          { expiresIn: "40m" }
        );

        console.log("admin added");
        // Set the token in the response headers
        return res.status(200).json({
          message: "admin has been created",
          jwttoken: jwttoken,
          detail: { name: name, role: "Admin", _id: adminCreated._id },
        });
      } else {
        console.log("admin could not be created");
        return res.status(400).json({ message: "admin could not be created" });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "unable to send data" });
  }
};

// +++++++++++++++++++++++++++++++*********   login  **********==================================================
// login
const adminLoginRoute = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("adminLoginRoute", { email, password });

    if (email === "" || password === "") {
      return res.status(400).json({ message: "Please enter all details" });
    }

    const adminExists = await AdminModel.findOne({ email: email });

    if (!adminExists) {
      console.log("Admin notfound");
      return res.status(400).json({ message: "Admin not found" });
    } else {
      // matching password
      const salt = bcryptjs.genSaltSync(10);

      const passwordsMatch = bcryptjs.compareSync(
        password,
        adminExists.password
      );

      if (passwordsMatch) {
        const jwttoken = jwt.sign(
          adminExists.toJSON(),
          process.env.ADMIN_JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        // Set the token in the response headers
        return res.status(200).json({
          message: "Admin loggedin",
          jwttoken: jwttoken,
          detail: {
            name: adminExists.name,
            role: adminExists.role,
            _id: adminExists._id,
          },
        });
      } else {
        console.log("Admin not registered");
        return res.status(400).json({ message: "Not a Admin" });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "unable to login" });
  }
};

//Get All Placed Orders by Admin

const getAllPlacedOrdersByAdmin = async (req, res) => {
  const { adminId } = req.params;

  console.log("adminId-", adminId);
  try {
    const { adminId } = req.params; 
    const adminProducts = await ProductModel.find({ admin: adminId }).select(
      "_id"
    );

    const adminProductIds = adminProducts.map((product) => product._id);

    // Fetch orders that contain these products
    const orders = await OrderModel.find({
      "products.product": { $in: adminProductIds },
    })
      .populate("buyer", "name email") // Populate buyer details
      .populate({
        path: "products.product",
        select: "name price category admin", // Populate product details
        match: { admin: adminId }, // Ensure the product belongs to the admin
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No products found ." });
    }

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log({ error: error.message });
  }
};

//Update Order Status
async function updateStatusOfOrder(req, res) {
  // ------------------------------------
  const { orderId, productId } = req.params;
  const { status } = req.body;

  try {
    // Find the order and populate the buyer details (including email)
    const order = await OrderModel.findById(orderId).populate("buyer", "email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the product in the order
    const productInOrder = order.products.find(
      (prod) => prod.product.toString() === productId
    );
    if (!productInOrder) {
      return res
        .status(404)
        .json({ message: "Product not found in this order" });
    }

    // Update the product status
    productInOrder.status = status;

    // Save the updated order
    await order.save();

    // Get the buyer's email (now populated)
    const buyerEmail = order.buyer.email;
    if (!buyerEmail) {
      return res.status(400).json({ message: "Buyer email not found" });
    }

    const subject = "Order Status Update";
    const text = `Your order status has been updated to ${status}.`;
    const html = `<p>Your order status has been updated to <strong>${status}</strong>.</p>`;

    // Send the email notification
    await sendEmail(buyerEmail, subject, text, html);

    res.status(200).json({ message: "Product status updated and email sent" });
    console.log("Product status updated and email sent");
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({
      message: "Failed to update product status",
      error: error.message,
    });
  }
}

export {
  AdminSignupRoute,
  adminLoginRoute,
  getAllPlacedOrdersByAdmin,
  updateStatusOfOrder,
};
