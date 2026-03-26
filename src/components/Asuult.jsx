import { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    question: "1. Танд тохиолдож буй дээрэлхэлт ямар хэлбэрээр илэрч байна вэ?",
    options: [
      "🗣️ Үг хэлээр",
      "👊 Бие махбодиор",
      "📱 Цахимаар",
      "🔄 Дээрх бүх хэлбэрүүд",
    ],
  },
  {
    id: 2,
    question: "2. Энэ таагүй нөхцөл байдал анх хэзээ тохиолдож эхэлсэн бэ?",
    options: ["Бага сургуульд", "Дунд сургуульд", "Ахлах сургуульд", "Саяхан"],
  },
  {
    id: 3,
    question: "3. Давтамж нь ямар вэ?",
    options: ["Хэдхэн хоног", "Хэдэн сарын турш", "Нэг жилээс дээш"],
  },
  {
    id: 4,
    question: "4. Хаана болдог вэ?",
    options: ["🏫 Сургуульд", "🏠 Гэртээ", "🌳 Гадаа", "🌐 Онлайн"],
  },
  {
    id: 5,
    question: "5. Хэн дарамт үзүүлдэг вэ?",
    options: ["Ангийнхан", "Найзууд", "Ахмад хүн", "Танихгүй хүн"],
  },
  {
    id: 6,
    question: "6. Хэн нэгэнд итгэж ярьсан уу?",
    options: ["✅ Тийм", "❌ Үгүй"],
  },
  {
    id: 7,
    question: "7. Тэдний хандлага ямар байсан бэ?",
    options: ["🤝 Тусалсан", "😐 Тоогоогүй", "⚠️ Буруутгасан"],
  },
  {
    id: 8,
    question: "8. Сэтгэл санаанд яаж нөлөөлж байна?",
    options: ["😟 Айдастай", "😔 Ганцаардсан", "😐 Нөлөөлөөгүй"],
  },
  {
    id: 9,
    question: "9. Юу хамгийн их тус болох вэ?",
    options: [
      "👨‍👩‍👧 Гэр бүл",
      "🫂 Найз нөхөд",
      "🛡️ Өөрөө",
      "🎓 Мэргэжлийн зөвлөгөө",
    ],
  },
  {
    id: 10,
    question: "10. Юу хамгийн чухал хэрэгцээ байна вэ?",
    options: ["❤️ Хайр халамж", "💡 Зөвлөгөө", "💪 Итгэл", "👂 Сонсох хүн"],
  },
];

export default function Asuult() {
  const [answers, setAnswers] = useState({});
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const convertToBase64 = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.readAsDataURL(f);
      r.onload = () => res(r.result);
      r.onerror = (e) => rej(e);
    });

  const handleSubmit = async () => {
    if (!questions.every((q) => answers[q.id]))
      return alert("Бүх асуултыг бөглөнө үү!");
    setLoading(true);

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const randomLetters = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    const customId = `${dateStr}-${randomLetters}`;

    try {
      let img = file ? await convertToBase64(file) : "";
      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customId, answers, description, imageUrl: img }),
      });
      const data = await res.json();
      if (data.success) setSubmittedId(customId);
      else alert("Алдаа: " + data.message);
    } catch (e) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId) return alert("ID-гаа оруулна уу.");
    const res = await fetch(`/api/huselt?id=${searchId.trim().toUpperCase()}`);
    const data = await res.json();
    if (data.success) setSearchResult(data.data);
    else alert("Хүсэлт олдсонгүй.");
  };

  if (submittedId)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-4xl">
            ✓
          </div>
          <h2 className="text-2xl font-black mb-4">Амжилттай илгээгдлээ!</h2>
          <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-dashed border-indigo-200 mb-6">
            <code className="text-2xl font-black text-indigo-600 tracking-wider">
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
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Хариу шалгах хэсэг - Responsive зассан */}
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
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
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

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? "УНШИЖ БАЙНА..." : "ХҮСЭЛТ ИЛГЭЭХ"}
        </button>
      </div>
    </div>
  );
}
