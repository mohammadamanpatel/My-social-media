import express from "express";
import {google, signin, signOut, signup } from "../controllers/auth.controller.js";
import upload from "../utils/uploadByMulter.js";



const router = express.Router();

router.post("/signup", upload.single("avatar"), signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/logout", signOut);

export default router;
