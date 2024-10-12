const cartModel = require("../models/cart");
const productModel = require("../models/product");
const userModel = require("../models/user");

// Function to add an item to the cart
const addToCart = async (req, res) => {
  try {
    const { item } = req.body;
    const { email } = req.user;

    // Check if the product exists in the database
    const productItem = await productModel.findOne({ productName: item });
    if (!productItem) {
      return res.status(400).json({
        message: `The product ${item} does not exist in the database. Add something else`,
      });
    }

    // Check if the user already has a cart
    let userCart = await cartModel.findOne({ owner: email });

    // If no cart exists, create a new one
    if (!userCart) {
      userCart = new cartModel({
        owner: email, // Set the owner of the cart to the user's email
        itemsInCart: [item], // Add the first item to the cart
        totalCost: productItem.productPrice, // Set the total cost as the product price
      });

      // Update the user's cart and total cost in the user model
      await userModel.updateOne(
        { email }, // Find the user by email
        {
          $push: { cart: item }, // Add the item to the user's cart field
          $set: { totalCostInCart: productItem.productPrice }, // Set the total cost
        }
      );
    } else {
      // If the cart exists, update the cart with the new item
      userCart.itemsInCart.push(item); // Add the new item to the cart

      // Update the user's cart and increment the total cost
      await userModel.updateOne(
        { email },
        {
          $push: { cart: item }, // Add the item to the user's cart field
          $inc: { totalCostInCart: productItem.productPrice }, // Increment the total cost
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
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Function to remove an item from the cart
const removeFromCart = async (req, res) => {
  try {
    const { item } = req.body;
    const { email } = req.user;

    // Check if the product exists in the database
    const productItem = await productModel.findOne({ productName: item });
    if (!productItem) {
      return res.status(400).json({
        message: `The product ${item} does not exist in the database.`,
      });
    }

    // Check if the user already has a cart
    let userCart = await cartModel.findOne({ owner: email });

    if (userCart) {
      const itemIndex = userCart.itemsInCart.indexOf(item);

      // Check if the item is in the cart
      if (itemIndex !== -1) {
        // Remove the item from the cart and update the total cost
        userCart.itemsInCart.splice(itemIndex, 1);
        userCart.totalCost -= productItem.productPrice;

        // Save the updated cart
        await userCart.save();

        // Update the user's cart and decrement the total cost
        await userModel.updateOne(
          { email },
          {
            $pull: { cart: item }, // Remove the item from the user's cart field
            $inc: { totalCostInCart: -productItem.productPrice }, // Decrement the total cost
          }
        );

        // If the cart is empty, delete the cart
        if (userCart.itemsInCart.length === 0) {
          await cartModel.deleteOne({ owner: email });
        }

        return res.status(200).json({
          message: `${item} was removed from the cart`,
        });
      } else {
        // If the item is not in the cart
        return res.status(400).json({
          message: `${item} was never in the cart, delete something else`,
        });
      }
    } else {
      return res.status(400).json({ message: `This cart doesn't exist` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Export the functions
module.exports = { addToCart, removeFromCart };
