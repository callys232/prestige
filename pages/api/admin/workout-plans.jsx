export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Replace with DB logic
  const plans = [
    { id: 1, name: "Push Day" },
    { id: 2, name: "Cardio Blast" },
  ];

  res.status(200).json(plans);
}
