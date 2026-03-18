import express from "express";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middleware/errorMiddleware";



const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server running on 5000");
});










