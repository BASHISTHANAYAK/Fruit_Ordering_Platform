import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // If there's no Authorization header, respond with an error
      console.log("Unauthorized: Token needed for authentication");
      return res
        .status(401)
        .json({ message: "Unauthorized: Token needed for authentication" });
    }

    // Split the Authorization header to get the token
    const tokenArray = authHeader.split(" ");
    const jwttoken = tokenArray[1]; // The token is at index 1 after splitting

    // Remove double quotes if present
    const cleanedToken = jwttoken.replace(/^"(.*)"$/, "$1");

    // Verify the token
    const decoded = jwt.verify(cleanedToken, process.env.USER_JWT_SECRET_KEY);

    // console.log("decoded:- ", decoded);

    if (decoded) {
      console.log("Token is successfully decoded");

      // Attach the user information to the req object
      req.user = decoded;
      console.log("Token is successfully decoded and attached to req.user");
      // Proceed to the next middleware or route handler
      return next();
    }
  } catch (error) {
    // If there's an error (e.g., invalid token), respond with an error
    console.log("decoded failed/invalid");
    return res.status(401).json({ err: "Unauthorized: Token is not valid" });
  }
};

export default userAuth;
