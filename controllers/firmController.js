const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (only images)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const isValid =
//     allowedTypes.test(file.mimetype) &&
//     allowedTypes.test(path.extname(file.originalname).toLowerCase());

//   if (isValid) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"));
//   }
// };

const upload = multer({
  storage,
  //   fileFilter,
});

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.filename;

    // Storage config

    const vendor = await Vendor.findById(req.vendorId);
    //req.vendorId we got fom mverify token where we assigned req.venodrId=vendor._id
    if (!vendor) {
      return res.status(404).json({ message: "vendor not found" });
    }
    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });
    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm);
    await vendor.save();

    return res.status(200).json({ message: "Firm added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal error" });
  }
};
const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deleteFirm = await Firm.findByIdAndDelete(firmId);
    if (!deleteFirm) {
      res.status(404).json({ error: "No firm found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
