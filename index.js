const dotenv = require("dotenv");
const mongoose = require("mongoose");

const express = require("express");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);

const PORT = 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB connected"))
  .catch((err) => console.log(err));
app.listen(PORT, (req, res) => {
  console.log("Server is running at http://localhost:4000");
});
