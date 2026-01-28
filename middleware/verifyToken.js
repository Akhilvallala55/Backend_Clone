const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.secretKey;
const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    //
    //here we are comapring the token generated  during login and decoded vendorID
    const vendor = await Vendor.findById(decoded.vendorId);
    //    const token = jwt.sign({ vendorId: vendor._id } above vendorID we got from this code

    if (!vendor) {
      return res.status(404).json({ error: "vendor not found" });
    }
    //comparing decoded vendor id with actual vendor ID
    req.vendorId = vendor._id;
    next();
  } catch (err) {
    res.status(500).json({ err: "invalid token" });
  }
};

module.exports = verifyToken;
