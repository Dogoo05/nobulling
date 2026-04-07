import { useEffect, useState, useCallback, useMemo } from "react";

const QUESTION_MAP = {
  1: "Төрөл",
  2: "Байршил",
  3: "Хүндрэл",
  4: "Давтамж",
  5: "Хэн",
  6: "Ярьсан",
  7: "Хандлага",
  8: "Сэтгэл санаа",
  9: "Тусламж",
  10: "Хэрэгцээ",
};

export default function Manager() {
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Шүүлтүүрийн state-үүд
  const [statusFilter, setStatusFilter] = useState("Бүгд");
  const [typeFilter, setTypeFilter] = useState("Бүх төрөл");
  const [severityFilter, setSeverityFilter] = useState("Бүх хүндрэл");

  const showToast = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) setData(d.data || []);
    } catch (err) {
      showToast("Дата татахад алдаа гарлаа", "error");
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn, fetchData]);

  // Сонгох боломжтой төрөл болон хүндрэлийн жагсаалтыг датагаас гаргаж авах
  const allTypes = useMemo(
    () => [
      "Бүх төрөл",
      ...new Set(data.map((item) => item.answers?.[1]).filter(Boolean)),
    ],
    [data],
  );
  const allSeverities = useMemo(
    () => [
      "Бүх хүндрэл",
      ...new Set(data.map((item) => item.answers?.[3]).filter(Boolean)),
    ],
    [data],
  );

  const stats = useMemo(
    () => ({
      total: data.length,
      pending: data.filter((item) => item.status !== "Шийдвэрлэсэн").length,
      resolved: data.filter((item) => item.status === "Шийдвэрлэсэн").length,
    }),
    [data],
  );

  // Гурвалсан шүүлтүүрийн логик
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchStatus =
        statusFilter === "Бүгд" ||
        (statusFilter === "Шийдвэрлэсэн"
          ? item.status === "Шийдвэрлэсэн"
          : item.status !== "Шийдвэрлэсэн");
      const matchType =
        typeFilter === "Бүх төрөл" || item.answers?.[1] === typeFilter;
      const matchSeverity =
        severityFilter === "Бүх хүндрэл" ||
        item.answers?.[3] === severityFilter;

      return matchStatus && matchType && matchSeverity;
    });
  }, [data, statusFilter, typeFilter, severityFilter]);

  const handleResolve = async () => {
    if (!reply.trim()) return showToast("Хариу бичнэ үү!", "error");
    setSubmitting(true);
    try {
      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedItem.customId,
          status: "Шийдвэрлэсэн",
          adminReply: reply,
        }),
      });
      if ((await res.json()).success) {
        setData((prev) =>
          prev.map((item) =>
            item.customId === selectedItem.customId
              ? { ...item, status: "Шийдвэрлэсэн", adminReply: reply }
              : item,
          ),
        );
        setSelectedItem(null);
        setReply("");
        showToast("Амжилттай шийдвэрлэлээ!");
      }
    } catch (err) {
      showToast("Алдаа гарлаа", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === "admin123") setIsLoggedIn(true);
            else showToast("Нууц үг буруу", "error");
          }}
          className="bg-white p-10 rounded-[2.5rem] shadow-xl border w-full max-w-sm"
        >
          <h1 className="font-black text-2xl text-center mb-8 italic text-slate-800">
            ADMIN LOGIN
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-2xl mb-4 text-center font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
            placeholder="Нууц үг"
          />
          <button className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black uppercase hover:bg-indigo-600 transition-all">
            Нэвтрэх
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20 px-6 font-sans text-slate-900">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="max-w-[1400px] mx-auto pt-10">
        <header className="mb-10 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
          <div>
            <h1 className="text-3xl font-black italic tracking-tight uppercase text-slate-800">
              Manager Panel
            </h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              Шүүгдсэн илэрц:{" "}
              <span className="text-indigo-500">{filteredData.length}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 items-center">
            {/* ТӨРӨЛ ШҮҮЛТҮҮР */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 text-[10px] font-black uppercase px-3 py-2.5 rounded-lg outline-none text-slate-600 cursor-pointer"
            >
              {allTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* ХҮНДРЭЛ ШҮҮЛТҮҮР */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-indigo-50 text-[10px] font-black uppercase px-3 py-2.5 rounded-lg outline-none text-indigo-600 cursor-pointer"
            >
              {allSeverities.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="w-[1px] h-6 bg-slate-100 mx-1 hidden sm:block"></div>

            {/* ТӨЛӨВ ШҮҮЛТҮҮР */}
            <div className="flex gap-1">
              {["Бүгд", "Хүлээгдэж буй", "Шийдвэрлэсэн"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${statusFilter === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              onClick={fetchData}
              className="ml-2 text-slate-300 hover:text-indigo-500 transition-colors"
            >
              🔄
            </button>
          </div>
        </header>

        {/* СТАТИСТИК */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatBox label="Нийт мэдэгдэл" count={stats.total} color="slate" />
          <StatBox label="Хүлээгдэж буй" count={stats.pending} color="orange" />
          <StatBox label="Шийдвэрлэсэн" count={stats.resolved} color="green" />
        </div>

        {/* ХҮСНЭГТ */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="px-8 py-6">Огноо</th>
                  <th className="px-8 py-6">ID Код</th>
                  <th className="px-8 py-6">Төрөл</th>
                  <th className="px-8 py-6">Хүндрэл</th>
                  <th className="px-8 py-6">Тайлбар</th>
                  <th className="px-8 py-6 text-right">Төлөв</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-all"
                  >
                    <td className="px-8 py-5 text-slate-400 font-bold text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 font-black italic text-xs text-indigo-600 uppercase tracking-tighter">
                      {item.customId}
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-700 text-xs">
                      {item.answers?.[1] || "Бусад"}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full ${item.answers?.[3]?.includes("🚨") ? "bg-red-50 text-red-500 border border-red-100" : "bg-slate-100 text-slate-600"}`}
                      >
                        {item.answers?.[3] || "Тодорхойгүй"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 italic text-xs truncate max-w-[200px]">
                      "{item.description || "..."}"
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === "Шийдвэрлэсэн" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-orange-50 text-orange-600 border border-orange-100 animate-pulse"}`}
                      >
                        {item.status || "Хүлээгдэж буй"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL VIEW */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-5xl max-h-[92vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ЗҮҮН ТАЛ */}
            <div className="md:w-3/5 p-10 md:p-14 overflow-y-auto bg-slate-50/50 border-r border-slate-100 scrollbar-hide">
              <h2 className="text-3xl font-black italic mb-8 text-slate-900 uppercase tracking-tighter">
                {selectedItem.customId}
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(QUESTION_MAP).map(
                  ([num, label]) =>
                    selectedItem.answers?.[num] && (
                      <div
                        key={num}
                        className="bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm"
                      >
                        <p className="text-[9px] font-black text-indigo-400 uppercase mb-2 tracking-widest opacity-60">
                          {label}
                        </p>
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {selectedItem.answers[num]}
                        </p>
                      </div>
                    ),
                )}
              </div>
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white mb-6 relative overflow-hidden">
                <p className="text-[9px] font-black uppercase mb-3 opacity-70">
                  Тайлбар / Агуулга:
                </p>
                <p className="text-sm font-bold italic leading-relaxed">
                  "{selectedItem.description || "Байхгүй."}"
                </p>
                <div className="absolute -right-4 -bottom-4 text-8xl font-black italic opacity-10 select-none">
                  "
                </div>
              </div>
              {selectedItem.imageUrl && (
                <img
                  src={selectedItem.imageUrl}
                  className="w-full rounded-[2.5rem] border-[10px] border-white shadow-xl"
                  alt="attachment"
                />
              )}
            </div>

            {/* БАРУУН ТАЛ */}
            <div className="md:w-2/5 p-10 md:p-14 flex flex-col bg-white">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-800">
                  {selectedItem.status === "Шийдвэрлэсэн"
                    ? "Илгээсэн хариу"
                    : "Хариу илгээх"}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-red-500 font-bold rounded-full transition-all"
                >
                  ✕
                </button>
              </div>

              <textarea
                className={`flex-1 rounded-[2.5rem] p-7 border-2 outline-none font-bold text-xs mb-8 shadow-inner resize-none transition-all ${
                  selectedItem.status === "Шийдвэрлэсэн"
                    ? "bg-slate-100 border-transparent text-slate-500 cursor-not-allowed italic"
                    : "bg-slate-50 border-transparent focus:border-indigo-100"
                }`}
                placeholder={
                  selectedItem.status === "Шийдвэрлэсэн"
                    ? ""
                    : "Зөвлөгөө энд бичнэ үү..."
                }
                value={
                  selectedItem.status === "Шийдвэрлэсэн"
                    ? selectedItem.adminReply
                    : reply
                }
                onChange={(e) => setReply(e.target.value)}
                disabled={selectedItem.status === "Шийдвэрлэсэн"}
              />

              {selectedItem.status !== "Шийдвэрлэсэн" ? (
                <button
                  onClick={handleResolve}
                  disabled={submitting}
                  className="w-full py-5 bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest rounded-[2rem] hover:bg-indigo-600 shadow-xl transition-all disabled:opacity-50"
                >
                  {submitting ? "ИЛГЭЭЖ БАЙНА..." : "ХАРИУ ИЛГЭЭХ"}
                </button>
              ) : (
                <div className="w-full py-5 bg-emerald-50 text-emerald-600 font-black uppercase text-[10px] tracking-widest rounded-2xl text-center border border-emerald-100 italic">
                  Амжилттай шийдвэрлэсэн
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// HELPERS
function StatBox({ label, count, color }) {
  const styles = {
    slate: "border-b-slate-900 text-slate-900",
    orange: "border-b-orange-500 text-orange-500",
    green: "border-b-emerald-500 text-emerald-600",
  };
  return (
    <div
      className={`bg-white p-8 px-10 rounded-[2.5rem] border border-slate-100 border-b-[6px] shadow-sm hover:-translate-y-1.5 transition-all ${styles[color]}`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 opacity-60">
        {label}
      </p>
      <p className="text-4xl font-black italic tracking-tighter leading-none">
        {count}
      </p>
    </div>
  );
}

function Notification({ message, type, onClose }) {
  if (!message) return null;
  const isSuccess = type === "success" || !type;
  return (
    <div
      className={`fixed top-10 right-10 z-[2000] ${isSuccess ? "bg-emerald-500" : "bg-red-500"} text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right`}
    >
      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
      <span className="font-black text-[11px] uppercase tracking-[0.2em]">
        {message}
      </span>
      <button
        onClick={onClose}
        className="hover:rotate-90 transition-transform font-bold ml-4 opacity-50 hover:opacity-100 text-lg"
      >
        ✕
      </button>
    </div>
  );
}
