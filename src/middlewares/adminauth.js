const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

async function adminauth(req, res, next) {
  const token = req.headers["x-authtoken"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (decoded.role != "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Admin not found please register" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = adminauth;
