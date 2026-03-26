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
      "🚨 ЯАРАЛТАЙ ТУСЛАМЖ", // Шинээр нэмэгдсэн
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
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const processImage = (file) => {
    return new Promise((resolve, reject) => {
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
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      return alert("Бүх асуултад хариулна уу.");
    }

    setLoading(true);

    // 1. Огноог авах (YYYYMMDD формат)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${day}`;

    // 2. Санамсаргүй 4 тэмдэгт үүсгэх
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

    // 3. SOS эсэхийг шалгах
    const isUrgent = answers[1] === "🚨 ЯАРАЛТАЙ ТУСЛАМЖ";

    // 4. Эцсийн ID үүсгэх: SOS-20260327-ABCD эсвэл 20260327-ABCD
    const finalId = isUrgent
      ? `SOS-${dateStr}-${randomPart}`
      : `${dateStr}-${randomPart}`;

    try {
      let imgData = "";
      if (file) {
        imgData = await processImage(file);
      }

      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customId: finalId, // Шинэ форматыг илгээнэ
          answers,
          description,
          imageUrl: imgData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedId(finalId);
      } else {
        alert("Алдаа гарлаа: " + (data.error || "Дахин оролдоно уу"));
      }
    } catch (e) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const cleanId = searchId.trim().toUpperCase();
    if (!cleanId) return;
    try {
      const res = await fetch(`/api/huselt?id=${cleanId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResult(data.data);
      } else {
        alert("Код олдсонгүй эсвэл буруу байна.");
        setSearchResult(null);
      }
    } catch (e) {
      alert("Хайлт хийхэд алдаа гарлаа.");
    }
  };

  if (submittedId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl text-center max-w-sm w-full border border-green-100 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✅
          </div>
          <h2 className="text-2xl font-black mb-2 text-slate-900 uppercase italic">
            Илгээгдлээ!
          </h2>
          <p className="text-slate-400 mb-2 font-bold text-[10px] uppercase tracking-widest">
            Таны нууц код:
          </p>
          <div
            className={`p-6 rounded-3xl border-2 border-dashed mb-8 ${submittedId.startsWith("SOS") ? "bg-red-50 border-red-200" : "bg-slate-50 border-indigo-200"}`}
          >
            <code
              className={`text-2xl font-black tracking-widest block ${submittedId.startsWith("SOS") ? "text-red-600" : "text-indigo-600"}`}
            >
              {submittedId}
            </code>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(submittedId);
              alert("Код хуулагдлаа!");
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest mb-3"
          >
            📋 Код хуулах
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest"
          >
            Хаах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 font-sans text-slate-900">
      <div className="max-w-xl mx-auto space-y-6 pb-20">
        {/* ХАРИУ ШАЛГАХ */}
        <div className="bg-indigo-900 rounded-[2.5rem] p-7 text-white shadow-2xl">
          <h2 className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] opacity-60">
            Нууц кодоор хариу шалгах
          </h2>
          <div className="flex gap-2">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="ID-ABCDE"
              className="flex-1 p-4 rounded-2xl bg-white/10 border-none text-white text-sm outline-none placeholder:text-white/30"
            />
            <button
              onClick={handleSearch}
              className="bg-white text-indigo-900 px-6 py-4 rounded-2xl font-black text-[10px] uppercase active:scale-95 transition-transform"
            >
              ШАЛГАХ
            </button>
          </div>
          {searchResult && (
            <div className="mt-8 bg-white p-6 rounded-[2rem] text-slate-900 animate-in slide-in-from-top-4 duration-500">
              <span
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase mb-4 inline-block ${searchResult.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
              >
                {searchResult.status || "Хүлээгдэж буй"}
              </span>
              <p className="text-sm font-bold italic text-slate-700">
                {searchResult.adminReply ||
                  "Багш хараахан хариу бичээгүй байна."}
              </p>
              <button
                onClick={() => setSearchResult(null)}
                className="mt-4 text-[9px] font-black text-slate-300 uppercase block"
              >
                × Хаах
              </button>
            </div>
          )}
        </div>

        <div className="text-center py-6">
          <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
            Сэтгэл <span className="text-indigo-600 underline">зүй</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Тусламж хүсэх анкет
          </p>
        </div>

        {/* АСУУЛГУУД */}
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
            >
              <h3 className="text-sm font-black text-slate-800 mb-5 leading-tight">
                {q.question}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                    className={`p-4 rounded-2xl text-xs font-black transition-all border-2 text-left flex justify-between items-center ${answers[q.id] === opt ? (opt.includes("🚨") ? "border-red-500 bg-red-50 text-red-900" : "border-indigo-600 bg-indigo-50 text-indigo-900") : "border-slate-50 text-slate-500 hover:border-indigo-100"}`}
                  >
                    {opt}
                    {answers[q.id] === opt && (
                      <span
                        className={
                          opt.includes("🚨")
                            ? "text-red-600"
                            : "text-indigo-600"
                        }
                      >
                        ●
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 p-5 bg-slate-50 rounded-[1.5rem] border-none outline-none text-sm font-bold resize-none focus:ring-2 ring-indigo-50"
            placeholder="Нэмэлт тайлбар (заавал биш)..."
          />
          <div className="space-y-4">
            <p className="text-[9px] font-black text-slate-400 uppercase ml-2">
              Зураг хавсаргах (заавал биш)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-[10px] text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-slate-900 file:text-white file:font-black cursor-pointer"
            />
            {preview && (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "ИЛГЭЭЖ БАЙНА..." : "ХҮСЭЛТ ИЛГЭЭХ"}
        </button>
      </div>
    </div>
  );
}
