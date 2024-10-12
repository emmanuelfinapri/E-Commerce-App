const express = require("express");
const {
  addProduct,
  deleteProduct,
  updateProduct,
  deleteAllProducts,
  viewAllProducts,
  viewProductsByCategory,
} = require("../controllers/product");
const {
  loginVerify,
  adminAndSuperAdminVerify,
} = require("../middlewares/verify");
const routes = express.Router();

// Route to add a new product, requires admin or super admin privileges
routes.post("/add-product", loginVerify, adminAndSuperAdminVerify, addProduct);

// Route to delete a specific product, requires admin or super admin privileges
routes.delete(
  "/delete-product",
  loginVerify,
  adminAndSuperAdminVerify,
  deleteProduct
);

// Route to update a specific product, requires admin or super admin privileges
routes.put(
  "/update-product",
  loginVerify,
  adminAndSuperAdminVerify,
  updateProduct
);

// Route to delete all products, requires admin or super admin privileges
routes.delete(
  "/delete-all-products",
  loginVerify,
  adminAndSuperAdminVerify,
  deleteAllProducts
);

// Route to view all products
routes.get("/view-all-products", viewAllProducts);

// Route to view products by a specific category
routes.get("/view-products-by-category", viewProductsByCategory);

module.exports = routes;
