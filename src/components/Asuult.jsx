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
    question: "10. Яг одоо таны хувьд юу хамгийн чухал хэрэгцээ байна вэ?",
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
    const id = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl text-center max-w-sm w-full border border-green-100">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-black mb-2 text-slate-900">Амжилттай!</h2>
          <p className="text-slate-500 mb-6 font-bold text-sm">
            Таны нууц код:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-indigo-200 mb-6">
            <code className="text-xl font-black text-indigo-600 tracking-wider block">
              {submittedId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(submittedId);
                alert("Хуулагдлаа!");
              }}
              className="mt-3 text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-black uppercase"
            >
              📋 Код хуулах
            </button>
          </div>
          <button
            onClick={() => setSubmittedId("")}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm"
          >
            ХААХ
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 px-4">
      <div className="max-w-xl mx-auto space-y-4">
        {/* Хариу шалгах - Илүү цэгцтэй */}
        <div className="bg-indigo-900 rounded-[1.5rem] p-5 text-white shadow-lg">
          <h2 className="text-xs font-black mb-3 uppercase tracking-widest opacity-80">
            Хариу шалгах
          </h2>
          <div className="flex gap-2">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="ID код..."
              className="flex-1 p-3 rounded-xl bg-white/10 border-none text-white placeholder:text-white/30 font-bold outline-none text-sm"
            />
            <button
              onClick={handleSearch}
              className="bg-white text-indigo-900 px-5 py-3 rounded-xl font-black text-xs active:scale-95 transition-all"
            >
              ШАЛГАХ
            </button>
          </div>
          {searchResult && (
            <div className="mt-4 p-4 bg-white rounded-2xl text-slate-900 animate-in fade-in">
              <div className="flex justify-between items-center mb-2 text-[10px] font-black">
                <span className="text-slate-400 uppercase">Төлөв:</span>
                <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-md">
                  {searchResult.status}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg font-bold text-slate-700 italic border border-slate-100 text-xs">
                {searchResult.adminReply ||
                  "Багш хараахан хариу бичээгүй байна."}
              </div>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-black text-center text-slate-900 italic py-2">
          СЭТГЭЛ <span className="text-indigo-600">ЗҮЙ</span>
        </h1>

        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100"
          >
            <h3 className="text-sm font-black text-slate-800 mb-4">
              {q.question}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border-2 ${answers[q.id] === opt ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-50 text-slate-500 hover:border-indigo-100"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 space-y-4">
          <div>
            <h3 className="text-xs font-black mb-2 text-slate-400 uppercase tracking-wider">
              Дэлгэрэнгүй тайлбар
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 p-3 bg-slate-50 rounded-xl border-none outline-none text-sm font-medium resize-none"
              placeholder="Бичээрэй..."
            ></textarea>
          </div>
          <div>
            <h3 className="text-xs font-black mb-2 text-slate-400 uppercase tracking-wider">
              Зураг хавсаргах
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-[10px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-900 file:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "УНШИЖ БАЙНА..." : "ХҮСЭЛТ ИЛГЭЭХ"}
        </button>
      </div>
    </div>
  );
}
