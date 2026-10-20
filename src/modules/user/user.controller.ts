import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { UserService, isValidObjectId } from "./user.service.js";

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || age === undefined) {
      res.status(400).json({
        success: false,
        message: "Fields 'name', 'email', and 'age' are required.",
      });
      return;
    }

    if (typeof age !== "number" || !Number.isInteger(age) || age < 0) {
      res.status(400).json({
        success: false,
        message: "Field 'age' must be a non-negative integer.",
      });
      return;
    }

    const result = await UserService.createUserIntoDB({ name, email, age });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await UserService.getAllUsersFromDB();

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid MongoDB ObjectId format.",
      });
      return;
    }

    const result = await UserService.getSingleUserFromDB(id);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, email, age } = req.body;

    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid MongoDB ObjectId format.",
      });
      return;
    }

    if (name === undefined && email === undefined && age === undefined) {
      res.status(400).json({
        success: false,
        message:
          "At least one field ('name', 'email', or 'age') must be provided to update.",
      });
      return;
    }

    if (
      age !== undefined &&
      (typeof age !== "number" || !Number.isInteger(age) || age < 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Field 'age' must be a non-negative integer.",
      });
      return;
    }

    const result = await UserService.updateUserInDB(id, { name, email, age });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      if (error.code === "P2002") {
        res.status(409).json({
          success: false,
          message: "A user with this email already exists.",
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid MongoDB ObjectId format.",
      });
      return;
    }

    await UserService.deleteUserFromDB(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
