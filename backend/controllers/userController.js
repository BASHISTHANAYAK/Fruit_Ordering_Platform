import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "../db_connection/mongoo.js";

// user model
import UserModel from "../model/userSchema.js";


// +++++++++++++++++++++++++++++++*********  signUp  *********==================================================

// signUp
const signupRoute = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;
    // console.log(name, mobile, email, password);

    if (name === "" || mobile === "" || email === "" || password === "") {
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

    const userEMAILexists = await UserModel.findOne({ email });
    const userMOBILEexists = await UserModel.findOne({ mobile });

    if (userEMAILexists) {
      console.log("email exists");
      return res.status(400).json({ message: "Use a different email" });
    }
    if (userMOBILEexists) {
      console.log("mobile Number exists");
      return res.status(400).json({ message: "Use a different mobile Number" });
    } else {
      // hasing password
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = await bcryptjs.hashSync(password, salt);

      const usercreated = await UserModel.create({
        name: name,
        mobile: mobile,
        email: email,
        password: hashedPassword,
      });

      if (usercreated) {
        const jwttoken = jwt.sign(
          usercreated.toJSON(),
          process.env.JWT_SECRET_KEY,
          { expiresIn: "40m" }
        );

        console.log("user added");
        // Set the token in the response headers
        return res
          .status(200)
          .json({ message: "User has been created", jwttoken: jwttoken });
      } else {
        console.log("User could not be created");
        return res.status(400).json({ message: "User could not be created" });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "unable to send data" });
  }
};

// +++++++++++++++++++++++++++++++*********   login  **********==================================================
// login
const loginRoute = async (req, res) => {
  try {
    const { mobileORemail, password } = req.body;
    // console.log(mobileORemail,password);

    if (mobileORemail === "" || password === "") {
      return res.status(400).json({ message: "Please enter all details" });
    }

    const userexists =
      (await UserModel.findOne({ email: mobileORemail })) ||
      (await UserModel.findOne({ mobile: mobileORemail }));

    if (!userexists) {
      console.log("User notfound");
      return res.status(400).json({ message: "User not found" });
    } else {
      // matching password
      const salt = bcryptjs.genSaltSync(10);

      const passwordsMatch = bcryptjs.compareSync(
        password,
        userexists.password
      );

      if (passwordsMatch) {
        const jwttoken = jwt.sign(
          userexists.toJSON(),
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        // Set the token in the response headers
        return res
          .status(200)
          .json({ message: "User loggedin", jwttoken: jwttoken });
      } else {
        console.log("User not registered");
        return res.status(400).json({ message: "Not a user" });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "unable to login" });
  }
};

// +++++++++++++++++++++++++++++++*********   adding productID in usercart  **********==================================================

const addToCart = async (req, res) => {
  try {
    const obj = await req.body;
    const userID = await req.params.userID;

    console.log("addToCart obj:-", obj);
    // console.log("addToCart userID:-", userID);

    // Check if the product with obj.productID already exists in mycart
    const existingProductIndex = await UserModel.findOne(
      { _id: userID, "mycart.productID": obj.productID },
      { "mycart.$": 1 }
    );

    if (existingProductIndex) {
      // Product already exists, and number is incremented
      const user = await UserModel.updateOne(
        { _id: userID, "mycart.productID": obj.productID },
        { $inc: { "mycart.$.quantity": 1 } }
      );

      // Handle the result if needed
      // console.log("user- ", user);
      // Send a response
      return res.status(200).json({ message: "Item quantity updated in cart" });
    }

    // Product does not exist in mycart, add it with number 1
    const user = await UserModel.updateOne(
      { _id: userID },
      { $push: { mycart: { ...obj, quantity: 1 } } }
    );

    // Handle the result if needed
    // console.log("user- ", user);

    // Send a response
    return res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: "Unable to add to cart" });
  }
};
//  +++++++++++++++++++++++++++++++*********   getting a user cartArray by user _id  **********==================================================
const getUserDetails = async (req, res) => {
  try {
    const _id = await req.params._id;
    const User = await UserModel.findById(_id);
    // console.log("findUser:- ", User);
    User
      ? res.status(200).json({ message: "userFound by the _id", User })
      : res.status(400).json({ message: "user noy found by the _id" });
  } catch (error) {
    console.log("getUserDetails error", error);
    return res.status(400).json({ message: "Unable to Get UserDetails" });
  }
};

// +++++++++++++++++++++++++++++++*********  geting user by id and updating its cart item Quentity *********+++++++++++++++++++++++++++++++
const updateQuantity = async (req, res) => {
  try {
    const { productId, newQuantity } = req.body;
    const { _id } = req.params;

    const user = await UserModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          "mycart.$[element].quantity": Number(newQuantity),
        },
      },
      {
        arrayFilters: [{ "element.productID": productId }],
        new: true, // Return the modified document
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found or cant update" });
    }
    // console.log("user:- ", user.mycart);
    return res.status(200).json(user);
  } catch (error) {
    console.log("updateQuantity error", error);
    return res
      .status(400)
      .json({ message: "Unable to process updateQuantity API" });
  }
};

// +++++++++++++++++++++++++++++++*********  geting user by id and updating/empty its cart   *********+++++++++++++++++++++++++++++++

const emptyCart = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const result = await UserModel.findByIdAndUpdate(
      { _id },
      { $set: { mycart: [] } }
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "User not found or cant empty the cart" });
    }
    return res.status(200).json({ message: "cart is empty now" });
  } catch (error) {
    console.log("emptyCart error", error);
    return res.status(400).json({ message: "Unable to emptyCart API" });
  }
};

const test = async (req, res) => {
  res.send("test page");
};

export {
  signupRoute,
  loginRoute,
  addToCart,
  getUserDetails,
  updateQuantity,
  emptyCart,
  test,
};
