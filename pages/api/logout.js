import { serialize } from "cookie";

export default function handler(req, res) {
  // Clear the session cookie
  res.setHeader(
    "Set-Cookie",
    serialize("session", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0), // Expire immediately
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
  );

  return res.status(200).json({ message: "Logged out" });
}
