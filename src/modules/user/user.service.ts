import prisma from "../../config/prisma.js";
import { ICreateUserPayload, IUpdateUserPayload } from "./user.interface.js";

export const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

const createUserIntoDB = async (payload: ICreateUserPayload) => {
  const normalizedEmail = payload.email.trim().toLowerCase();

  // Explicit check for existing email
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    const conflictError = new Error("A user with this email already exists.");
    (conflictError as unknown as { code: string }).code = "EMAIL_ALREADY_EXISTS";
    throw conflictError;
  }

  const result = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: normalizedEmail,
      age: payload.age,
    },
  });

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    orderBy: { id: "desc" },
  });
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });
  return result;
};

const updateUserInDB = async (id: string, payload: IUpdateUserPayload) => {
  const dataToUpdate: IUpdateUserPayload = {};

  if (payload.name !== undefined) dataToUpdate.name = payload.name.trim();
  if (payload.email !== undefined) {
    const normalizedEmail = payload.email.trim().toLowerCase();
    
    // Check if another user already owns this email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser && existingUser.id !== id) {
      const conflictError = new Error("A user with this email already exists.");
      (conflictError as unknown as { code: string }).code = "EMAIL_ALREADY_EXISTS";
      throw conflictError;
    }
    dataToUpdate.email = normalizedEmail;
  }
  if (payload.age !== undefined) dataToUpdate.age = payload.age;

  const result = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await prisma.user.delete({
    where: { id },
  });
  return result;
};

export const UserService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};