import prisma from "../../config/prisma.js";
import { ICreateUserPayload, IUpdateUserPayload } from "./user.interface.js";

// Helper to check valid 24-character hexadecimal MongoDB ObjectId
export const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

const createUserIntoDB = async (payload: ICreateUserPayload) => {
  const result = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
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
  if (payload.email !== undefined) dataToUpdate.email = payload.email.trim().toLowerCase();
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