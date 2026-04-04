import jwt from "jsonwebtoken";

const ACCESS_SECRET = "access_secret";

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded: any = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};