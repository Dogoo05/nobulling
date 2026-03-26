import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const questions = [
  { id: 1, question: "1. Дээрэлхэлтийн хэлбэр:" },
  { id: 2, question: "2. Анх хэзээ тохиолдсон бэ?" },
  { id: 3, question: "3. Давтамж ба хугацаа:" },
  { id: 4, question: "4. Хаана болдог вэ?" },
  { id: 5, question: "5. Хэн дарамт үзүүлдэг вэ?" },
  { id: 6, question: "6. Хүнд хэлж байсан уу?" },
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) {
        const sortedData = (d.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setData(sortedData);
      }
    } catch (err) {
      alert("Сервертэй холбогдож чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

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
    if (!confirm("Устгах уу?")) return;
    const res = await fetch(`/api/huselt?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  const filteredData = data.filter((item) => {
    const matchStatus = filterStatus === "Бүгд" || item.status === filterStatus;
    const matchType =
      filterType === "Бүгд" ||
      (item.answers && item.answers[1]?.includes(filterType));
    return matchStatus && matchType;
  });

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans p-6">
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
          <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
          <input
            type="password"
            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none mb-4 text-center font-black transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
          <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            НЭВТРЭХ
          </button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
              Dashboard <span className="text-indigo-600">Manager</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
              Нийт хүсэлтийн удирдлага
            </p>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase hover:bg-red-100 transition-all"
          >
            Гарах
          </button>
        </header>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Хүсэлтийн төлөв:
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
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
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

        {/* Table */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  ID КОД
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
              {filteredData.map((item) => (
                <tr
                  key={item.customId}
                  onClick={() => {
                    setSelectedItem(item);
                    setReply(item.adminReply || "");
                  }}
                  className="hover:bg-slate-50/80 cursor-pointer transition-all group"
                >
                  <td className="p-7">
                    <span className="font-black text-slate-700 block tracking-widest">
                      {item.customId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-7">
                    {item.answers?.[1] === "ЯАРАЛТАЙ ТУСЛАМЖ" ? (
                      <span className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-red-100 animate-pulse">
                        🚨 ЯАРАЛТАЙ
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-500 uppercase">
                        {item.answers?.[1] || "Тодорхойгүй"}
                      </span>
                    )}
                  </td>
                  <td className="p-7 text-center">
                    <span
                      className={`px-4 py-2 rounded-full text-[9px] font-black uppercase ${item.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-7 text-right">
                    <button
                      onClick={(e) => handleDelete(e, item.customId)}
                      className="w-10 h-10 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View */}
      {/* Modal View */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <header className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
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

            <div className="overflow-y-auto flex-1 p-8 space-y-8">
              {/* ХЭРЭГЛЭГЧИЙН БИЧСЭН ТАЙЛБАР (description) */}
              {selectedItem.description ? (
                <div className="p-8 bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-indigo-200 text-6xl font-black opacity-20 italic select-none pointer-events-none">
                    MESSAGE
                  </div>
                  <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    Дэлгэрэнгүй тайлбар:
                  </h4>
                  <p className="text-lg font-bold text-slate-800 leading-relaxed italic relative z-10">
                    "{selectedItem.description}"
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-[2rem] text-center border border-dashed border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Нэмэлт тайлбар бичээгүй байна
                </div>
              )}

              {/* ХАВСАРГАСАН ЗУРАГ (Хэрэв байгаа бол) */}
              {selectedItem.imageUrl && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                    Хавсаргасан зураг:
                  </h4>
                  <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                    <img
                      src={selectedItem.imageUrl}
                      alt="Evidence"
                      className="w-full h-auto max-h-[500px] object-contain mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Асуулгын хариултууд - Одоо бүх асуулт харагдана */}
              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                  Асуулгын хариултууд:
                </h4>
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
              </div>

              {/* Хариу бичих хэсэг */}
              <div className="pt-10 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center text-slate-400 italic">
                  Шийдвэрлэлт ба Хариу
                </h4>
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-8 bg-green-50 rounded-[2.5rem] border-2 border-green-100 text-center shadow-inner">
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
                      className="w-full h-40 p-7 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-[2.5rem] outline-none font-bold text-sm resize-none transition-all shadow-inner"
                    />
                    <button
                      onClick={() => handleResolve(selectedItem.customId)}
                      disabled={isSubmitting}
                      className={`w-full py-6 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl transition-all flex items-center justify-center gap-2 ${isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"}`}
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
