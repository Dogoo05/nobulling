import clientPromise from "../../lib/mongodb";

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" },
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    // --- 1. POST: Шинэ хүсэлт хадгалах ---
    if (req.method === "POST") {
      const { customId, answers, description, imageUrl, isUrgent } = req.body;

      const newDoc = {
        customId: customId?.toUpperCase() || `ID-${Date.now()}`,
        answers: answers || {},
        description: description || "",
        imageUrl: imageUrl || "",
        status: "Хүлээгдэж буй",
        adminReply: "",
        createdAt: new Date(),
        isUrgent: !!isUrgent,
      };

      const collectionName = isUrgent ? "sos_requests" : "answers";
      await db.collection(collectionName).insertOne(newDoc);

      return res.status(200).json({ success: true, id: customId });
    }

    // --- 2. GET: Мэдээлэл татах БОЛОН Хайлт хийх ---
    if (req.method === "GET") {
      const { id } = req.query;

      // Хэрэв ID ирвэл ХАЙЛТ хийнэ
      if (id) {
        const query = { customId: id.trim().toUpperCase() };

        // Хоёр цуглуулгаас зэрэг хайх
        const [normalResult, urgentResult] = await Promise.all([
          db.collection("answers").findOne(query),
          db.collection("sos_requests").findOne(query),
        ]);

        const finalResult = normalResult || urgentResult;

        if (finalResult) {
          return res.status(200).json({ success: true, data: finalResult });
        } else {
          return res
            .status(404)
            .json({ success: false, error: "Код олдсонгүй" });
        }
      }

      // Хэрэв ID байхгүй бол МЕНЕЖЕРТ зориулж бүх өгөгдлийг татах
      const [normal, urgent] = await Promise.all([
        db
          .collection("answers")
          .find({})
          .sort({ createdAt: -1 })
          .limit(20)
          .toArray(),
        db
          .collection("sos_requests")
          .find({})
          .sort({ createdAt: -1 })
          .limit(20)
          .toArray(),
      ]);

      const allData = [...normal, ...urgent].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      return res.status(200).json({ success: true, data: allData });
    }

    // --- 3. PATCH: Хариу илгээх (Менежер) ---
    if (req.method === "PATCH") {
      const { id, status, adminReply } = req.body;
      const query = { customId: id };
      const updateDoc = {
        $set: {
          status: status,
          adminReply: adminReply,
          updatedAt: new Date(),
        },
      };

      const [res1, res2] = await Promise.all([
        db.collection("answers").updateOne(query, updateDoc),
        db.collection("sos_requests").updateOne(query, updateDoc),
      ]);

      if (res1.modifiedCount > 0 || res2.modifiedCount > 0) {
        return res.status(200).json({ success: true });
      }
      return res
        .status(404)
        .json({ success: false, error: "Хүсэлт олдсонгүй." });
    }

    // --- 4. DELETE: Устгах ---
    if (req.method === "DELETE") {
      const { id } = req.query;
      const query = { customId: id };

      await Promise.all([
        db.collection("answers").deleteOne(query),
        db.collection("sos_requests").deleteOne(query),
      ]);

      return res.status(200).json({ success: true });
    }

    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("API SERVER ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
