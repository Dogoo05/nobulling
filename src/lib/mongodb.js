import clientPromise from "./dbConnect";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("safe_space"); 

  
    if (req.method === "POST") {
      const { answers, description, imageUrl, isUrgent } = req.body;


      const customId =
        "SOS-" + Math.random().toString(36).substring(2, 7).toUpperCase();

      const newHuselt = {
        customId,
        answers,
        description,
        imageUrl,
        isUrgent,
        status: "Хүлээгдэж буй",
        createdAt: new Date(),
      };

      const result = await db.collection("huselts").insertOne(newHuselt);

      return res.status(201).json({
        success: true,
        customId: customId,
        id: result.insertedId,
      });
    }

    if (req.method === "GET") {
      const data = await db
        .collection("huselts")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({ success: true, data });
    }


    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Серверт алдаа гарлаа. Терминалаа шалгана уу.",
    });
  }
}
