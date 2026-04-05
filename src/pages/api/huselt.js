import clientPromise from "@/lib/dbConnect";

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" },
  },
};

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("test");

  try {
    // 1. POST: Хадгалах (Хэвээрээ)
    if (req.method === "POST") {
      const { answers, description, imageUrl, isUrgent } = req.body;
      const now = new Date();
      const dateStr =
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        now.getDate().toString().padStart(2, "0");
      const randomStr = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();

      const customId = isUrgent
        ? `SOS-${dateStr}-${randomStr}`
        : `${dateStr}-${randomStr}`;

      const newDoc = {
        customId,
        answers: answers || {},
        description: description || "",
        imageUrl: imageUrl || "",
        status: "Хүлээгдэж буй",
        adminReply: "",
        createdAt: now,
        isUrgent: !!isUrgent,
      };

      const collectionName = isUrgent ? "sos_requests" : "answers";
      await db.collection(collectionName).insertOne(newDoc);
      return res.status(200).json({ success: true, customId });
    }

    // 2. GET: Татах (Хэвээрээ)
    if (req.method === "GET") {
      const { id } = req.query;
      if (id) {
        let result = await db
          .collection("sos_requests")
          .findOne({ customId: id });
        if (!result)
          result = await db.collection("answers").findOne({ customId: id });
        return res.status(200).json({ success: true, data: result });
      }
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

    // 3. PATCH: Төлөв өөрчлөх (ЗАСВАР ОРСОН ✅)
    if (req.method === "PATCH") {
      const { id, status, adminReply } = req.body;
      if (!id) return res.status(400).json({ error: "ID шаардлагатай" });

      const update = { $set: { status, adminReply, updatedAt: new Date() } };

      // ID нь SOS-оор эхэлсэн эсэхийг шалгаад collection-оо сонгоно
      const targetCol = id.toString().startsWith("SOS-")
        ? "sos_requests"
        : "answers";

      const result = await db
        .collection(targetCol)
        .updateOne({ customId: id }, update);

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Засах өгөгдөл олдсонгүй" });
      }
      return res.status(200).json({ success: true });
    }

    // 4. DELETE: Устгах (ЗАСВАР ОРСОН ✅)
    if (req.method === "DELETE") {
      const { id } = req.query; // Query-гээс ID-г авна
      if (!id) return res.status(400).json({ error: "ID шаардлагатай" });

      const targetCol = id.toString().startsWith("SOS-")
        ? "sos_requests"
        : "answers";

      const result = await db.collection(targetCol).deleteOne({ customId: id });

      if (result.deletedCount === 0) {
        // Хэрэв олдохгүй бол нөгөө цуглуулгаас нь нэг шалгаад үзье (найдвартай тал руугаа)
        const backupCol =
          targetCol === "sos_requests" ? "answers" : "sos_requests";
        await db.collection(backupCol).deleteOne({ customId: id });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
