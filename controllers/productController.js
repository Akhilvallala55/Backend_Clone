const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const Firm = require("../models/Firm");
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

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.filename;
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();
    firm.product.push(savedProduct);
    await firm.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Server internal error" });
  }
};

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }
    const products = await Product.find({ firm: firmId }); //based on relation on product model ref:"Firm" checks product.firm=firmID from params and give products based on firmId
    res.status(200).json({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server internal error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct) {
      return res.status(404).json({ error: "No product found" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductById,
};
