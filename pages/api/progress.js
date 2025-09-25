import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Simulated DB
const userProgress = {
  lamidUser: {
    strength: 43,
    flexibility: 43,
    endurance: 43,
  },
  admin: {
    strength: 87,
    flexibility: 92,
    endurance: 75,
  },
};

export default function handler(req, res) {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const progress = userProgress[decoded.username] ?? {
      strength: 0,
      flexibility: 0,
      endurance: 0,
    };

    return res.status(200).json(progress);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
