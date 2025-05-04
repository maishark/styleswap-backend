const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ensure the User model is imported correctly

const authMiddleware = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token using the secret key from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET is from .env

    // Find the user based on the userId in the token's payload
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to the request so that other middleware/route handlers can use it
    req.user = user; 
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ message: "Token is not valid" });
  }
};
 //
module.exports = authMiddleware;
