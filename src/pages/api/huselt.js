import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("test");
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      if (id) {
        const cleanId = id.trim();
        let query = {};

        if (cleanId.length === 24) {
          try {
            query = { _id: new ObjectId(cleanId) };
          } catch (e) {
            query = { customId: cleanId };
          }
        } else {
          query = { customId: cleanId };
        }

        let result = await db.collection("answers").findOne(query);
        if (!result) {
          result = await db.collection("sos_requests").findOne(query);
        }

        if (result)
          return res.status(200).json({ success: true, data: result });
        return res
          .status(404)
          .json({ success: false, error: "Мэдээлэл олдсонгүй" });
      }

      const [normal, sos] = await Promise.all([
        db.collection("answers").find({}).toArray(),
        db.collection("sos_requests").find({}).toArray(),
      ]);
      const allData = [...normal, ...sos].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      return res.status(200).json({ success: true, data: allData });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const { status, adminReply } = req.body;
      if (!id)
        return res
          .status(400)
          .json({ success: false, error: "ID байхгүй байна" });

      const updateDoc = {
        $set: {
          status: status || "Шийдвэрлэсэн",
          adminReply: adminReply,
          updatedAt: new Date(),
        },
      };

      let query = {};
      if (id.length === 24) {
        try {
          query = { _id: new ObjectId(id) };
        } catch (e) {
          query = { customId: id };
        }
      } else {
        query = { customId: id };
      }

      let result = await db.collection("answers").updateOne(query, updateDoc);
      if (result.matchedCount === 0) {
        result = await db
          .collection("sos_requests")
          .updateOne(query, updateDoc);
      }

      if (result.matchedCount > 0)
        return res.status(200).json({ success: true });
      return res
        .status(404)
        .json({ success: false, error: "Засах өгөгдөл олдсонгүй" });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
      const randomStr = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();

      const isSOS =
        body.isUrgent === true ||
        body.type === "SOS" ||
        (body.answers && body.answers[9] === "SOS");

      let finalId = body.customId || `${dateStr}-${randomStr}`;
      if (isSOS && !finalId.startsWith("SOS-")) finalId = `SOS-${finalId}`;

      const finalDoc = {
        ...body,
        customId: finalId,
        status: "Шинэ",
        createdAt: new Date(),
      };

      if (isSOS) await db.collection("sos_requests").insertOne(finalDoc);
      else await db.collection("answers").insertOne(finalDoc);

      return res.status(201).json({ success: true, customId: finalId });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }
}
