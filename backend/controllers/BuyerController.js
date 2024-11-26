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
          process.env.JWT_SECRET_KEY,
          { expiresIn: "40m" }
        );

        console.log("buyer added");
        // Set the token in the response headers
        return res
          .status(200)
          .json({ message: "buyer has been created", jwttoken: jwttoken });
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
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        // Set the token in the response headers
        return res
          .status(200)
          .json({ message: "Buyer loggedin", jwttoken: jwttoken });
      } else {
        console.log("Buyer not registered");
        return res.status(400).json({ message: "Account not found please register" });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "unable to login" });
  }
};

export { buyerSignupRoute, buyerLoginRoute };
