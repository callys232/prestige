import { serialize } from "cookie";

const users = [
  { username: "lamidUser", password: "secure123", role: "user" },
  { username: "admin", password: "adminpass", role: "admin" },
];

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

  const sessionData = {
    username: user.username,
    role: user.role,
    timestamp: Date.now(),
  };

  const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");

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
    redirect: user.role === "admin" ? "/admin/Adminlogin" : "/dashboard",
  });
}
