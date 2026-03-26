import clientPromise from "../../lib/mongodb";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("answers"); // Collection нэрээ шалгаарай

    // GET: Мэдээлэл унших
    if (req.method === "GET") {
      // Кэшээс сэргийлэх толгой мэдээлэл (304 алдаанаас сэргийлнэ)
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );

      const { id } = req.query;

      if (id) {
        const data = await collection.findOne({ customId: id.toUpperCase() });
        return res.status(200).json({ success: !!data, data });
      }

      // Жагсаалт харахдаа хамгийн сүүлийнх нь дээрээ байхаар эрэмбэлэх
      const allData = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({ success: true, data: allData });
    }

    // POST: Шинэ анкет хадгалах
    if (req.method === "POST") {
      const { customId, answers, description, imageUrl, isUrgent } = req.body;

      const result = await collection.insertOne({
        customId: customId.toUpperCase(),
        answers: answers || {},
        description: description || "",
        imageUrl: imageUrl || "",
        isUrgent: isUrgent || false, // SOS эсэхийг энд хадгална
        status: "Хүлээгдэж буй",
        adminReply: "",
        createdAt: new Date(), // Үүнийг заавал хадгална (Manager дээр харагдана)
      });

      return res.status(200).json({ success: true, data: result });
    }

    // PATCH: Хариу бичих (Manager-ээс)
    if (req.method === "PATCH") {
      const { id, status, adminReply } = req.body;

      const result = await collection.updateOne(
        { customId: id },
        {
          $set: {
            status: status,
            adminReply: adminReply,
            updatedAt: new Date(),
          },
        },
      );

      return res.status(200).json({ success: !!result.matchedCount });
    }

    // DELETE: Устгах
    if (req.method === "DELETE") {
      const { id } = req.query;
      const result = await collection.deleteOne({ customId: id });
      return res.status(200).json({ success: !!result.deletedCount });
    }

    // Хэрэв өөр Method орж ирвэл
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("MongoDB Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
