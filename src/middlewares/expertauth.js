const jwt = require("jsonwebtoken");

function expertauth(req, res, next) {
  const token = req.headers["x-authtoken"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret from .env
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = expertauth;
