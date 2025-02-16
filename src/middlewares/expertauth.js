const jwt = require("jsonwebtoken");
const Expert = require("../models/expertModel");

async function expertauth(req, res, next) {
  const token = req.headers["x-authtoken"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret from .env
    const expert = await Expert.findById(decoded.id);
    if (decoded.role != "expert") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!expert) {
      return res.status(401).json({ message: "Expert not found please register" });
    }
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = expertauth;
