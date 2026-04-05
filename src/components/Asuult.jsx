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

  const handleCopy = () => {
    if (!submittedId) return;
    navigator.clipboard.writeText(submittedId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async () => {
    // Бүх асуултад хариулсан эсэхийг шалгах
    if (Object.keys(answers).length < questions.length) {
      alert("Бүх асуултад хариулна уу!");
      return;
    }

    setLoading(true);
    let finalImageUrl = "";

    try {
      // 1. Зураг байгаа бол Cloudinary руу хуулах
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_defaultt"); // <--- Өөрийн Preset нэрийг энд бич!

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/dccr94tvw/image/upload", // <--- dpxv1abc-ийн оронд өөрийн Cloud Name-ийг бич!
          { method: "POST", body: formData },
        );

        const cloudData = await cloudRes.json();
        if (cloudRes.ok) {
          finalImageUrl = cloudData.secure_url;
          console.log("Cloudinary URL:", finalImageUrl);
        } else {
          console.error("Cloudinary Error:", cloudData);
          alert(
            "Зураг хуулахад алдаа гарлаа, гэхдээ анкет үргэлжлүүлэн илгээгдэнэ.",
          );
        }
      }

      // 2. БЭКЕНД РҮҮ ИЛГЭЭХ
      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          description,
          imageUrl: finalImageUrl, // Энд зурагны линк очиж байгаа
          isUrgent: false,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSubmittedId(result.customId);
      } else {
        alert("Алдаа: " + result.error);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Илгээхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-6 font-sans">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl text-center border border-slate-50">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
            Амжилттай!
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">
            Кодоо хадгалж аваарай
          </p>
          <div
            onClick={handleCopy}
            className={`p-8 rounded-[2rem] border-2 border-dashed cursor-pointer transition-all active:scale-95 ${copied ? "bg-green-50 border-green-500" : "bg-slate-50 border-slate-200"}`}
          >
            <code
              className={`text-2xl font-black tracking-widest block ${copied ? "text-green-600" : "text-indigo-600"}`}
            >
              {copied ? "ХУУЛАГДЛАА ✅" : submittedId}
            </code>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-colors"
          >
            Нүүр хуудас
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
            Safe Space System
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">
            Тусламж <span className="text-indigo-600">авах</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-[12px] font-black uppercase tracking-tight text-slate-800 mb-6">
                {q.question}
              </h3>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                    className={`px-4 py-3 rounded-xl text-[10px] font-black border-2 transition-all uppercase tracking-tighter ${answers[q.id] === opt ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-36 p-6 bg-slate-800 rounded-[2rem] border-none outline-none text-white text-sm font-bold resize-none placeholder:text-slate-600 focus:ring-2 ring-indigo-500"
              placeholder="Дэлгэрэнгүй бичих (сонголттой)..."
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="cursor-pointer group">
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
                <div className="relative">
                  <img
                    src={preview}
                    className="w-32 h-32 object-cover rounded-[2rem] border-4 border-indigo-500 shadow-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                    СОЛИХ
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 bg-slate-800 rounded-[2rem] flex items-center justify-center text-3xl hover:bg-slate-700 transition-colors border-2 border-dashed border-slate-600">
                  📸
                </div>
              )}
            </label>
            <p className="text-[8px] text-slate-500 font-black uppercase mt-2 tracking-widest italic text-center">
              Зураг хавсаргах
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto pb-20">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-xl hover:bg-indigo-700 disabled:opacity-50 active:scale-95 transition-all"
          >
            {loading ? "Түр хүлээнэ үү..." : "АНКЕТ ИЛГЭЭХ"}
          </button>
        </div>
      </div>
    </div>
  );
}
