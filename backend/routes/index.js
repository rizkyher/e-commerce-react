import express from "express";
import { getUsers, Register, Login, logout, products, categorys, keranjangs, keranjangs2, deleteProduct } from "../contollers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../contollers/RefreshToken.js";
// import { categorys_db } from "../models/productModel.js";

const router = express.Router();

router.get('/users', verifyToken , getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.post('/product', products);
router.post('/category', categorys);
router.post('/keranjang', keranjangs);
router.get('/keranjangs2', keranjangs2);
router.delete('/keanjang', deleteProduct);
router.get('/product', products);
router.get('/token', refreshToken);
router.delete('/logout', logout);

export default router