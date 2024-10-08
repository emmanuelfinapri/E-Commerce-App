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

routes.post("/add-product", loginVerify, adminAndSuperAdminVerify, addProduct);
routes.delete(
  "/delete-product",
  loginVerify,
  adminAndSuperAdminVerify,
  deleteProduct
);
routes.put(
  "/update-product",
  loginVerify,
  adminAndSuperAdminVerify,
  updateProduct
);
routes.delete(
  "/delete-all-products",
  loginVerify,
  adminAndSuperAdminVerify,
  deleteAllProducts
);
routes.get("/view-all-products", viewAllProducts);
routes.get("/view-products-by-category", viewProductsByCategory);

module.exports = routes;
