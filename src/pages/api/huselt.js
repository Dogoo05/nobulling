import { getDatabase } from "../../lib/mongodb";

export const config = {
  api: {
    // Зураг (Base64) дамжуулах үед 10mb хүрэхгүй байх магадлалтай тул 20mb болгов
    bodyParser: { sizeLimit: "20mb" },
  },
};

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const collection = db.collection("answers");

    // 1. GET - Мэдээлэл татах (Бүгд эсвэл ID-аар)
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        // ID-г цэвэрлэж хайх (Талбарын нэр: customId)
        const cleanId = id.toString().trim().toUpperCase();
        const item = await collection.findOne({ customId: cleanId });

        if (!item) {
          return res.status(404).json({
            success: false,
            message: "Мэдээлэл олдсонгүй",
          });
        }
        return res.status(200).json({ success: true, data: item });
      }

      // Жагсаалт татах (Хамгийн сүүлийнх нь эхэндээ)
      const data = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, data });
    }

    // 2. POST - Шинэ хүсэлт хадгалах
    if (req.method === "POST") {
      const { customId, answers, description, imageUrl, studentInfo } =
        req.body;

      if (!customId || !answers) {
        return res.status(400).json({
          success: false,
          message: "Мэдээлэл дутуу байна (ID эсвэл Хариулт байхгүй)",
        });
      }

      const newDoc = {
        customId: customId.toString().trim().toUpperCase(),
        answers,
        description: description || "",
        imageUrl: imageUrl || "", // Frontend-ээс шахагдсан Base64 ирнэ
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

    // 3. PATCH - Багш хариу бичих, Төлөв өөрчлөх
    if (req.method === "PATCH") {
      const { id, status, adminReply } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "ID шаардлагатай" });
      }

      const result = await collection.updateOne(
        { customId: id.toString().trim().toUpperCase() },
        {
          $set: {
            status: status || "Шийдвэрлэсэн",
            adminReply: adminReply || "",
            resolvedAt: new Date(),
          },
        },
      );

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Засах өгөгдөл олдсонгүй" });
      }

      return res.status(200).json({ success: true });
    }

    // 4. DELETE - Устгах
    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "ID шаардлагатай" });
      }

      const deleteResult = await collection.deleteOne({
        customId: id.toString().trim().toUpperCase(),
      });

      if (deleteResult.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Устгах өгөгдөл олдсонгүй" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Амжилттай устгалаа" });
    }

    // Хэрэв өөр Method (PUT г.м) орж ирвэл
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("API Error Log:", error);
    return res.status(500).json({
      success: false,
      message: "Сервер дээр алдаа гарлаа",
      error: error.message, // Туршилтын үед алдааг харах нь тустай
    });
  }
}
