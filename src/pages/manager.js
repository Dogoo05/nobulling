import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Асуултуудын жагсаалт
const questions = [
  {
    id: 1,
    question:
      "1. Танд тохиолдож буй дээрэлхэлт голчлон ямар хэлбэрээр илэрч байна вэ?",
  },
  {
    id: 2,
    question: "2. Энэ таагүй нөхцөл байдал анх хэзээ тохиолдож эхэлсэн бэ?",
  },
  {
    id: 3,
    question:
      "3. Энэ байдал хэр удаан хугацаанд, ямар давтамжтай үргэлжилж байна вэ?",
  },
  { id: 4, question: "4. Дээрэлхэлт голчлон хаана болдог vэ?" },
  { id: 5, question: "5. Чамд хэн хамгийн их дарамт үзүүлдэг вэ?" },
  { id: 6, question: "6. Чи энэ талаар хэн нэгэнд итгэж ярьж байсан уу?" },
  { id: 7, question: "7. Тэдний хандлага ямар байсан бэ?" },
  { id: 8, question: "8. Энэ зүйл чиний сэтгэл санаанд яаж нөлөөлж байна?" },
  {
    id: 9,
    question:
      "9. Танд энэ нөхцөл байдлаас гарахад юу хамгийн их тус болно гэж бодож байна?",
  },
  {
    id: 10,
    question: "10. Яг одоо таны хувьд юу хамгийн чухал хэрэгцээ байна вэ?",
  },
];

const types = ["Бүгд", "Үг хэлээр", "Бие махбодиор", "Цахимаар"];

export default function Manager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Илгээж буй төлөв
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

    setIsSubmitting(true); // Уншиж эхэллээ
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
      } else {
        alert("Алдаа гарлаа.");
      }
    } catch (err) {
      alert("Сервертэй холбогдож чадсангүй.");
    } finally {
      setIsSubmitting(false); // Уншиж дууслаа
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
      (item.answers && item.answers[1] && item.answers[1].includes(filterType));
    return matchStatus && matchType;
  });

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-sm w-full border border-slate-100 text-center"
        >
          <h1 className="text-xl font-black mb-6 italic uppercase tracking-widest text-slate-800">
            Admin Access
          </h1>
          <input
            type="password"
            autoFocus
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none mb-4 text-center font-bold transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
            НЭВТРЭХ
          </button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter">
            Manager{" "}
            <span className="text-indigo-600 font-black">Dashboard</span>
          </h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase hover:bg-red-100 transition-colors"
          >
            Гарах
          </button>
        </header>

        {/* Шүүлтүүрүүд */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
              Төлөв:
            </span>
            <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-full">
              {["Бүгд", "Хүлээгдэж буй", "Шийдвэрлэсэн"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`flex-1 px-2 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${filterStatus === s ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-400 hover:text-indigo-600"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
              Төрөл:
            </span>
            <div className="relative w-full">
              <button
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="w-full bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center text-[10px] font-black uppercase text-slate-700 hover:border-indigo-200 transition-all"
              >
                {filterType}
                <span
                  className={`transition-transform duration-200 ${isTypeOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {isTypeOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setFilterType(t);
                        setIsTypeOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase transition-colors hover:bg-indigo-50 ${filterType === t ? "text-indigo-600 bg-indigo-50/50" : "text-slate-500"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Дата жагсаалт */}
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-indigo-100">
              Илэрц: {filteredData.length}
            </span>
          </div>

          <table className="w-full text-left border-collapse hidden sm:table text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  ID код
                </th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Төлөв
                </th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Огноо
                </th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr
                      key={i}
                      className="animate-pulse border-b border-slate-50"
                    >
                      <td className="p-5">
                        <div className="h-4 bg-slate-100 rounded w-24"></div>
                      </td>
                      <td className="p-5">
                        <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                      </td>
                      <td className="p-5">
                        <div className="h-4 bg-slate-100 rounded w-16"></div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="h-4 bg-slate-100 rounded w-6 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                : filteredData.map((item) => (
                    <tr
                      key={item.customId}
                      onClick={() => {
                        setSelectedItem(item);
                        setReply(item.adminReply || "");
                      }}
                      className="border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="p-5 font-black text-slate-700">
                        {item.customId}
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-5 text-xs text-slate-400 font-bold">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={(e) => handleDelete(e, item.customId)}
                          className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="block sm:hidden divide-y divide-slate-50">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="p-5 animate-pulse space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                  </div>
                ))
              : filteredData.map((item) => (
                  <div
                    key={item.customId}
                    onClick={() => {
                      setSelectedItem(item);
                      setReply(item.adminReply || "");
                    }}
                    className="p-5 active:bg-slate-50 transition-colors flex justify-between items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <p className="font-black text-slate-700">
                          {item.customId}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${item.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                        >
                          {item.status === "Шийдвэрлэсэн" ? "ОК" : "..."}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, item.customId)}
                      className="p-3 bg-red-50 text-red-400 rounded-xl"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-base sm:text-lg font-black italic uppercase">
                ID:{" "}
                <span className="text-indigo-600">{selectedItem.customId}</span>
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors font-bold text-slate-400 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pb-10">
              <div className="w-full bg-slate-50 border-b border-slate-100">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    className="w-full h-auto max-h-[300px] sm:max-h-[450px] object-contain mx-auto"
                    alt="Attached"
                  />
                ) : (
                  <div className="py-16 text-center opacity-20">
                    <span className="text-4xl block mb-2 font-black uppercase">
                      🖼️
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Зураггүй
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                    Асуулгын хариултууд
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {questions.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-1"
                      >
                        <p className="text-[10px] font-bold text-slate-400">
                          {q.question}
                        </p>
                        <p className="text-xs font-black text-indigo-600 uppercase">
                          {selectedItem.answers?.[q.id] || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">
                    Шийдвэрлэлт
                  </h4>
                  {selectedItem.status === "Шийдвэрлэсэн" ? (
                    <div className="p-6 bg-green-50 rounded-3xl border border-green-100 text-center">
                      <p className="text-sm font-black text-green-800 italic">
                        {selectedItem.adminReply}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Зөвлөгөө эсвэл хариуг энд бичнэ үү..."
                        className="w-full h-32 p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none font-bold text-sm resize-none"
                      />
                      <button
                        onClick={() => handleResolve(selectedItem.customId)}
                        disabled={isSubmitting}
                        className={`w-full py-5 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"}`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin text-lg">⏳</span>
                            Илгээж байна...
                          </>
                        ) : (
                          "ХАРИУ ИЛГЭЭХ"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}