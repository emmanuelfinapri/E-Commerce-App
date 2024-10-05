// Import necessary modules and initialize the Express application
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
dotenv.config();

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to DB"))
  .catch(() => console.log("Error connecting to DB"));

const PORT = process.env.PORT || 3035;

//middlewares
app.use(express.json());
app.use(cookieparser());

// getting all Routes
app.use(authRoute);
app.use(userRoute);
app.use(productRoute);

app.listen(PORT, () => {
  console.log(`E-commerce App running on Port: ${PORT}`);
});
