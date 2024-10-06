const productModel = require("../models/product");
const userModel = require("../models/user");

const addProduct = async (req, res) => {
  try {
    const { productName, productPrice, productDesc } = req.body;
    const theProduct = await productModel.findOne({ productName });

    if (theProduct) {
      return res.status(400).json({
        message: `This Product:${productName} already exists, add something else`,
      });
    }

    const newProduct = new productModel({
      productName,
      productPrice,
      productDesc,
    });
    // Save the new product to the database
    await newProduct.save();

    // Add the newly added product to all users' productsAvailable field
    await userModel.updateMany(
      {}, // This selects all users
      { $push: { productsAvailable: productName } } // Push the product name to productsAvailable
    );

    // Send a success response
    res.status(200).json({
      message: `The ${productName} product has been added successfully for $${productPrice}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productName } = req.body;
    const theProduct = await productModel.findOne({ productName });
    if (!theProduct) {
      return res.status(400).json({
        message: `The ${productName} does not exist!! Delete something else`,
      });
    }
    await productModel.findOneAndDelete({ productName });

    // Remove the deleted product from all users' productsAvailable field
    await userModel.updateMany(
      {}, // This selects all users
      { $pull: { productsAvailable: productName } } // Pull the product name from productsAvailable
    );
    return res.status(200).json({
      message: `The ${productName} has been deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, productStatus } = req.body;
    const theProduct = await productModel.findOne({ productName });
    if (!theProduct) {
      return res.status(400).json({
        message: `The ${productName} does not exist!! Update something else`,
      });
    }
    if (
      theProduct.productStatus === "Out of stock" ||
      theProduct.productStatus === "Discontinued"
    ) {
      // Remove the deleted product from all users' productsAvailable field
      await userModel.updateMany(
        {}, // This selects all users
        { $pull: { productsAvailable: productName } } // Pull the product name from productsAvailable
      );
    } else {
      // Add the newly added product to all users' productsAvailable field
      await userModel.updateMany(
        {}, // This selects all users
        { $push: { productsAvailable: productName } } // Push the product name to productsAvailable
      );
    }
    await productModel.findOneAndUpdate(
      { productName },
      { productDesc, productPrice, productStatus },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      message: `The ${productName} product has been update successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find();
    if (allProducts.length === 0) {
      return res.status(400).json({
        message: `No product exists in the Database`,
      });
    } else {
      const deletedProducts = await productModel.deleteMany({});

      // Remove all product references from all users' productsAvailable field
      await userModel.updateMany(
        {}, // This selects all users
        { $set: { productsAvailable: [] } } // Clears the productsAvailable array for all users
      );

      return res.status(200).json({
        message: `All ${deletedProducts.deletedCount} products have been deleted successfully`,
        deletedCount: deletedProducts.deletedCount, // Optional: gives the count of deleted documents
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const viewAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel
      .find()
      .select("-_id   productName productDesc productPrice productStatus");
    if (allProducts.length === 0) {
      return res.status(400).json({
        message: `No product exists in the Database`,
      });
    }
    // Send a response with all products
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  deleteAllProducts,
  viewAllProducts,
};
