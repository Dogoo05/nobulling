import clientPromise from "../../lib/mongodb";

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" }, // Зураг хүлээн авах хэмжээ
  },
};

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("test");

  try {
    // 1. POST: Шинэ анкет хадгалах
    if (req.method === "POST") {
      const { customId, answers, description, imageUrl } = req.body;
      const isUrgent = customId.startsWith("SOS-");

      const newDoc = {
        customId,
        answers: answers || {},
        description: description || "",
        imageUrl: imageUrl || "", // Base64 зураг энд хадгалагдана
        status: "Хүлээгдэж буй",
        adminReply: "",
        createdAt: new Date(),
        isUrgent,
      };

      const collection = isUrgent ? "sos_requests" : "answers";
      await db.collection(collection).insertOne(newDoc);
      return res.status(200).json({ success: true });
    }

    // 2. GET: Мэдээлэл татах (Зурагтай хамт)
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        const query = { customId: id };
        let result = await db.collection("sos_requests").findOne(query);
        if (!result) result = await db.collection("answers").findOne(query);
        return res.status(200).json({ success: true, data: result });
      }

      // Зургийг хасалгүйгээр бүгдийг татна
      const [normal, urgent] = await Promise.all([
        db.collection("answers").find({}).sort({ createdAt: -1 }).toArray(),
        db
          .collection("sos_requests")
          .find({})
          .sort({ createdAt: -1 })
          .toArray(),
      ]);

      return res
        .status(200)
        .json({ success: true, data: [...urgent, ...normal] });
    }

    // 3. PATCH: Төлөв өөрчлөх болон Хариу илгээх
    if (req.method === "PATCH") {
      const { id, status, adminReply } = req.body;
      const update = { $set: { status, adminReply, updatedAt: new Date() } };

      await Promise.all([
        db.collection("answers").updateOne({ customId: id }, update),
        db.collection("sos_requests").updateOne({ customId: id }, update),
      ]);
      return res.status(200).json({ success: true });
    }

    // 4. DELETE: Устгах
    if (req.method === "DELETE") {
      const { id } = req.query;
      await Promise.all([
        db.collection("answers").deleteOne({ customId: id }),
        db.collection("sos_requests").deleteOne({ customId: id }),
      ]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
