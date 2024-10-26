import { Router } from "express";
import { z } from "zod";
import { User, Account } from "../db.js";
import { JWT_SECRET } from "../config.js";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware.js";
import pkg from "jsonwebtoken";

const { sign } = pkg;
const router = Router();

// Schema for signup validation
const signupBody = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

router.post("/signup", async (req, res) => {
  const parseResult = signupBody.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: parseResult.error.errors[0].message, // Return validation error message
    });
  }

  // Check if the user already exists by email (username)
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(400).json({
      message: "Email already taken",
    });
  }

  try {
    // Create user with schema validation
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    // Create an account with initial balance
    const initialBalance = Math.floor(1 + Math.random() * 10000);
    await Account.create({
      userId: user._id,
      balance: initialBalance,
    });

    // Generate JWT token
    const token = sign({ userId: user._id }, JWT_SECRET);

    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
});

// Schema for signin validation
const signinBody = z.object({
  username: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

router.post("/signin", async (req, res) => {
  const parseResult = signinBody.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: parseResult.error.errors[0].message, // Return validation error message
    });
  }

  // Find the user by username
  const user = await User.findOne({ username: req.body.username });
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    // Generate JWT token
    const token = sign({ userId: user._id }, JWT_SECRET);
    return res.json({ token });
  }

  res.status(400).json({
    message: "Invalid username or password",
  });
});

// Schema for updating user information
const updateBody = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const parseResult = updateBody.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: parseResult.error.errors[0].message,
    });
  }

  const updateData = { ...req.body };

  // If a new password is provided, hash it before updating
  if (updateData.password) {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    updateData.password = hashedPassword;
  }

  try {
    await User.updateOne({ _id: req.userId }, updateData);
    res.json({
      message: "Updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating information",
    });
  }
});

// Route to get users with a filter
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    });

    res.json({
      users: users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
    });
  }
});

// Route to get current user information
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("firstName lastName"); // Adjust fields as necessary
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user information",
    });
  }
});

export default router;
