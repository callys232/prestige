import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const users = [
  { username: "lamidUser", password: "secure123", role: "user" },
  { username: "admin", password: "adminpass", role: "admin" },
];

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use env var in production

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password, loginType } = req.body;

  if (!username || !password || !loginType) {
    return res
      .status(400)
      .json({ message: "Missing credentials or login type" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Enforce login type
  if (loginType === "user" && user.role !== "user") {
    return res.status(403).json({ message: "Admin access not allowed here" });
  }

  if (loginType === "admin" && user.role !== "admin") {
    return res.status(403).json({ message: "User access not allowed here" });
  }

  // Create JWT
  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Set cookie
  res.setHeader(
    "Set-Cookie",
    serialize("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
  );

  return res.status(200).json({
    message: "Login successful",
    role: user.role,
    redirect: user.role === "admin" ? "/admin/dashboard" : "/dashboard",
  });
}
