import clientPromise from "@/lib/mongodb";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", 
    },
  },
};

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("mydb");

  if (req.method === "POST") {
    try {
      const { username, answers, imageUrl } = req.body;

      const result = await db.collection("answers").insertOne({
        username,
        answers,
        imageUrl, 
        createdAt: new Date(),
      });

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
