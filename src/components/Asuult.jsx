import { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    question: "1. Танд тохиолдож буй дээрэлхэлт ямар хэлбэрээр илэрч байна вэ?",
    options: [
      "🗣️ Үг хэлээр",
      "👊 Бие махбодиор",
      "📱 Цахимаар",
      "🔄 Бүх хэлбэрүүд",
      "🚨 SOS",
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
    options: ["👨‍👩‍👧 Гэр бүл", "🫂 Найз нөхөд", "🛡️ Өөрөө", "🎓 Зөвлөгөө"],
  },
  {
    id: 10,
    question: "10. Яг одоо таны хувьд юу хамгийн чухал хэрэгцээ байна вэ?",
    options: ["❤️ Хайр халамж", "💡 Зөвлөгөө", "💪 Итгэл", "👂 Сонсох хүн"],
  },
];

export default function Asuult() {
  const [answers, setAnswers] = useState({});
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleCopy = () => {
    if (!submittedId) return;
    navigator.clipboard.writeText(submittedId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setToast({ show: true, message: "Бүх асуултад хариулна уу ⚠️" });
      setTimeout(() => setToast({ show: false }), 3000);
      return;
    }
    setLoading(true);
    // Дуураймал илгээх хугацаа
    setTimeout(() => {
      const id =
        "SOS-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      setSubmittedId(id);
      setLoading(false);
    }, 1500);
  };

  // --- Амжилттай илгээгдсэн үеийн харагдац ---
  if (submittedId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[3.5rem] shadow-2xl text-center border border-slate-50 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner italic">
            ✓
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
            Хүлээн авлаа!
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">
            Таны нууц кодыг хадгалж аваарай
          </p>

          {/* --- ХУУЛАХ ХЭСЭГ: Ногоон болох эффект --- */}
          <div
            onClick={handleCopy}
            className={`group p-8 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 cursor-pointer active:scale-95 mb-10
              ${copied ? "bg-green-50 border-green-500 shadow-lg shadow-green-100" : "bg-slate-50 border-slate-200 hover:border-indigo-300"}`}
          >
            <code
              className={`text-2xl font-black tracking-widest block transition-colors duration-300 ${copied ? "text-green-600" : "text-indigo-600"}`}
            >
              {copied ? "АМЖИЛТТАЙ ХУУЛАГДЛАА ✅" : submittedId}
            </code>
            <p
              className={`text-[8px] font-black uppercase mt-3 tracking-widest transition-colors ${copied ? "text-green-400" : "text-slate-300 group-hover:text-indigo-400"}`}
            >
              {copied ? "Clipboard-д хадгалагдлаа" : "Дарж хуулж авна уу 📋"}
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-black active:scale-95 transition-all"
          >
            Нүүр хуудас руу буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] py-12 px-4 font-sans text-slate-900">
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-top-10">
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
            Safe Space System
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900">
            Тусламж <span className="text-indigo-600">авах</span>
          </h1>
        </header>

        {/* Асуултууд: Компьютер дээр 2 багана, Утас дээр 1 багана */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="text-[12px] font-black uppercase tracking-tight text-slate-800 mb-6 leading-tight">
                {q.question}
              </h3>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                    className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all border-2 uppercase tracking-tighter
                      ${
                        answers[q.id] === opt
                          ? opt.includes("🚨")
                            ? "bg-red-600 border-red-600 text-white shadow-lg"
                            : "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                          : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Текст ба Зураг оруулах хэсэг */}
        <div className="bg-slate-900 p-8 md:p-12 rounded-[4rem] shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
              Нэмэлт тайлбар
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-36 p-8 bg-slate-800/50 rounded-[2.5rem] border-none outline-none text-white text-sm font-bold resize-none focus:ring-4 ring-indigo-500/10 transition-all placeholder:text-slate-700"
              placeholder="Тохиолдсон зүйлийг энд дэлгэрэнгүй бичиж болно..."
            />
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <label className="cursor-pointer group relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setFile(f);
                    setPreview(URL.createObjectURL(f));
                  }
                }}
                className="hidden"
              />
              {preview ? (
                <div className="relative animate-in zoom-in">
                  <img
                    src={preview}
                    className="w-32 h-32 object-cover rounded-[2.5rem] border-4 border-slate-800 shadow-2xl"
                    alt="Preview"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 text-[10px] font-black shadow-xl"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-4xl border-2 border-dashed border-slate-700 group-hover:border-indigo-500 transition-all shadow-inner">
                  📸
                </div>
              )}
            </label>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic">
              Зураг хавсаргах
            </p>
          </div>
        </div>

        {/* Илгээх товчлуур */}
        <div className="max-w-md mx-auto pb-20">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.4em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Илгээж байна..." : "АНКЕТ ИЛГЭЭХ"}
          </button>
        </div>
      </div>
    </div>
  );
}
