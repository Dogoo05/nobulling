import clientPromise from "@/lib/dbConnect";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("test"); // Хэрэв чиний бааз өөр нэртэй бол энд сольж бичээрэй

    // --- GET: Мэдээлэл татах ---
    if (req.method === "GET") {
      const { id } = req.query;
      if (id && id !== "undefined") {
        const cleanId = id.toUpperCase().trim();
        let foundData = await db
          .collection("answers")
          .findOne({ customId: cleanId });
        if (!foundData)
          foundData = await db
            .collection("sos_requests")
            .findOne({ customId: cleanId });
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

    // --- POST: Шинэ хүсэлт хадгалах ЭСВЭЛ Хариу бичих ---
    if (req.method === "POST") {
      const body = req.body;

      // 1. АДМИН ХАРИУ БИЧИЖ БАЙГАА ТОХИОЛДОЛ (Body дотор customId байгаа бол)
      if (body.id || body.customId) {
        const targetId = body.id || body.customId;
        const updateDoc = {
          $set: {
            status: body.status || "Шийдвэрлэсэн",
            adminReply: body.adminReply || "",
            updatedAt: new Date(),
          },
        };
        const r1 = await db
          .collection("answers")
          .updateOne({ customId: targetId }, updateDoc);
        const r2 = await db
          .collection("sos_requests")
          .updateOne({ customId: targetId }, updateDoc);

        if (r1.matchedCount > 0 || r2.matchedCount > 0) {
          return res.status(200).json({ success: true });
        }
      }

      // 2. ХЭРЭГЛЭГЧ ШИНЭ ХҮСЭЛТ ИЛГЭЭЖ БАЙГАА ТОХИОЛДОЛ
      const finalDoc = {
        ...body,
        status: body.status || "Шинэ",
        createdAt: new Date(),
      };

      let result;
      // SOS (🚨) агуулсан бол sos_requests руу, үгүй бол answers руу
      if (body.answers && body.answers[3]?.includes("🚨")) {
        result = await db.collection("sos_requests").insertOne(finalDoc);
      } else {
        result = await db.collection("answers").insertOne(finalDoc);
      }

      return res.status(201).json({ success: true, data: result });
    }

    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  } catch (e) {
    console.error("MONGODB ERROR:", e);
    return res.status(500).json({ success: false, error: e.message });
  }
}
