import React, { useState, useEffect, useMemo, useCallback } from "react";

/**
 * ANTI-BULLY ADMIN SYSTEM v3.0 (PREMIUM)
 * 1. Бүх график дугуй (Donut Chart)
 * 2. Мобайл болон Десктоп төгс загвар (Fully Responsive)
 * 3. Бүрэн логик (Дутуу зүйлгүй)
 */

export default function AntiBullyAdminMaster() {
  // --- ҮНДСЭН STATE-ҮҮД ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("manager");
  const [selectedItem, setSelectedItem] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // --- ШҮҮЛТҮҮРҮҮД ---
  const [filterType, setFilterType] = useState("Бүгд");
  const [filterLevel, setFilterLevel] = useState("Бүгд");
  const [filterStatus, setFilterStatus] = useState("Бүгд");

  // --- МЭДЭГДЭЛ (TOAST) ---
  const showNotification = useCallback((msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  }, []);

  // --- ӨГӨГДӨЛ ТАТАХ (API FETCH) ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      if (!res.ok) throw new Error("Сэрвэр хариу өгсөнгүй");
      const json = await res.json();
      if (json.success) {
        setData(json.data || []);
      }
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  // --- ID ФОРМАТЛАХ (SOS-20260408-ABCD) ---
  const formatCustomId = useCallback((item) => {
    if (!item || !item.createdAt) return "ID";
    const date = new Date(item.createdAt);
    const dateStr =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");
    const randomPart = item._id ? item._id.slice(-4).toUpperCase() : "RAND";
    const isSos =
      item.isUrgent ||
      (item.answers && item.answers[1] && item.answers[1].includes("🚨"));
    return isSos ? `SOS-${dateStr}-${randomPart}` : `${dateStr}-${randomPart}`;
  }, []);

  // --- СТАТИСТИК ТООЦООЛОЛ (ДУГУЙ ГРАФИКТ ЗОРИУЛСАН) ---
  const stats = useMemo(() => {
    const total = data.length;
    if (total === 0)
      return {
        total: 0,
        female: 0,
        male: 0,
        sos: 0,
        normal: 0,
        heavy: 0,
        medium: 0,
        low: 0,
        solved: 0,
        pending: 0,
      };

    const female = data.filter((i) =>
      i.answers?.[9]?.includes("Эмэгтэй"),
    ).length;
    const male = data.filter((i) => i.answers?.[9]?.includes("Эрэгтэй")).length;
    const sos = data.filter(
      (i) => i.isUrgent || i.answers?.[1]?.includes("🚨"),
    ).length;
    const heavy = data.filter((i) => i.answers?.[3]?.includes("🔥")).length;
    const medium = data.filter((i) => i.answers?.[3]?.includes("⚠️")).length;
    const low = data.filter((i) => i.answers?.[3]?.includes("⚖️")).length;
    const solved = data.filter((i) => i.status === "Шийдвэрлэсэн").length;

    return {
      total,
      female,
      male,
      sos,
      normal: total - sos,
      heavy,
      medium,
      low,
      solved,
      pending: total - solved,
    };
  }, [data]);

  // --- ШҮҮЛТҮҮРИЙН ЛОГИК ---
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchSearch =
          searchTerm === "" ||
          formatCustomId(item).toLowerCase().includes(searchTerm.toLowerCase());
        const matchType =
          filterType === "Бүгд" || item.answers?.[1] === filterType;
        const matchLevel =
          filterLevel === "Бүгд" || item.answers?.[3] === filterLevel;
        const matchStatus =
          filterStatus === "Бүгд" || (item.status || "Шинэ") === filterStatus;
        return matchSearch && matchType && matchLevel && matchStatus;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, filterType, filterLevel, filterStatus, searchTerm, formatCustomId]);

  // --- ХАРИУ ИЛГЭЭХ ---
  const handleReplySubmit = async () => {
    if (!replyText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/huselt?id=${selectedItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Шийдвэрлэсэн",
          adminReply: replyText,
          resolvedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        showNotification("Амжилттай хадгалагдлаа");
        setSelectedItem(null);
        setReplyText("");
        fetchData();
      }
    } catch (err) {
      showNotification("Алдаа гарлаа", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- НЭВТРЭХ ХЭСЭГ ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl border border-white">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-4xl font-black italic shadow-xl shadow-indigo-100 mb-4">
              A
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
              Admin Login
            </h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === "admin123") setIsLoggedIn(true);
              else showNotification("Нууц үг буруу", "error");
            }}
          >
            <input
              type="password"
              placeholder="Нууц үг"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 mb-4 text-center font-bold outline-none focus:border-indigo-500 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-3 md:p-10 font-sans text-slate-800 selection:bg-indigo-100">
      {toast.show && <Toast msg={toast.message} type={toast.type} />}

      <div className="max-w-[1300px] mx-auto space-y-6">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-sm border border-white gap-6 sticky top-4 z-40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black italic">
              A
            </div>
            <div>
              <h1 className="text-lg font-black italic uppercase tracking-tighter text-indigo-600 leading-none">
                Admin Master
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Management Portal
              </p>
            </div>
          </div>
          <nav className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto shadow-inner">
            <button
              onClick={() => setActiveTab("manager")}
              className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "manager" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"}`}
            >
              Менежер
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "stats" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"}`}
            >
              Статистик
            </button>
          </nav>
        </header>

        {activeTab === "manager" ? (
          /* ================= MANAGER TAB ================= */
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* COMPACT SUMMARY CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="НИЙТ"
                value={stats.total}
                color="border-indigo-600"
              />
              <SummaryCard
                title="ШИНЭ"
                value={stats.pending}
                color="border-orange-400"
              />
              <SummaryCard
                title="ЯАРАЛТАЙ"
                value={stats.sos}
                color="border-rose-500"
              />
              <SummaryCard
                title="ХАСАГДСАН"
                value={stats.solved}
                color="border-emerald-500"
              />
            </div>

            {/* SEARCH & FILTERS */}
            <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-sm border border-slate-50 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ID хайх (Жишээ: SOS-2026...)"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">
                  🔍
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <FilterSelect
                  label="Төрөл"
                  value={filterType}
                  options={[
                    "Бүгд",
                    ...new Set(data.map((i) => i.answers?.[1]).filter(Boolean)),
                  ]}
                  onChange={setFilterType}
                />
                <FilterSelect
                  label="Хүндрэл"
                  value={filterLevel}
                  options={["Бүгд", "🔥 Маш хүнд", "⚠️ Хүнд", "⚖️ Дунд"]}
                  onChange={setFilterLevel}
                />
                <FilterSelect
                  label="Төлөв"
                  value={filterStatus}
                  options={["Бүгд", "Шинэ", "Шийдвэрлэсэн"]}
                  onChange={setFilterStatus}
                />
              </div>
            </div>

            {/* RESPONSIVE TABLE */}
            <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-50 min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 italic">
                    <tr>
                      <th className="px-8 py-6">ID дугаар</th>
                      <th className="px-8 py-6">Ирсэн огноо</th>
                      <th className="px-8 py-6">Төрөл</th>
                      <th className="px-8 py-6 text-center">Зураг</th>
                      <th className="px-8 py-6">Төлөв</th>
                      <th className="px-8 py-6 text-right">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-20 text-center text-[10px] font-black uppercase text-slate-300 animate-pulse tracking-widest"
                        >
                          Мэдээлэл ачаалж байна...
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr
                          key={item._id}
                          onClick={() => {
                            setSelectedItem(item);
                            setReplyText(item.adminReply || "");
                          }}
                          className="group hover:bg-slate-50/80 cursor-pointer transition-all"
                        >
                          <td className="px-8 py-5">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black ${item.isUrgent || item.answers?.[1]?.includes("🚨") ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"}`}
                            >
                              {formatCustomId(item)}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-[10px] font-bold text-slate-700">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-[8px] font-bold text-slate-300">
                              {new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </td>
                          <td className="px-8 py-5 text-[10px] font-black uppercase text-indigo-600 truncate max-w-[150px]">
                            {item.answers?.[1] || "—"}
                          </td>
                          <td className="px-8 py-5 text-center">
                            {item.imageUrl || item.image ? (
                              <div className="w-9 h-9 bg-slate-100 rounded-xl mx-auto overflow-hidden border border-white shadow-sm group-hover:scale-110 transition-transform">
                                <img
                                  src={item.imageUrl || item.image}
                                  className="w-full h-full object-cover"
                                  alt="p"
                                />
                              </div>
                            ) : (
                              <span className="text-slate-200">—</span>
                            )}
                          </td>
                          <td className="px-8 py-5">
                            <div
                              className={`w-2.5 h-2.5 rounded-full mx-auto ${item.status === "Шийдвэрлэсэн" ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-orange-400 animate-pulse"}`}
                            ></div>
                          </td>
                          <td className="px-8 py-5 text-right font-black uppercase text-[10px] text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Нээх
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {!loading && filteredData.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center opacity-20">
                  <span className="text-5xl mb-4">📂</span>
                  <p className="text-xs font-black uppercase tracking-widest">
                    Илэрц олдсонгүй
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= STATS TAB (ALL DONUT) ================= */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700 pb-20">
            <DonutChartCard
              title="Хүйсний харьцаа"
              total={stats.female + stats.male}
              items={[
                { label: "Эмэгтэй", count: stats.female, color: "#EC4899" },
                { label: "Эрэгтэй", count: stats.male, color: "#3B82F6" },
              ]}
            />
            <DonutChartCard
              title="Хүсэлтийн төрөл"
              total={stats.total}
              items={[
                {
                  label: "🚨 SOS Яаралтай",
                  count: stats.sos,
                  color: "#F43F5E",
                },
                {
                  label: "📝 Ердийн хүсэлт",
                  count: stats.normal,
                  color: "#6366F1",
                },
              ]}
            />
            <DonutChartCard
              title="Хүндрэлийн түвшин"
              total={stats.heavy + stats.medium + stats.low}
              items={[
                { label: "🔥 Маш хүнд", count: stats.heavy, color: "#EF4444" },
                { label: "⚠️ Хүнд", count: stats.medium, color: "#F59E0B" },
                { label: "⚖️ Дунд", count: stats.low, color: "#10B981" },
              ]}
            />
          </div>
        )}
      </div>

      {/* ================= MODAL DIALOG ================= */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
          <div className="bg-white w-full max-w-5xl rounded-t-[3rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[96vh] flex flex-col animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-center p-6 md:p-8 border-b bg-slate-50/50 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black italic uppercase text-indigo-600 leading-none">
                  {formatCustomId(selectedItem)}
                </h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">
                  Төлөв: {selectedItem.status || "Шинэ"}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center font-bold text-slate-400 hover:text-rose-500 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* АСУУЛТ ХАРИУЛТУУД */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-300 italic px-1">
                    Мэдээллийн дэлгэрэнгүй
                  </p>
                  {Object.entries(selectedItem.answers || {}).map(
                    ([key, val]) => (
                      <div
                        key={key}
                        className="bg-slate-50 p-6 rounded-[1.5rem] border border-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="text-[8px] font-black text-indigo-400 uppercase italic mb-2 tracking-widest">
                          Асуулт {key}
                        </p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">
                          {val || "—"}
                        </p>
                      </div>
                    ),
                  )}
                </div>

                {/* ФАЙЛ БОЛОН ХАРИУ АРГА ХЭМЖЭЭ */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-300 italic px-1">
                      Хавсаргасан файл
                    </p>
                    {selectedItem.imageUrl || selectedItem.image ? (
                      <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-100 group">
                        <img
                          src={selectedItem.imageUrl || selectedItem.image}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                          alt="evidence"
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-100/50 rounded-[2rem] aspect-video border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 italic text-[10px] font-bold uppercase">
                        Зураг хавсаргаагүй
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    {selectedItem.status !== "Шийдвэрлэсэн" ? (
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-slate-800 italic px-1">
                          Админы хариу / Шийдвэр
                        </p>
                        <textarea
                          className="w-full bg-slate-50 rounded-2xl p-6 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-indigo-500 shadow-inner min-h-[150px]"
                          placeholder="Энд авсан арга хэмжээг бичнэ үү..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                          onClick={handleReplySubmit}
                          disabled={isSubmitting || !replyText.trim()}
                          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all ${isSubmitting || !replyText.trim() ? "bg-slate-200 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"}`}
                        >
                          {isSubmitting
                            ? "Түр хүлээнэ үү..."
                            : "Шийдвэрлэх & Хаах"}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 shadow-lg shadow-emerald-50">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-[10px] font-black uppercase text-emerald-500 italic">
                            Шийдвэрлэсэн тайлбар:
                          </p>
                          <span className="text-xl">✅</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                          "{selectedItem.adminReply || "Тайлбар байхгүй."}"
                        </p>
                        {selectedItem.resolvedAt && (
                          <p className="text-[8px] font-black text-slate-300 mt-6 text-right">
                            Дууссан:{" "}
                            {new Date(selectedItem.resolvedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= UI SUB-COMPONENTS =================

function SummaryCard({ title, value, color }) {
  return (
    <div
      className={`bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border-b-8 transition-transform hover:-translate-y-1 duration-300 ${color}`}
    >
      <p className="text-[9px] font-black text-slate-300 italic uppercase mb-1 tracking-widest leading-none">
        {title}
      </p>
      <p className="text-3xl font-black italic tracking-tighter text-slate-800">
        {value}
      </p>
    </div>
  );
}

function DonutChartCard({ title, items, total }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="bg-white p-10 rounded-[3.5rem] shadow-sm flex flex-col items-center border border-white hover:shadow-xl transition-all group">
      <h3 className="text-slate-800 font-black text-[10px] uppercase mb-10 italic tracking-widest">
        {title}
      </h3>
      <div className="relative w-44 h-44 mb-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F8FAFC"
            strokeWidth="12"
          />
          {items.map((item, idx) => {
            if (item.count === 0) return null;
            const percentage = (item.count / (total || 1)) * circumference;
            const strokeDashoffset = circumference - percentage;
            const offset = currentOffset;
            currentOffset += percentage;
            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: `rotate(${(offset / circumference) * 360}deg)`,
                  transformOrigin: "50% 50%",
                }}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800 italic group-hover:scale-110 transition-transform">
            {total}
          </span>
          <span className="text-[8px] font-black text-slate-300 uppercase">
            Нийт
          </span>
        </div>
      </div>
      <div className="w-full space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-[10px] font-black uppercase"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-slate-500">{item.label}</span>
            </div>
            <span className="text-slate-800 font-mono">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="flex-1 space-y-2">
      <p className="text-[9px] font-black uppercase text-slate-300 ml-1 italic">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-[10px] font-bold outline-none cursor-pointer ring-1 ring-slate-100 focus:ring-indigo-500 transition-all"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toast({ msg, type }) {
  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 rounded-[2rem] shadow-2xl font-black uppercase text-[10px] tracking-[0.2em] text-white animate-in slide-in-from-top-10 duration-500 ${type === "error" ? "bg-rose-500" : "bg-indigo-600"}`}
    >
      {msg}
    </div>
  );
}
