import { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    question:
      "1. Танд тохиолдож буй дээрэлхэлт голчлон ямар хэлбэрээр илэрч байна вэ?",
    options: [
      "🗣️ Үг хэлээр (Доромжлох, нэр хоч өгөх, гадуурхах)",
      "👊 Бие махбодиор (Цохих, түлхэх, эд зүйл эвдэх)",
      "📱 Цахимаар (Муу хэлэх, зургийг чинь зөвшөөрөлгүй тараах)",
      "🔄 Дээрх бүх хэлбэрүүд хосолсон",
    ],
  },
  {
    id: 2,
    question: "2. Энэ таагүй нөхцөл байдал анх хэзээ тохиолдож эхэлсэн бэ?",
    options: [
      "Бага сургуульд байхад",
      "Дунд сургуульд",
      "Ахлах сургуульд",
      "Саяхан (Одоо)",
    ],
  },
  {
    id: 3,
    question:
      "3. Энэ байдал хэр удаан хугацаанд, ямар давтамжтай үргэлжилж байна вэ?",
    options: ["Хэдхэн хоног", "Хэдэн сарын турш", "Нэг жилээс дээш хугацаанд"],
  },
  {
    id: 4,
    question: "4. Дээрэлхэлт голчлон хаана болдог вэ?",
    options: [
      "🏫 Сургуулийн орчинд",
      "🏠 Гэртээ эсвэл ойр орчимд",
      "🌳 Гудамж талбай, гадаа",
      "🌐 Сошиал медиа, онлайн тоглоом",
    ],
  },
  {
    id: 5,
    question: "5. Чамд хэн хамгийн их дарамт үзүүлдэг вэ?",
    options: [
      "Ангийнхан эсвэл сургуулийн хүүхдүүд",
      "Найз нөхөд гэж боддог байсан хүмүүс",
      "Наснаас ахмад хүн",
      "Танихгүй хүн (Онлайн)",
    ],
  },
  {
    id: 6,
    question: "6. Чи энэ талаар хэн нэгэнд итгэж ярьж байсан уу?",
    options: ["✅ Тийм, хэлж байсан", "❌ Үгүй, хэнд ч хэлээгүй"],
  },
  {
    id: 7,
    question:
      "7. Хэрвээ хэн нэгэнд хэлж байсан бол тэдний хандлага ямар байсан бэ?",
    options: [
      "🤝 Намайг ойлгож, тусалсан",
      "😐 Тоолгүй орхисон эсвэл анхаараагүй",
      "⚠️ Намайг буруутгасан / Бусад",
    ],
  },
  {
    id: 8,
    question: "8. Энэ зүйл чиний сэтгэл санаанд яаж нөлөөлж байна?",
    options: [
      "😟 Үргэлж стресстэй, айдастай байгаа",
      "😔 Маш их санаа зовж, ганцаардаж байна",
      "😐 Одоогоор онцгой нөлөө мэдрэгдээгүй",
    ],
  },
  {
    id: 9,
    question:
      "9. Танд энэ нөхцөл байдлаас гарахад юу хамгийн их тус болно гэж бодож байна?",
    options: [
      "👨‍👩‍👧 Гэр бүлийн дэмжлэг",
      "🫂 Үнэнч найз нөхдийн тусламж",
      "🛡️ Өөрийнхөө шийдэмгий алхам",
      "🎓 Мэргэжлийн зөвлөгөө (Багш, Сэтгэл зүйч)",
    ],
  },
  {
    id: 10,
    question: "10. Яг одоо таны хувьд юу хамгийн чухал хэрэгцээ байна вэ?",
    options: [
      "❤️ Хайр халамж, дэмжлэг",
      "💡 Шийдвэрлэх арга замын зөвлөгөө",
      "💪 Өөртөө итгэх итгэл, хүч чадал",
      "👂 Зүгээр л хэн нэгэн намайг сонсох",
    ],
  },
];

export default function Asuult() {
  const [answers, setAnswers] = useState({});
  const [submittedId, setSubmittedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // --- ШИНЭ: ТАЙЛБАР БОЛОН ЗУРГИЙН STATE ---
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // Сонгосон файл
  // ------------------------------------------

  // --- ШИНЭ: ЗУРГИЙГ BASE64 БОЛГОХ ФУНКЦ ---
  const convertToBase64 = (f) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(f);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  // ------------------------------------------

  const handleSubmit = async () => {
    if (!questions.every((q) => answers[q.id])) {
      return alert("Бүх асуултыг бөглөнө үү!");
    }

    setLoading(true);

    // Давтагдахгүй ID үүсгэх (Огноо + Санамсаргүй 4 тэмдэгт)
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const randomChars = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    const customId = `${dateStr}-${randomChars}`;

    try {
      // --- ШИНЭ: ЗУРГИЙГ BASE64 БОЛГОЖ ХӨРВҮҮЛЭХ ---
      let base64Image = "";
      if (file) {
        // Зургийн хэмжээ 2МБ-аас ихгүй байхыг шалгах (сонголтоор)
        if (file.size > 2 * 1024 * 1024) {
          alert("Зургийн хэмжээ 2МБ-аас ихгүй байх ёстой.");
          setLoading(false);
          return;
        }
        base64Image = await convertToBase64(file);
      }
      // ----------------------------------------------

      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- ШИНЭ: ТАЙЛБАР БОЛОН BASE64 ЗУРГИЙГ БОДИ ДЭЭР НЭМЭХ ---
        body: JSON.stringify({
          customId,
          answers,
          description, // Тайлбар
          imageUrl: base64Image, // Зураг
        }),
        // --------------------------------------------------------
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedId(customId);
      } else {
        alert("Алдаа: " + data.message);
      }
    } catch (e) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId) return alert("ID кодоо оруулна уу.");
    const cleanId = searchId.trim().toUpperCase();
    const res = await fetch(`/api/huselt?id=${cleanId}`);
    const data = await res.json();
    if (data.success) {
      setSearchResult(data.data);
    } else {
      alert("Хүсэлт олдсонгүй. Кодоо зөв эсэхийг шалгана уу.");
    }
  };

  if (submittedId)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-4xl">
            ✓
          </div>
          <h2 className="text-2xl font-black mb-4">Амжилттай илгээгдлээ!</h2>
          <p className="text-slate-500 font-bold mb-6">
            Доорх ID кодыг хадгалж аваад хариугаа шалгаарай.
          </p>
          <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-dashed border-indigo-200 mb-6">
            <code className="text-2xl font-black text-indigo-600 break-all tracking-wider">
              {submittedId}
            </code>
          </div>
          <button
            onClick={() => setSubmittedId("")}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black"
          >
            ОЙЛГОЛОО
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 font-['Geist',sans-serif]">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Хариу шалгах хэсэг */}
        <div className="bg-indigo-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
          <h2 className="text-lg font-black mb-4 uppercase tracking-widest text-center sm:text-left">
            Хариу шалгах
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="ID кодоо оруулна уу..."
              className="flex-1 p-4 rounded-2xl bg-white/10 border-none text-white placeholder:text-white/30 font-bold outline-none text-center sm:text-left"
            />
            <button
              onClick={handleSearch}
              className="bg-white text-indigo-900 px-8 py-4 sm:py-0 rounded-2xl font-black text-sm active:scale-95 transition-all"
            >
              ШАЛГАХ
            </button>
          </div>
          {searchResult && (
            <div className="mt-6 p-6 bg-white rounded-3xl text-slate-900">
              <div className="flex justify-between items-center mb-4 text-xs font-black text-slate-400">
                <span>ТӨЛӨВ:</span>
                <span
                  className={`px-3 py-1 rounded-full ${searchResult.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-indigo-50 text-indigo-600"}`}
                >
                  {searchResult.status}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold text-slate-700 italic">
                {searchResult.adminReply ||
                  "Багш хараахан хариу бичээгүй байна."}
              </div>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-black text-center text-slate-900 italic">
          СЭТГЭЛ <span className="text-indigo-600">ЗҮЙ</span>
        </h1>

        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100"
          >
            <h3 className="text-lg font-black text-slate-800 mb-6">
              {q.question}
            </h3>
            <div className="grid gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                  className={`p-4 rounded-2xl text-left font-bold transition-all border-2 ${answers[q.id] === opt ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-50 text-slate-500 hover:border-indigo-50"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* --- ШИНЭ: ТАЙЛБАР БИЧИХ ХЭСЭГ --- */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100">
          <h3 className="text-lg font-black mb-4 text-slate-800">
            Дэлгэрэнгүй тайлбар (Сонголтоор)
          </h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-40 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
            placeholder="Энд бичээрэй..."
          ></textarea>
        </div>
        {/* ---------------------------------- */}

        {/* --- ШИНЭ: ЗУРАГ ХАВСАРГАХ ХЭСЭГ --- */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100">
          <h3 className="text-lg font-black mb-4 text-slate-800">
            Зураг хавсаргах (Сонголтоор)
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800"
          />
        </div>
        {/* ---------------------------------- */}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "УНШИЖ БАЙНА..." : "ХҮСЭЛТ ИЛГЭЭХ"}
        </button>
      </div>
    </div>
  );
}
