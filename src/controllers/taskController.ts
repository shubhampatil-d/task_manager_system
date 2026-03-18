import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// ✅ CREATE TASK
export const createTask = async (req: any, res: any) => {
  const { title } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      userId: req.user.userId,
    },
  });

  res.json(task);
};


// ✅ GET TASKS (pagination + filter + search)
export const getTasks = async (req: any, res: any) => {
  const { page = 1, limit = 5, search = "", status } = req.query;

  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user.userId,
      title: {
        contains: search,
      },
      ...(status !== undefined && {
        completed: status === "true",
      }),
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  res.json(tasks);
};


// ✅ UPDATE TASK
export const updateTask = async (req: any, res: any) => {
  const { id } = req.params;
  const { title } = req.body;

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: { title },
  });

  res.json(task);
};


// ✅ DELETE TASK
export const deleteTask = async (req: any, res: any) => {
  const { id } = req.params;

  await prisma.task.delete({
    where: { id: Number(id) },
  });

  res.json({ msg: "Task deleted" });
};


// ✅ TOGGLE TASK STATUS
export const toggleTask = async (req: any, res: any) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { completed: !task?.completed },
  });

  res.json(updated);
};