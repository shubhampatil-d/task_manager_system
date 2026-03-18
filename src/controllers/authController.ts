import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const ACCESS_SECRET = "access_secret";
const REFRESH_SECRET = "refresh_secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    res.status(201).json(user);
  } catch {
    res.status(400).json({ msg: "User already exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ msg: "Invalid email" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ msg: "Invalid password" });

  const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.json({ accessToken, refreshToken });
};

export const refresh = (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) return res.sendStatus(401);

  try {
    const decoded: any = jwt.verify(token, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch {
    res.sendStatus(403);
  }
};

export const logout = (req: Request, res: Response) => {
  res.json({ msg: "Logged out" });
};