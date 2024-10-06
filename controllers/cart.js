const cartModel = require("../models/cart");
const productModel = require("../models/product");
const userModel = require("../models/user");

const addToCart = async (req, res) => {
  try {
    const { item } = req.body;
    const { email } = req.user;

    // Check if the product exists in the product model
    const productItem = await productModel.findOne({ productName: item });
    if (!productItem) {
      return res.status(400).json({
        message: `The product ${item} does not exist in the database. Add something else`,
      });
    }

    // Check if a cart already exists for the user (by email)
    let userCart = await cartModel.findOne({ owner: email });

    // If the cart does not exist, create a new one
    if (!userCart) {
      userCart = new cartModel({
        owner: email, // Set the owner of the cart to the user's email
        itemsInCart: [item], // Add the first item to the cart
        totalCost: productItem.productPrice, // Initialize totalCost with the product's price
      });

      // Save the cart and update the user's cart field in the user model
      await userModel.updateOne(
        { email }, // Find the user by email
        {
          $push: { cart: item },
          $set: { totalCostInCart: productItem.productPrice },
        } // Push the product name to the user's cart field
      );
      //   user.cart.push(item);
    } else {
      //If the cart exists, update the itemsInCart array and totalCost

      // Push the new item to the itemsInCart array
      userCart.itemsInCart.push(item);

      // Update the user's cart as well
      await userModel.updateOne(
        { email }, // Find the user by email
        {
          $push: { cart: item }, // Push the product name to the user's cart field
          $inc: { totalCostInCart: productItem.productPrice }, // Increment totalCostInCart
        }
      );

      // Add the item's price to the total cost
      userCart.totalCost += productItem.productPrice;
    }

    // Save the updated cart to the database
    await userCart.save();

    // Send a success response
    return res.status(200).json({
      message: `The item ${item} has been added to your cart successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { item } = req.body;
    const { email } = req.user;

    // Check if the product exists in the product model
    const productItem = await productModel.findOne({ productName: item });
    if (!productItem) {
      return res.status(400).json({
        message: `The product ${item} does not exist in the database.`,
      });
    }

    // Check if a cart already exists for the user (by email)
    let userCart = await cartModel.findOne({ owner: email });

    if (userCart) {
      if (userCart.itemsInCart.includes(item)) {
        userCart.itemsInCart.pull(item);
        userCart.totalCost -= productItem.productPrice;
        // Save the changes to the database
        await userCart.save();
        // Update the user's cart as well
        await userModel.updateOne(
          { email }, // Find the user by email
          {
            $pull: { cart: item }, // Push the product name to the user's cart field
            $inc: { totalCostInCart: -productItem.productPrice }, // Increment totalCostInCart
          }
        );

        // Check if the cart is empty after removal
        if (userCart.itemsInCart.length === 0) {
          await cartModel.deleteOne({ owner: email }); // Delete the empty cart
        }

        return res.status(200).json({
          message: `${item} was removed from the cart`,
        });
      } else {
        return res.status(400).json({
          message: `${item} was never in the cart, delete something else`,
        });
      }
    } else {
      return res.status(400).json({ message: `This Cart doesn't exist` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToCart, removeFromCart };
