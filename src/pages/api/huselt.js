import { getDatabase } from "../../lib/mongodb";

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" },
  },
};

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const collection = db.collection("answers");

    // ✅ GET (бүгд эсвэл ганц)
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        const item = await collection.findOne({ customId: id });

        if (!item) {
          return res.status(404).json({
            success: false,
            message: "Мэдээлэл олдсонгүй",
          });
        }

        return res.status(200).json({
          success: true,
          data: item,
        });
      }

      const data = await collection.find({}).sort({ createdAt: -1 }).toArray();

      return res.status(200).json({
        success: true,
        data,
      });
    }

    // ✅ POST (шинэ хүсэлт)
    if (req.method === "POST") {
      const { customId, answers, description, imageUrl, studentInfo } =
        req.body;

      if (!customId || !answers) {
        return res.status(400).json({
          success: false,
          message: "Мэдээлэл дутуу байна",
        });
      }

      const newDoc = {
        customId,
        answers,
        description: description || "",
        imageUrl: imageUrl || "",
        studentInfo: studentInfo || {},
        status: "Хүлээгдэж буй",
        adminReply: "",
        createdAt: new Date(),
      };

      await collection.insertOne(newDoc);

      return res.status(201).json({
        success: true,
        id: customId,
      });
    }

    // ✅ PATCH (засах / багш хариу)
    if (req.method === "PATCH") {
      const { id, status, adminReply } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID шаардлагатай",
        });
      }

      const result = await collection.updateOne(
        { customId: id },
        {
          $set: {
            status: status || "Шийдвэрлэсэн",
            adminReply: adminReply || "",
            resolvedAt: new Date(),
          },
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Өгөгдөл олдсонгүй",
        });
      }

      return res.status(200).json({
        success: true,
      });
    }

    // ✅ DELETE
    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID шаардлагатай",
        });
      }

      await collection.deleteOne({ customId: id });

      return res.status(200).json({
        success: true,
        message: "Амжилттай устгалаа",
      });
    }

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("API Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Серверийн алдаа",
    });
  }
}
