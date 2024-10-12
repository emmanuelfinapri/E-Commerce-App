const productModel = require("../models/product");
const userModel = require("../models/user");

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { productName, productPrice, productDesc, category } = req.body;

    // Check if the product already exists
    const theProduct = await productModel.findOne({ productName });
    if (theProduct) {
      return res.status(400).json({
        message: `This Product: ${productName} already exists, add something else`,
      });
    }

    // Create and save a new product to the database
    const newProduct = new productModel({
      productName,
      productPrice,
      productDesc,
      category,
    });
    await newProduct.save();

    // Add the new product to all users' `productsAvailable` field
    await userModel.updateMany(
      {}, // Select all users
      { $push: { productsAvailable: productName } } // Push the new product to the field
    );

    // Send a success response
    res.status(200).json({
      message: `The ${productName} product has been added successfully for $${productPrice}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by name
const deleteProduct = async (req, res) => {
  try {
    const { productName } = req.body;

    // Check if the product exists
    const theProduct = await productModel.findOne({ productName });
    if (!theProduct) {
      return res.status(400).json({
        message: `The ${productName} does not exist!! Delete something else`,
      });
    }

    // Delete the product from the database
    await productModel.findOneAndDelete({ productName });

    // Remove the product from all users' `productsAvailable` field
    await userModel.updateMany(
      {}, // Select all users
      { $pull: { productsAvailable: productName } } // Remove the product from the field
    );

    return res.status(200).json({
      message: `The ${productName} has been deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, productStatus, category } =
      req.body;

    // Check if the product exists
    const theProduct = await productModel.findOne({ productName });
    if (!theProduct) {
      return res.status(400).json({
        message: `The ${productName} does not exist!! Update something else`,
      });
    }

    // Handle out of stock or discontinued products
    if (
      theProduct.productStatus === "Out of stock" ||
      theProduct.productStatus === "Discontinued"
    ) {
      // Remove the product from all users' `productsAvailable` field
      await userModel.updateMany(
        {},
        { $pull: { productsAvailable: productName } }
      );
    } else {
      // Re-add product if it is restocked or back in the database
      await userModel.updateMany(
        {},
        { $push: { productsAvailable: productName } }
      );
    }

    // Update the product details in the database
    await productModel.findOneAndUpdate(
      { productName },
      { productDesc, productPrice, productStatus, category },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: `The ${productName} product has been updated successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete all products from the database
const deleteAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find();

    if (allProducts.length === 0) {
      return res.status(400).json({
        message: `No product exists in the Database`,
      });
    } else {
      // Delete all products
      const deletedProducts = await productModel.deleteMany({});

      // Clear all users' `productsAvailable` field
      await userModel.updateMany(
        {},
        { $set: { productsAvailable: [] } } // Reset the array for all users
      );

      return res.status(200).json({
        message: `All ${deletedProducts.deletedCount} products have been deleted successfully`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// View all products
const viewAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel
      .find()
      .select("-_id productName productDesc productPrice productStatus");

    if (allProducts.length === 0) {
      return res.status(400).json({
        message: `No product exists in the Database`,
      });
    }

    // Send response with all products
    res.json(allProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// View products by category
const viewProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    // Category is required
    if (!category) {
      return res.status(400).json({
        message: `Category is required`,
      });
    }

    // Find products by category
    const allProductsByCategory = await productModel
      .find({ category })
      .select(
        "-_id productName productDesc productPrice productStatus category"
      );

    if (!allProductsByCategory) {
      return res.status(400).json({
        message: `This ${category} category does not exist`,
      });
    }

    // Send response with all products in the category
    res.json(allProductsByCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  deleteAllProducts,
  viewAllProducts,
  viewProductsByCategory,
};
