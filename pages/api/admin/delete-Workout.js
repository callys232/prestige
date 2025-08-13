export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Missing workout ID" });
  }

  // Replace with DB delete logic
  console.log("Deleting workout plan with ID:", id);

  res.status(200).json({ message: "Workout plan deleted" });
}
