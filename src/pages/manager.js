import { useEffect, useState, useCallback } from "react";

const types = [
  "Бүгд",
  "ЯАРАЛТАЙ ТУСЛАМЖ",
  "Үг хэлээр",
  "Бие махбодиор",
  "Цахимаар",
];

export default function Manager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Бүгд");
  const [filterType, setFilterType] = useState("Бүгд");
  const [selectedItem, setSelectedItem] = useState(null);
  const [reply, setReply] = useState("");

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) setData(d.data);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData(true);
      const interval = setInterval(() => fetchData(false), 30000); // 30 сек тутамд шинэчилнэ
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, fetchData]);

  // SOS Мэдэгдэл тоолох
  const urgentCount = data.filter(
    (i) =>
      (i.isUrgent || i.customId?.startsWith("SOS")) &&
      i.status === "Хүлээгдэж буй",
  ).length;

  // Хөтчийн гарчиг анивчуулах
  useEffect(() => {
    if (urgentCount > 0) {
      const interval = setInterval(() => {
        document.title =
          document.title === "🚨 SOS !!!" ? "ШИНЭ ХҮСЭЛТ" : "🚨 SOS !!!";
      }, 1000);
      return () => {
        document.title = "Manager Panel";
        clearInterval(interval);
      };
    }
  }, [urgentCount]);

  const handleResolve = async (id) => {
    if (!reply) return alert("Хариу бичнэ үү.");
    const res = await fetch("/api/huselt", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "Шийдвэрлэсэн", adminReply: reply }),
    });
    if (res.ok) {
      alert("Амжилттай илгээлээ! ✅");
      setSelectedItem(null);
      setReply("");
      fetchData(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Энэ хүсэлтийг устгах уу?")) return;
    const res = await fetch(`/api/huselt?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchData(false);
  };

  // Шүүлтүүрийн логик
  const filteredData = data.filter((item) => {
    const matchStatus = filterStatus === "Бүгд" || item.status === filterStatus;
    let matchType = true;
    if (filterType === "ЯАРАЛТАЙ ТУСЛАМЖ") {
      matchType = item.isUrgent || item.customId?.startsWith("SOS");
    } else if (filterType !== "Бүгд") {
      matchType = (item.answers?.[1] || "").includes(filterType);
    }
    return matchStatus && matchType;
  });

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === "admin123") setIsLoggedIn(true);
            else alert("Нууц үг буруу!");
          }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border-4 border-white"
        >
          <h1 className="text-2xl font-black mb-6 text-center italic uppercase tracking-tighter">
            Admin <span className="text-indigo-600">Access</span>
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 p-4 rounded-2xl mb-4 w-full text-center font-bold outline-none focus:border-indigo-600 transition-all"
            placeholder="Нууц үг"
          />
          <button className="bg-indigo-600 text-white p-4 rounded-2xl w-full font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Нэвтрэх
          </button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {urgentCount > 0 && (
        <div className="bg-red-600 text-white p-4 text-center font-black animate-pulse sticky top-0 z-[100] shadow-xl">
          🚨 ЯАРАЛТАЙ {urgentCount} ХҮСЭЛТ ШИЙДВЭРЛЭХИЙГ ХҮЛЭЭЖ БАЙНА!
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            Dashboard <span className="text-indigo-600">Manager</span>
          </h1>
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border">
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 rounded-xl border-none bg-slate-50 text-[10px] font-black uppercase outline-none cursor-pointer"
            >
              <option value="Бүгд">Бүх төлөв</option>
              <option value="Хүлээгдэж буй">Хүлээгдэж буй</option>
              <option value="Шийдвэрлэсэн">Шийдвэрлэсэн</option>
            </select>
            <select
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 rounded-xl border-none bg-slate-50 text-[10px] font-black uppercase outline-none cursor-pointer"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  ID & Огноо
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Төлөв
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-20 text-center font-black text-slate-300 animate-pulse uppercase"
                  >
                    Уншиж байна...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-20 text-center font-black text-slate-300 uppercase italic"
                  >
                    Мэдээлэл олдсонгүй
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.customId}
                    onClick={() => setSelectedItem(item)}
                    className={`hover:bg-indigo-50/30 cursor-pointer transition-all ${item.isUrgent && item.status === "Хүлээгдэж буй" ? "bg-red-50/50" : ""}`}
                  >
                    <td className="p-6">
                      <div className="font-black text-sm flex items-center gap-2">
                        {item.isUrgent && (
                          <span className="text-red-500 animate-bounce">
                            🚨
                          </span>
                        )}
                        {item.customId}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={(e) => handleDelete(e, item.customId)}
                        className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                Дэлгэрэнгүй <span className="text-indigo-600">мэдээлэл</span>
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 italic font-bold text-slate-600">
                "{selectedItem.description || "Тайлбар байхгүй"}"
              </div>

              {selectedItem.imageUrl && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Хавсаргасан зураг:
                  </p>
                  <img
                    src={selectedItem.imageUrl}
                    className="w-full rounded-[2rem] shadow-lg border-4 border-white"
                    alt="Evidence"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(selectedItem.answers || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50"
                    >
                      <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">
                        Асуулт {key}:
                      </p>
                      <p className="text-[11px] font-black text-indigo-900 uppercase leading-tight">
                        {value}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <div className="pt-8 border-t">
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-6 bg-green-50 rounded-[2rem] border-2 border-green-100 text-green-800 font-bold italic">
                    <p className="text-[10px] font-black uppercase text-green-600 mb-2 not-italic">
                      Бичсэн хариу:
                    </p>
                    "{selectedItem.adminReply}"
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Энд хариу болон зөвлөгөө бичнэ үү..."
                      className="w-full h-40 p-6 bg-slate-50 rounded-[2rem] border-2 focus:border-indigo-600 outline-none font-bold transition-all placeholder:text-slate-300"
                    />
                    <button
                      onClick={() => handleResolve(selectedItem.customId)}
                      className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      Хариу илгээх
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
