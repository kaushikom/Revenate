import { addUser } from "../controllers/user.controller.js";
import express from "express";

const userRouter = express.Router();

userRouter.post("/addUser", addUser);

export default userRouter;
