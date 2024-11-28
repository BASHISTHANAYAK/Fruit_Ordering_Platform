import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { BuyerModel } from "../model/BuyerSchema.js";

// +++++++++++++++++++++++++++++++********* Admin signUp  *********==================================================

// signUp
const buyerSignupRoute = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("buyer siignup-", { name, email, password });

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

    const BuyerEMAILexists = await BuyerModel.findOne({ email });

    if (BuyerEMAILexists) {
      console.log("email exists");
      return res.status(400).json({ message: "Use a different email" });
    } else {
      // hasing password
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = await bcryptjs.hashSync(password, salt);

      const buyerCreated = await BuyerModel.create({
        name: name,
        email: email,
        password: hashedPassword,
      });

      if (buyerCreated) {
        const jwttoken = jwt.sign(
          buyerCreated.toJSON(),
          process.env.USER_JWT_SECRET_KEY,
          { expiresIn: "40m" }
        );

        console.log("buyer added");
        // Set the token in the response headers
        return res.status(200).json({
          message: "buyer has been created",
          jwttoken: jwttoken,
          detail: { name: name, role: "Buyer", _id: buyerCreated._id },
        });
      } else {
        console.log("buyer could not be created");
        return res.status(400).json({ message: "buyer could not be created" });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "unable to send data" });
  }
};

// +++++++++++++++++++++++++++++++*********   login  **********==================================================
// login
const buyerLoginRoute = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("buyerLoginRoute", { email, password });

    if (email === "" || password === "") {
      return res.status(400).json({ message: "Please enter all details" });
    }

    const buyerExists = await BuyerModel.findOne({ email: email });

    if (!buyerExists) {
      console.log("Buyer notfound");
      return res.status(400).json({ message: "Buyer not found" });
    } else {
      // matching password
      const salt = bcryptjs.genSaltSync(10);

      const passwordsMatch = bcryptjs.compareSync(
        password,
        buyerExists.password
      );

      if (passwordsMatch) {
        const jwttoken = jwt.sign(
          buyerExists.toJSON(),
          process.env.USER_JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        // Set the token in the response headers
        return res.status(200).json({
          message: "Buyer loggedin",
          jwttoken: jwttoken,
          detail: {
            name: buyerExists.name,
            role: buyerExists.role,
            _id: buyerExists._id,
          },
        });
      } else {
        console.log("Buyer not registered");
        return res
          .status(400)
          .json({ message: "Account not found please register" });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "unable to login" });
  }
};

// add to cart -------------------------------------------------------------
const addToCart = async (req, res) => {
  const { buyerId } = req.params; // ID of the buyer
  const { productId, quantity } = req.body; // ID of the product and quantity
  console.log({ productId, buyerId, quantity });
  try {
    const buyer = await BuyerModel.findById(buyerId);

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    // Check if the product is already in the cart
    const cartItem = buyer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      // Update quantity if product exists in the cart
      cartItem.quantity += quantity;
    } else {
      // Add new product to the cart
      buyer.cart.push({ product: productId, quantity });
    }

    await buyer.save(); // Save changes to the buyer's document

    return res
      .status(200)
      .json({ message: "Product added to cart", cart: buyer.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// // Get all products
const getcartProducts = async (req, res) => {
  try {
    const { buyerId } = req.params; // ID of the buyer
    const buyer = await BuyerModel.findById(buyerId).populate("cart.product"); // Populating the 'product' field in the cart

    if (!buyer) {
      console.log("Buyer not found");
      return res.status(500).json({ message: "Buyer not found" });
    }
    // Return the populated cart
    return res.status(200).json(buyer);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export { buyerSignupRoute, buyerLoginRoute, addToCart, getcartProducts };
