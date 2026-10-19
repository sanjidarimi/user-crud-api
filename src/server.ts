import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = Number(process.env.PORT) || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB successfully via Prisma.");

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(async () => {
          await prisma.$disconnect();
          console.log("Server closed and Prisma disconnected.");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on("SIGINT", exitHandler);
    process.on("SIGTERM", exitHandler);
  } catch (error) {
    console.error("Database connection failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();