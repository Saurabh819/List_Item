import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { UserModel, UserDocument } from "../model/user"; // Assuming your UserModel is defined in a separate file

const mockUserId = "606cb76b9b4f5f5c60a88c3e";
// Controller function to handle user creation

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, preferences, watchHistory } = req.body;

    // Validate request body
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
      password: hashedPassword, // Assuming you're using password hashing middleware
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

// Controller function to get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all users from the database
    const users: UserDocument[] = await UserModel.find();

    // Respond with the fetched users
    res.status(200).json(users);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Controller function to get user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId: string = req.params.id;

  try {
    // Find user by ID in the database
    const user: UserDocument | null = await UserModel.findById(userId);

    if (user) {
      // Respond with the found user
      res.status(200).json(user);
    } else {
      // If user not found, respond with not found message
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Controller function to update user by ID
export const updateUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId: string = req.params.id;
  const updatedUser: UserDocument = req.body;

  try {
    // Find user by ID and update in the database
    const user: UserDocument | null = await UserModel.findByIdAndUpdate(
      userId,
      updatedUser,
      { new: true }
    );

    if (user) {
      // Respond with the updated user
      res.status(200).json({ message: "User updated successfully", user });
    } else {
      // If user not found, respond with not found message
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Controller function to delete user by ID
export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId: string = req.params.id;

  try {
    // Find user by ID and delete from the database
    const deletedUser: UserDocument | null = await UserModel.findByIdAndDelete(
      userId
    );

    if (deletedUser) {
      // Respond with success message
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      // If user not found, respond with not found message
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to delete user" });
  }
};
