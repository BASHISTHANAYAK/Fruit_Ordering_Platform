import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // If there's no Authorization header, respond with an error
      return res
        .status(401)
        .json({ message: "Unauthorized: Token needed for authentication" });
    }

    // Split the Authorization header to get the token
    const tokenArray = authHeader.split(" ");
    const jwttoken = tokenArray[1]; // The token is at index 1 after splitting
    console.log("jwttoken from adminAuth-: ");
    // Remove double quotes if present
    const cleanedToken = jwttoken.replace(/^"(.*)"$/, "$1");

    // Verify the token
    const decoded = jwt.verify(cleanedToken, process.env.ADMIN_JWT_SECRET_KEY);

    // console.log("decoded:- ", decoded);

    if (decoded) {
      // Attach the user information to the req object
      req.user = decoded;
      console.log("Token is successfully decoded ");
      // Proceed to the next middleware or route handler
      return next();
    }
  } catch (error) {
    // If there's an error (e.g., invalid token), respond with an error
    console.log("decoded failed/invalid");
    return res.status(401).json({ err: "Unauthorized: Token is not valid" });
  }
};

export default adminAuth;
