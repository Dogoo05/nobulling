import clientPromise from "@/lib/dbConnect";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db =
      typeof client.db === "function"
        ? client.db("test")
        : client.connection.db;

    if (req.method === "GET") {
      const { id } = req.query;


      if (id) {
        const cleanId = id.toUpperCase().trim();


        let foundData = await db
          .collection("answers")
          .findOne({ customId: cleanId });


        if (!foundData) {
          foundData = await db
            .collection("sos_requests")
            .findOne({ customId: cleanId });
        }

        if (foundData) {
          return res.status(200).json({ success: true, data: foundData });
        } else {
          return res.status(404).json({
            success: false,
            error: "Код олдсонгүй. Та кодоо зөв оруулсан уу?",
          });
        }
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
      const { answers, description, imageUrl, isUrgent } = req.body;
      const isSOS =
        isUrgent || Object.values(answers || {}).some((v) => v === "🚨 SOS");

      const now = new Date();
      const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
      const randomStr = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
      const customId = isSOS
        ? `SOS-${dateStr}-${randomStr}`
        : `${dateStr}-${randomStr}`;

      const newDoc = {
        customId,
        answers: answers || {},
        description: description || "",
        imageUrl: imageUrl || "",
        status: "Шинэ",
        adminReply: "",
        isUrgent: isSOS,
        createdAt: now,
      };

      const colName = isSOS ? "sos_requests" : "answers";
      await db.collection(colName).insertOne(newDoc);
      return res.status(200).json({ success: true, customId });
    }

    if (req.method === "PATCH") {
      const { id, status, adminReply } = req.body;
      const updateData = {
        $set: { status, adminReply, updatedAt: new Date() },
      };

      const r1 = await db
        .collection("answers")
        .updateOne({ customId: id }, updateData);
      const r2 = await db
        .collection("sos_requests")
        .updateOne({ customId: id }, updateData);

      if (r1.modifiedCount > 0 || r2.modifiedCount > 0) {
        return res.status(200).json({ success: true });
      }
      return res
        .status(404)
        .json({ success: false, error: "Шинэчлэх дата олдсонгүй" });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      await db.collection("answers").deleteOne({ customId: id });
      await db.collection("sos_requests").deleteOne({ customId: id });
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
