import express from "express";

const router = express.Router();
import { addToCart, fetchCartItems, deleteCartItem, updateCartItemQty } from "../../controllers/shop/cart-controller.js";


router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update-cart", updateCartItemQty);
router.delete("/:userId/:productId", deleteCartItem);

export default router;
