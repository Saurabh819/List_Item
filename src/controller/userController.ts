import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { UserModel, UserDocument } from "../model/user"; 

const mockUserId = "606cb76b9b4f5f5c60a88c3e";


export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, preferences, watchHistory } = req.body;

 
    if (!username || !preferences || !watchHistory) {
      res.status(400).json({
        message: "Username, preferences, and watch history are required.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user
    const newUser: UserDocument = new UserModel({
      id: mockUserId,
      username,
      password: hashedPassword, 
      preferences,
      watchHistory,
    });

    // Save user to database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    // Check if username and password are provided
    if (!id) {
      res.status(400).json({ message: "id required." });
      return;
    }

    // Find user by username
    const user: UserDocument | null = await UserModel.findOne({ id });

    // If user not found
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // If username and password are correct, send success response
    res.status(200).json({ message: "Login successful.", user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

