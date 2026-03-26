import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const questions = [
  {
    id: 1,
    question:
      "Танд тохиолдож буй дээрэлхэлт голчлон ямар хэлбэрээр илэрч байна vэ?",
  },
  {
    id: 2,
    question: "Энэ таагүй нөхцөл байдал анх хэзээ тохиолдож эхэлсэн бэ?",
  },
  {
    id: 3,
    question:
      "Энэ байдал хэр удаан хугацаанд, ямар давтамжтай үргэлжилж байна вэ?",
  },
  { id: 4, question: "Дээрэлхэлт голчлон хаана болдог vэ?" },
  { id: 5, question: "Чамд хэн хамгийн их дарамт үзүүлдэг вэ?" },
  { id: 6, question: "Чи энэ талаар хэн нэгэнд итгэж ярьж байсан уу?" },
  {
    id: 7,
    question:
      "Хэрвээ хэн нэгэнд хэлж байсан бол тэдний хандлага ямар байсан бэ?",
  },
  { id: 8, question: "Энэ зүйл чиний сэтгэл санаанд яаж нөлөөлж байна?" },
  {
    id: 9,
    question:
      "Танд энэ нөхцөл байдлаас гарахад юу хамгийн их тус болно гэж бодож байна?",
  },
  {
    id: 10,
    question: "Яг одоо таны хувьд юу хамгийн чухал хэрэгцээ байна вэ?",
  },
];

export default function Manager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [replyText, setReplyText] = useState({});
  const [filterStatus, setFilterStatus] = useState("Бүгд");
  const [filterCategory, setFilterCategory] = useState("Бүгд");
  const router = useRouter();

  const categories = [
    "Бүгд",
    "🗣️ Үг хэлээр",
    "👊 Бие махбодиор",
    "📱 Цахимаар",
  ];

  // --- ДАТА ТАТАХ ФУНКЦ ---
  const fetchData = async () => {
    setLoading(true); // Татаж эхлэхэд loading true
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();

      if (d.success) {
        setData(d.data || []);
      } else {
        alert("Дата татахад алдаа гарлаа: " + d.message);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Сервертэй холбогдож чадсангүй.");
    } finally {
      // Амжилттай болсон ч, алдаа гарсан ч Loading-ийг зогсооно
      setLoading(false);
    }
  };

  // --- ШИНЭ: Нэвтэрсэн үед датаг автоматаар татах useEffect ---
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
      // fetchData() энд дуудахаас гадна useEffect хянах нь илүү найдвартай
    } else {
      alert("Нууц үг буруу байна!");
    }
  };

  const handleResolve = async (customId) => {
    if (!replyText[customId]) return alert("Хариу бичнэ үү.");
    const res = await fetch("/api/huselt", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: customId,
        status: "Шийдвэрлэсэн",
        adminReply: replyText[customId],
      }),
    });
    if (res.ok) fetchData();
  };

  const handleDelete = async (customId) => {
    if (!confirm("Энэ хүсэлтийг бүрмөсөн устгах уу?")) return;
    const res = await fetch(`/api/huselt?id=${customId}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  const filteredData = data.filter((item) => {
    const matchStatus = filterStatus === "Бүгд" || item.status === filterStatus;
    const userAns = item.answers?.[1] || "";
    let matchCategory = false;

    if (filterCategory === "Бүгд") {
      matchCategory = true;
    } else if (filterCategory === "🗣️ Үг хэлээр") {
      matchCategory = userAns.includes("Үг хэлээр") || userAns.includes("Бүгд");
    } else if (filterCategory === "👊 Бие махбодиор") {
      matchCategory =
        userAns.includes("Бие махбодиор") || userAns.includes("Бүгд");
    } else if (filterCategory === "📱 Цахимаар") {
      matchCategory = userAns.includes("Цахимаар") || userAns.includes("Бүгд");
    }
    return matchStatus && matchCategory;
  });

  const stats = {
    total: data.length,
    resolved: data.filter((i) => i.status === "Шийдвэрлэсэн").length,
    pending: data.filter((i) => i.status !== "Шийдвэрлэсэн").length,
  };

  // --- НЭВТРЭХ ХЭСЭГ ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 text-slate-900">
        <form
          onSubmit={handleLogin}
          className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-md w-full border border-slate-100 text-center"
        >
          <h1 className="text-2xl font-black mb-10 italic uppercase">
            Admin Login
          </h1>
          <input
            type="password"
            className="w-full p-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none mb-6 text-center text-2xl font-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-indigo-700 transition-all"
          >
            НЭВТРЭХ
          </button>
        </form>
      </div>
    );
  }

  // --- LOADING ХЭСЭГ ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">
          Уншиж байна...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter uppercase">
            Manager <span className="text-indigo-600">Pro</span>
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              Нүүр хуудас
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-[10px] font-black text-red-500 uppercase tracking-widest px-4 py-2 bg-red-50 rounded-xl transition-all"
            >
              Гарах
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            label="Нийт хүсэлт"
            value={stats.total}
            color="bg-indigo-600"
          />
          <StatCard
            label="Шийдвэрлэсэн"
            value={stats.resolved}
            color="bg-green-500"
          />
          <StatCard
            label="Хүлээгдэж буй"
            value={stats.pending}
            color="bg-orange-500"
          />
        </div>

        {/* Шүүлтүүр */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm mb-12 space-y-8">
          <div className="flex flex-wrap gap-3">
            {["Бүгд", "Хүлээгдэж буй", "Шийдвэрлэсэн"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filterStatus === s ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-50 text-slate-400"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filterCategory === c ? "bg-indigo-900 text-white shadow-lg" : "bg-slate-50 text-slate-400"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.customId}
                className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                      {item.username?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-xl">{item.username}</h3>
                      <p className="text-[10px] text-indigo-500 uppercase font-bold">
                        ID: {item.customId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${item.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={() => handleDelete(item.customId)}
                      className="p-2 text-red-200 hover:text-red-500"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-10 grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-4">
                    <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-200 uppercase">
                          Зураггүй
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {questions.map((q) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100"
                        >
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                            {q.question}
                          </p>
                          <p className="text-xs font-black text-slate-800">
                            {item.answers?.[q.id] || "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t">
                      {item.status === "Шийдвэрлэсэн" ? (
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                          <p className="text-sm font-black text-green-900 italic">
                            "{item.adminReply}"
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <textarea
                            onChange={(e) =>
                              setReplyText({
                                ...replyText,
                                [item.customId]: e.target.value,
                              })
                            }
                            className="flex-1 bg-white p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 font-bold text-sm"
                            placeholder="Зөвлөгөө..."
                          />
                          <button
                            onClick={() => handleResolve(item.customId)}
                            className="bg-indigo-600 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest"
                          >
                            Илгээх
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase text-xs">
                Мэдээлэл олдсонгүй
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
          {label}
        </p>
        <p className="text-3xl font-black">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl ${color} opacity-10`}></div>
    </div>
  );
}
