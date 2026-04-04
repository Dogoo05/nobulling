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
      "🚨 ЯАРАЛТАЙ ТУСЛАМЖ",
    ],
  },
  {
    id: 2,
    question: "2. Энэ байдал анх хэзээ тохиолдож эхэлсэн бэ?",
    options: ["Бага сургуульд", "Дунд сургуульд", "Ахлах сургуульд", "Саяхан"],
  },
  {
    id: 3,
    question: "3. Давтамж нь ямар vэ?",
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

export default function Asuult() {
  const [answers, setAnswers] = useState({});
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [copied, setCopied] = useState(false); // Хуулсан эсэхийг шалгах төлөв

  const processImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.5));
        };
      };
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2 секундын дараа буцаах
    } catch (err) {
      console.error("Хуулж чадсангүй: ", err);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      return alert("Бүх асуултад хариулна уу.");
    }

    setLoading(true);
    const isUrgent = answers[1]?.includes("🚨");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const finalId = isUrgent
      ? `SOS-${dateStr}-${randomPart}`
      : `${dateStr}-${randomPart}`;

    try {
      let imgBase64 = file ? await processImage(file) : "";
      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customId: finalId,
          answers,
          description,
          imageUrl: imgBase64,
        }),
      });

      const data = await res.json();
      if (data.success) setSubmittedId(finalId);
      else alert("Алдаа: " + data.error);
    } catch (e) {
      alert("Илгээхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 text-center max-w-md w-full border border-indigo-50 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">
            ✓
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
            Амжилттай!
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
            Таны нууц кодыг хадгалж аваарай
          </p>

          {/* ID-г хуулах хэсэг */}
          <div
            onClick={handleCopy}
            className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 mb-8 group transition-all hover:border-indigo-300 hover:bg-white cursor-pointer relative overflow-hidden active:scale-95 transition-transform"
          >
            <code className="text-3xl font-black text-indigo-600 tracking-widest block select-all">
              {submittedId}
            </code>
            <p className="text-[10px] font-black uppercase text-indigo-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? "Код хуулагдлаа! ✅" : "Дарж хуулж авна уу 📋"}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 ${copied ? "bg-green-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"}`}
            >
              {copied ? "📋 ХУУЛАГДЛАА" : "📋 КОД ХУУЛАХ"}
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-indigo-200"
            >
              Нүүр хуудас руу буцах
            </button>
          </div>

          <p className="mt-8 text-[9px] text-slate-300 font-bold leading-relaxed uppercase">
            Энэ кодыг ашиглан хүсэлтийнхээ <br /> хариуг шалгах боломжтой.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] py-12 px-4 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto space-y-10 pb-24">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Safe Space
          </div>
          <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter sm:text-5xl">
            Тусламж{" "}
            <span className="text-indigo-600 underline decoration-indigo-200">
              авах
            </span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Анкет бөглөх хэсэг
          </p>
        </header>

        {/* Questions Grid */}
        <div className="grid gap-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-3 leading-tight">
                <span className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] shrink-0 italic">
                  {q.id}
                </span>
                {q.question}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                    className={`p-4 rounded-2xl text-[11px] font-black transition-all border-2 text-left flex justify-between items-center group
                      ${
                        answers[q.id] === opt
                          ? opt.includes("🚨")
                            ? "border-red-500 bg-red-50 text-red-900"
                            : "border-indigo-600 bg-indigo-50 text-indigo-900"
                          : "border-slate-50 bg-slate-50/50 text-slate-500 hover:border-indigo-100 hover:bg-white"
                      }`}
                  >
                    {opt}
                    <div
                      className={`w-2 h-2 rounded-full transition-all ${answers[q.id] === opt ? (opt.includes("🚨") ? "bg-red-500 scale-125" : "bg-indigo-600 scale-125") : "bg-slate-200 opacity-0 group-hover:opacity-100"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Extra Info Section */}
        <div className="bg-indigo-900 p-8 rounded-[3rem] shadow-2xl space-y-6 text-white">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-2">
              Нэмэлт тайлбар (заавал биш)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-40 p-6 bg-indigo-800/50 rounded-[2rem] border-none outline-none text-sm font-bold resize-none focus:ring-4 ring-indigo-500/20 placeholder:text-indigo-400/50"
              placeholder="Танд тохиолдсон зүйлийг энд дэлгэрэнгүй бичиж болно..."
            />
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300 ml-2">
              Зураг эсвэл нотлох баримт
            </label>
            <div className="flex flex-wrap gap-4 items-center">
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
                <div className="w-20 h-20 bg-indigo-800 rounded-3xl flex items-center justify-center text-2xl border-2 border-dashed border-indigo-600 transition-all group-hover:border-white group-hover:bg-indigo-700">
                  📸
                </div>
              </label>

              {preview && (
                <div className="relative group">
                  <img
                    src={preview}
                    className="w-20 h-20 object-cover rounded-3xl border-2 border-white/20"
                    alt="Preview"
                  />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-black shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              )}
              {!preview && (
                <p className="text-[10px] text-indigo-400 font-bold uppercase italic">
                  Зураг хавсаргах боломжтой
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Илгээж байна...
            </span>
          ) : (
            "Анкет илгээх"
          )}
        </button>
      </div>
    </div>
  );
}
