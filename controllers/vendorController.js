const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.secretKey;
const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const vendorEmail = await Vendor.findOne({ email });
    //This email will stored in the db when we register it through form
    if (vendorEmail) {
      return res.status(400).json("Email already taken");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
    await newVendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
    console.log("Registered");
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server internal error" });
    console.log(err);
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
      //we made vendor id as token
      expiresIn: "1h",
    });
    res.status(200).json({ success: "Login succcesful", token });
    //here vendor details and input password and bcrypt password comparing
    console.log(vendor);
  } catch (err) {
    res.status(500).json({ err: "Server internal error" });
    console.log(err);
  }
};
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    res.json({ vendors });
    console.log(vendors);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server internal error" });
  }
};
const getVendorById = async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = await Vendor.findById(vendorId).populate("firm");
    if (!vendor) {
      return res.status(400).json({ error: "vendor not found" });
    }
    res.status(200).json({ vendor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server internal error" });
  }
};

module.exports = {
  vendorRegister,
  vendorLogin,
  getAllVendors,
  getVendorById,
};
