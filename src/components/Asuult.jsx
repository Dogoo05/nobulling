import { useState } from "react";

const questions = [
  {
    id: 1,
    question: "1. Танд тохиолдож буй дээрэлхэлт ямар хэлбэрээр илэрч байна вэ?",
    options: [
      "🗣️ Үг хэлээр",
      "👊 Бие махбодиор",
      "📱 Цахимаар",
      "🔄 Бүх хэлбэрүүд",
    ],
  },
  {
    id: 2,
    question: "2. Энэ байдал анх хэзээ тохиолдож эхэлсэн бэ?",
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

export default function HuseltPage() {
  const [answers, setAnswers] = useState({});
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Зургийг автоматаар шахаж Base64 болгох
  const processImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
    });
  };

  const handleSubmit = async () => {
    if (!questions.every((q) => answers[q.id]))
      return alert("Бүх асуултыг бөглөнө үү!");
    setLoading(true);

    const now = new Date();
    const id = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      const imgData = file ? await processImage(file) : "";
      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customId: id,
          answers,
          description,
          imageUrl: imgData,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmittedId(id);
    } catch (e) {
      alert("Алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId) return;
    const res = await fetch(`/api/huselt?id=${searchId.trim().toUpperCase()}`);
    const data = await res.json();
    if (data.success) setSearchResult(data.data);
    else alert("Мэдээлэл олдсонгүй.");
  };

  if (submittedId)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center max-w-md w-full border border-green-100">
          <div className="text-5xl mb-6">✅</div>
          <h2 className="text-2xl font-black mb-2">Амжилттай!</h2>
          <p className="text-slate-500 mb-8 font-bold">Таны нууц код:</p>
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-indigo-200 mb-8">
            <code className="text-2xl font-black text-indigo-600 tracking-widest">
              {submittedId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(submittedId);
                alert("Хуулагдлаа!");
              }}
              className="block mx-auto mt-4 text-[10px] bg-indigo-600 text-white px-4 py-2 rounded-lg font-black"
            >
              📋 КОД ХУУЛАХ
            </button>
          </div>
          <button
            onClick={() => setSubmittedId("")}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black"
          >
            ХААХ
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Хариу шалгах хэсэг */}
        <div className="bg-indigo-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl">
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
            <div className="mt-6 p-6 bg-white rounded-3xl text-slate-900 animate-in fade-in">
              <div className="flex justify-between items-center mb-4 text-[10px] font-black">
                <span className="text-slate-400">ТӨЛӨВ:</span>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                  {searchResult.status}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl font-bold text-slate-700 italic border border-slate-100">
                {searchResult.adminReply ||
                  "Багш хараахан хариу бичээгүй байна."}
              </div>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-black text-center text-slate-900 italic">
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
                  className={`p-4 rounded-xl text-left font-bold transition-all border-2 ${answers[q.id] === opt ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-50 text-slate-500 hover:border-indigo-50"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Нэмэлт мэдээлэл */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 space-y-6">
          <div>
            <h3 className="text-lg font-black mb-4">Дэлгэрэнгүй тайлбар</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 rounded-xl border-none outline-none font-medium resize-none"
              placeholder="Бичээрэй..."
            ></textarea>
          </div>
          <div>
            <h3 className="text-lg font-black mb-4">Зураг хавсаргах</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "ИЛГЭЭЖ БАЙНА..." : "ХҮСЭЛТ ИЛГЭЭХ"}
        </button>
      </div>
    </div>
  );
}
