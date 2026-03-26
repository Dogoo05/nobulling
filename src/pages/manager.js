import { useEffect, useState } from "react";

const questions = [
  { id: 1, question: "1. Дээрэлхэлтийн хэлбэр:" },
  { id: 2, question: "2. Анх хэзээ тохиолдсон бэ?" },
  { id: 3, question: "3. Давтамж ба хугацаа:" },
  { id: 4, question: "4. Хаана болдог vэ?" },
  { id: 5, question: "5. Хэн дарамт vзvvлдэг вэ?" },
  { id: 6, question: "6. Хvнд хэлж байсан уу?" },
  { id: 7, question: "7. Тэдний хандлага:" },
  { id: 8, question: "8. Сэтгэл санааны нөлөө:" },
  { id: 9, question: "9. Юу тус болох вэ?" },
  { id: 10, question: "10. Одоогийн хэрэгцээ:" },
];

const types = [
  "Бүгд",
  "ЯАРАЛТАЙ ТУСЛАМЖ",
  "Үг хэлээр",
  "Бие махбодиор",
  "Цахимаар",
];

export default function Manager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Бүгд");
  const [filterType, setFilterType] = useState("Бүгд");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reply, setReply] = useState("");

  // --- ДАТА ТАТАХ ФУНКЦ ---
  const fetchData = async () => {
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();

      if (d.success) {
        // Шинэ дата хамгийн дээрээ байхаар эрэмбэлэх
        const sortedData = (d.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setData(sortedData);
      }
    } catch (err) {
      console.error("Дата татахад алдаа гарлаа:", err);
    }
  };

  // Нэвтэрсэн үед 20 секунд тутам датаг шинэчлэх
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      const interval = setInterval(fetchData, 20000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // --- SOS МЭДЭГДЭЛ ---
  const urgentCount = data.filter(
    (item) =>
      (item.customId?.startsWith("SOS") ||
        item.answers?.[1]?.includes("ЯАРАЛТАЙ")) &&
      item.status === "Хүлээгдэж буй",
  ).length;

  useEffect(() => {
    if (urgentCount > 0) {
      const originalTitle = document.title;
      const interval = setInterval(() => {
        document.title =
          document.title === "🚨 SOS !!!" ? "ШИНЭ ХҮСЭЛТ" : "🚨 SOS !!!";
      }, 1500);
      return () => {
        document.title = originalTitle;
        clearInterval(interval);
      };
    }
  }, [urgentCount]);

  // --- ҮЙЛДЛҮҮД ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") setIsLoggedIn(true);
    else alert("Нууц үг буруу!");
  };

  const handleResolve = async (id) => {
    if (!reply) return alert("Хариу бичнэ үү.");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/huselt", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Шийдвэрлэсэн", adminReply: reply }),
      });
      if (res.ok) {
        alert("Амжилттай илгээгдлээ! ✅");
        fetchData();
        setSelectedItem(null);
        setReply("");
      }
    } catch (err) {
      alert("Алдаа гарлаа.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Энэ хүсэлтийг устгахдаа итгэлтэй байна уу?")) return;
    try {
      const res = await fetch(`/api/huselt?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        if (selectedItem?.customId === id) setSelectedItem(null);
      }
    } catch (err) {
      alert("Устгахад алдаа гарлаа.");
    }
  };

  // --- ШҮҮЛТҮҮР (FILTER) ---
  const filteredData = data.filter((item) => {
    const matchStatus = filterStatus === "Бүгд" || item.status === filterStatus;
    const itemType = item.answers?.[1] || item.answers?.["1"] || "";

    let matchType = true;
    if (filterType !== "Бүгд") {
      matchType = itemType.includes(filterType);
    }

    return matchStatus && matchType;
  });

  // --- LOGIN UI ---
  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans p-6 text-slate-900">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full border border-slate-200 text-center"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-2xl font-black mb-2 text-slate-800 tracking-tight uppercase">
            Admin Panel
          </h1>
          <input
            type="password"
            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none mb-4 text-center font-black transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
          <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs">
            НЭВТРЭХ
          </button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* SOS BAR */}
      {urgentCount > 0 && (
        <div className="sticky top-0 z-[110] bg-red-600 text-white p-4 shadow-2xl flex items-center justify-between border-b-4 border-red-800">
          <div className="flex items-center gap-4 ml-4">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>
            <h2 className="font-black text-lg leading-none uppercase tracking-tighter">
              ЯАРАЛТАЙ ТУСЛАМЖИЙН {urgentCount} ХҮСЭЛТ ИРЛЭЭ!
            </h2>
          </div>
          <button
            onClick={() => {
              setFilterType("ЯАРАЛТАЙ");
              setFilterStatus("Хүлээгдэж буй");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-white text-red-600 px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-red-50 transition-colors mr-4"
          >
            ОДОО ШАЛГАХ
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 sm:p-10">
        <header className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
              Dashboard <span className="text-indigo-600">Manager</span>
            </h1>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase hover:bg-red-100 transition-all"
          >
            Гарах
          </button>
        </header>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Төлөв:
            </label>
            <div className="flex gap-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
              {["Бүгд", "Хүлээгдэж буй", "Шийдвэрлэсэн"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`flex-1 px-4 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${filterStatus === s ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:text-indigo-600"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Ангилал:
            </label>
            <button
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className="w-full bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center text-[10px] font-black uppercase text-slate-700 hover:border-indigo-200"
            >
              {filterType} <span>▼</span>
            </button>
            {isTypeOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[60] overflow-hidden">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setFilterType(t);
                      setIsTypeOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase transition-colors hover:bg-indigo-50 ${filterType === t ? "text-indigo-600 bg-indigo-50/50" : "text-slate-500"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  ID КОД & ОГНОО
                </th>
                <th className="p-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  АНГИЛАЛ
                </th>
                <th className="p-7 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  ТӨЛӨВ
                </th>
                <th className="p-7 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  ҮЙЛДЭЛ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => {
                // Огноо форматлах
                const formatDate = (dateString) => {
                  if (!dateString) return "---";
                  const d = new Date(dateString);
                  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                };

                // SOS мөн эсэхийг шалгах (ID нь SOS-оор эхэлсэн эсвэл хариулт нь Яаралтай бол)
                const isUrgent =
                  item.customId?.startsWith("SOS") ||
                  item.answers?.[1]?.includes("ЯАРАЛТАЙ") ||
                  item.answers?.["1"]?.includes("ЯАРАЛТАЙ");

                return (
                  <tr
                    key={item._id} // MongoDB-ийн үл давтагдах ID-г энд ашиглана
                    onClick={() => {
                      setSelectedItem(item);
                      setReply(item.adminReply || "");
                    }}
                    className={`transition-all group cursor-pointer ${
                      isUrgent && item.status === "Хүлээгдэж буй"
                        ? "bg-red-50/60 hover:bg-red-100 border-l-4 border-red-500"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="p-7">
                      <div className="flex flex-col gap-1">
                        {/* ЭНД: item.customId-г харуулж байгаа эсэхийг шалгаарай */}
                        <span
                          className={`font-black tracking-widest text-sm ${isUrgent ? "text-red-600" : "text-slate-700"}`}
                        >
                          {item.customId || "ID АЛДАА"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
                          <span>🗓️</span>
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="p-7">
                      {isUrgent ? (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase shadow-sm animate-pulse inline-block">
                          🚨 SOS ЯАРАЛТАЙ
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded-md">
                          {item.answers?.[1] || item.answers?.["1"] || "Ердийн"}
                        </span>
                      )}
                    </td>
                    <td className="p-7 text-center">
                      <span
                        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase ${
                          item.status === "Шийдвэрлэсэн"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {item.status || "Хүлээгдэж буй"}
                      </span>
                    </td>
                    <td className="p-7 text-right">
                      <button
                        onClick={(e) => handleDelete(e, item.customId)} // Устгахдаа customId-г дамжуулна
                        className="w-10 h-10 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center ml-auto"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (DETAIL VIEW) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <header className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10 text-slate-900">
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-800">
                  Хүсэлтийн <span className="text-indigo-600">Дэлгэрэнгүй</span>
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  ID: {selectedItem.customId}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 font-bold text-xl transition-all"
              >
                ✕
              </button>
            </header>

            <div className="overflow-y-auto flex-1 p-8 space-y-8 text-slate-900">
              {/* DESCRIPTION & IMAGE */}
              <div className="p-8 bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem]">
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">
                  Дэлгэрэнгүй тайлбар:
                </h4>
                <p className="text-lg font-bold text-slate-800 leading-relaxed italic">
                  "{selectedItem.description || "Тайлбар байхгүй"}"
                </p>
              </div>

              {selectedItem.imageUrl && (
                <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                  <img
                    src={selectedItem.imageUrl}
                    alt="Evidence"
                    className="w-full h-auto max-h-[500px] object-contain mx-auto cursor-zoom-in"
                    onClick={() => window.open(selectedItem.imageUrl, "_blank")}
                  />
                </div>
              )}

              {/* QUESTIONS & ANSWERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1"
                  >
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
                      {q.question}
                    </p>
                    <p className="text-xs font-black text-indigo-600 uppercase">
                      {selectedItem.answers?.[q.id] || "—"}
                    </p>
                  </div>
                ))}
              </div>

              {/* REPLY SECTION */}
              <div className="pt-10 border-t border-slate-100 pb-10">
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-8 bg-green-50 rounded-[2.5rem] border-2 border-green-100 text-center">
                    <p className="text-[9px] font-black text-green-500 uppercase mb-3">
                      Илгээсэн хариу:
                    </p>
                    <p className="text-md font-black text-green-900 italic">
                      "{selectedItem.adminReply}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Зөвлөгөө эсвэл хариуг энд бичнэ үү..."
                      className="w-full h-40 p-7 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-[2.5rem] outline-none font-bold text-sm resize-none shadow-inner"
                    />
                    <button
                      onClick={() => handleResolve(selectedItem.customId)}
                      disabled={isSubmitting}
                      className="w-full py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                      {isSubmitting ? "ТҮР ХҮЛЭЭНЭ ҮҮ..." : "ХАРИУ ИЛГЭЭХ"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
