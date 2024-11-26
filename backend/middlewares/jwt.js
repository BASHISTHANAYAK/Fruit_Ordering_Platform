import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
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

    // Remove double quotes if present
    const cleanedToken = jwttoken.replace(/^"(.*)"$/, "$1");

    // Verify the token
    const decoded = await jwt.verify(cleanedToken, process.env.JWT_SECRET_KEY);

    // console.log("decoded:- ", decoded);

    // If verification is successful, log and proceed
    decoded && console.log("Token is successfully decoded");

    decoded &&
      res.status(200).json({ message: "jwt verifyed ", userInfo: decoded });
    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    // If there's an error (e.g., invalid token), respond with an error
    console.log("decoded failed/invalid");
    return res.status(401).json({ err: "Unauthorized: Token is not valid" });
  }
};

export default isAuthenticated;