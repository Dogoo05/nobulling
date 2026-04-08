import clientPromise from "@/lib/dbConnect";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    if (req.method === "GET") {
      const { id } = req.query;
      if (id && id !== "undefined") {
        const cleanId = id.toUpperCase().trim();
        let foundData = await db
          .collection("answers")
          .findOne({ customId: cleanId });
        if (!foundData) {
          foundData = await db
            .collection("sos_requests")
            .findOne({ customId: cleanId });
        }
        if (foundData)
          return res.status(200).json({ success: true, data: foundData });
        return res
          .status(404)
          .json({ success: false, error: "Код олдсонгүй." });
      }

      const [normal, sos] = await Promise.all([
        db.collection("answers").find({}).toArray(),
        db.collection("sos_requests").find({}).toArray(),
      ]);
      const allData = [...normal, ...sos].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      return res.status(200).json({ success: true, data: allData });
    }

    if (req.method === "POST") {
      const body = req.body;

      // АДМИН ХАРИУ БИЧИХ
      if (body.adminReply !== undefined && (body.id || body.customId)) {
        const targetId = body.id || body.customId;
        const updateDoc = {
          $set: {
            status: body.status || "Шийдвэрлэсэн",
            adminReply: body.adminReply,
            updatedAt: new Date(),
          },
        };
        const r1 = await db
          .collection("answers")
          .updateOne({ customId: targetId }, updateDoc);
        const r2 = await db
          .collection("sos_requests")
          .updateOne({ customId: targetId }, updateDoc);
        if (r1.matchedCount > 0 || r2.matchedCount > 0)
          return res.status(200).json({ success: true });
        return res.status(404).json({ success: false, error: "Олдсонгүй." });
      }

      // ШИНЭ ХҮСЭЛТ ХАДГАЛАХ
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
      const randomStr = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();

      const isSOS = body.isUrgent === true || body.type === "SOS";

      // ID Формат: 20260408-ABCD эсвэл SOS-20260408-ABCD
      let finalId = body.customId || `${dateStr}-${randomStr}`;
      if (isSOS && !finalId.startsWith("SOS-")) {
        finalId = `SOS-${finalId}`;
      }

      const finalDoc = {
        ...body,
        customId: finalId,
        status: body.status || "Шинэ",
        createdAt: new Date(),
      };

      if (isSOS) {
        await db.collection("sos_requests").insertOne(finalDoc);
      } else {
        await db.collection("answers").insertOne(finalDoc);
      }

      return res.status(201).json({ success: true, customId: finalId });
    }
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
