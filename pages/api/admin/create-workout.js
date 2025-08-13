export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Plan name is required" });
  }

  // Replace with DB insert logic
  console.log("Creating workout plan:", name);

  res.status(200).json({ message: "Workout plan created" });
}
