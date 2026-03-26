import { useState } from "react";

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

    // --- СУПЕР ID ҮҮСГЭХ ЛОГИК (Огноо + Давтагдахгүй 4 үсэг) ---
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${day}`;

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let tempChars = alphabet.split("");
    let randomLetters = "";

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * tempChars.length);
      randomLetters += tempChars[randomIndex];
      tempChars.splice(randomIndex, 1); // Сонгосон үсгийг устгаж дахин давтагдахгүй болгоно
    }

    const customId = `${dateStr}-${randomLetters}`; // Жишээ: 20241027-RGTM
    // -------------------------------------------------------

    try {
      let img = file ? await convertToBase64(file) : "";
      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customId: customId,
          username: "Anonymous",
          answers,
          description,
          imageUrl: img,
        }),
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
    if (!searchId) return alert("ID-гаа оруулна уу.");

    // Том жижиг үсэг зөрөхөөс сэргийлж toUpperCase() нэмье
    const cleanId = searchId.trim().toUpperCase();

    const res = await fetch(`/api/huselt?id=${cleanId}`);
    const data = await res.json();

    if (data.success && data.data) {
      setSearchResult(data.data);
    } else {
      alert("Хүсэлт олдсонгүй. ID-гаа зөв эсэхийг шалгана уу.");
      setSearchResult(null);
    }
  };

  if (submittedId)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center max-w-lg w-full border border-indigo-50">
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100 animate-bounce">
            <span className="text-white text-4xl">✓</span>
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-900">
            Амжилттай илгээгдлээ!
          </h2>
          <p className="text-slate-500 font-bold mb-8">
            Доорх ID кодыг хадгалж аваад хариугаа шалгаарай.
          </p>
          <div className="bg-indigo-50/50 p-6 rounded-3xl border-2 border-dashed border-indigo-200 mb-8">
            <code className="text-2xl font-black text-indigo-600 break-all tracking-wider">
              {submittedId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(submittedId);
                alert("Хуулагдлаа!");
              }}
              className="block mx-auto mt-4 text-[10px] font-black bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              КОД ХУУЛАХ
            </button>
          </div>
          <button
            onClick={() => setSubmittedId("")}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all"
          >
            ОЙЛГОЛОО
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Хариу шалгах хэсэг */}
        <div className="bg-indigo-900 rounded-[3rem] p-8 text-white shadow-2xl shadow-indigo-200">
          <h2 className="text-xl font-black mb-4 uppercase tracking-widest">
            Хариу шалгах
          </h2>
          <div className="flex gap-2">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="ID оруулна уу..."
              className="flex-1 p-4 rounded-2xl bg-white/10 border-none text-white placeholder:text-white/30 font-bold outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              onClick={handleSearch}
              className="bg-white text-indigo-900 px-6 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-colors"
            >
              ШАЛГАХ
            </button>
          </div>
          {searchResult && (
            <div className="mt-6 p-6 bg-white rounded-3xl text-slate-900 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-400">
                  Төлөв:
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-black ${searchResult.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                >
                  {searchResult.status}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic font-bold text-slate-700">
                {searchResult.adminReply ||
                  "Багш хараахан хариу ирүүлээгүй байна."}
              </div>
              <button
                onClick={() => setSearchResult(null)}
                className="w-full mt-4 text-[10px] font-black text-slate-300"
              >
                ХААХ
              </button>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-black text-center text-slate-900 italic">
          СЭТГЭЛ <span className="text-indigo-600">ЗҮЙ</span>
        </h1>

        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
          >
            <h3 className="text-lg font-black text-slate-800 mb-6">
              {q.question}
            </h3>
            <div className="grid gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                  className={`p-4 rounded-2xl text-left font-bold transition-all border-2 ${answers[q.id] === opt ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-50 text-slate-500 hover:border-indigo-100"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
          <h3 className="text-lg font-black mb-4 text-slate-800">
            Дэлгэрэнгүй тайлбар
          </h3>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-40 p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-medium resize-none"
            placeholder="Бичээрэй..."
          ></textarea>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
            accept="image/*"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block p-10 border-4 border-dashed border-slate-50 rounded-3xl hover:bg-slate-50 transition-all font-black text-slate-400 uppercase tracking-widest"
          >
            {file ? file.name : "Зураг хавсаргах"}
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? "УНШИЖ БАЙНА..." : "ИЛГЭЭХ"}
        </button>
      </div>
    </div>
  );
}
