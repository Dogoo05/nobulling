import clientPromise from "../../lib/mongodb"; // lib/mongodb.js доторх холболтоо ашиглана

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("deerlehelt"); // Өөрийн дата баазын нэрийг бичээрэй

      const { customId, description, status, createdAt } = req.body;

      // Шууд Insert хийх
      const result = await db.collection("sos_requests").insertOne({
        customId,
        description,
        status: status || "ШИНЭ",
        createdAt: new Date(createdAt) || new Date(),
      });

      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error("SOS API Error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Серверийн алдаа гарлаа" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
