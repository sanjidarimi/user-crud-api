import express, { Application, Request, Response, NextFunction } from "express";
import { UserRoutes } from "./modules/user/user.route.js";

const app: Application = express();

// Parsers
app.use(express.json());

// Application Routes
app.use("/api/users", UserRoutes);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "User CRUD REST API is running",
  });
});

// 404 Route Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
});

export default app;