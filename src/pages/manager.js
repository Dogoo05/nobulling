import React, { useState, useEffect, useMemo, useCallback } from "react";

/**
 * ANTI-BULLY ADMIN SYSTEM v3.6 (MOBILE RESPONSIVE + TEXT STATUS)
 */

export default function AntiBullyAdminMaster() {
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

  const [filterType, setFilterType] = useState("Бүгд");
  const [filterLevel, setFilterLevel] = useState("Бүгд");
  const [filterStatus, setFilterStatus] = useState("Бүгд");

  const showNotification = useCallback((msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      if (!res.ok) throw new Error("Сэрвэр хариу өгсөнгүй");
      const json = await res.json();
      if (json.success) setData(json.data || []);
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const formatCustomId = useCallback((item) => {
    if (!item || !item.createdAt) return "ID";
    const date = new Date(item.createdAt);
    const dateStr =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");
    const randomPart = item._id ? item._id.slice(-4).toUpperCase() : "RAND";
    const isSos = item.isUrgent || item.answers?.[1]?.includes("🚨");
    return isSos ? `SOS-${dateStr}-${randomPart}` : `${dateStr}-${randomPart}`;
  }, []);

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl border border-white">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-4xl font-black italic shadow-xl mb-4">
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
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg"
            >
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-slate-800">
      {toast.show && <Toast msg={toast.message} type={toast.type} />}

      <div className="max-w-[1300px] mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-5 rounded-[2rem] shadow-sm border border-white gap-4 sticky top-4 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-black italic">
              A
            </div>
            <h1 className="text-lg font-black italic uppercase text-indigo-600">
              Admin Master
            </h1>
          </div>
          <nav className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab("manager")}
              className={`flex-1 px-8 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === "manager" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
            >
              Менежер
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 px-8 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === "stats" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
            >
              Статистик
            </button>
          </nav>
        </header>

        {activeTab === "manager" ? (
          <div className="space-y-6">
            {/* STAT CARDS */}
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
                title="ШИЙДВЭРЛЭВ"
                value={stats.solved}
                color="border-emerald-500"
              />
            </div>

            {/* FILTERS */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-4">
              <input
                type="text"
                placeholder="ID хайх..."
                className="w-full bg-slate-50 rounded-xl py-4 px-6 text-xs font-bold outline-none ring-1 ring-slate-100 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

            {/* RESPONSIVE TABLE / LIST */}
            <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-50">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 italic">
                    <tr>
                      <th className="px-8 py-6">ID дугаар</th>
                      <th className="px-8 py-6">Огноо</th>
                      <th className="px-8 py-6">Төрөл</th>
                      <th className="px-8 py-6">Түвшин</th>
                      <th className="px-8 py-6 text-center">Төлөв</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-20 text-center font-black uppercase text-slate-300 animate-pulse"
                        >
                          Ачаалж байна...
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
                          <td className="px-8 py-5 text-[10px] font-bold text-slate-700">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-5 text-[10px] font-black uppercase text-indigo-600">
                            {item.answers?.[1] || "—"}
                          </td>
                          <td className="px-8 py-5">
                            <LevelBadge level={item.answers?.[3]} />
                          </td>
                          <td className="px-8 py-5 text-center">
                            <StatusText status={item.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View (Card Style) */}
              <div className="md:hidden divide-y divide-slate-100">
                {loading ? (
                  <div className="p-10 text-center font-black uppercase text-slate-300">
                    Ачаалж байна...
                  </div>
                ) : (
                  filteredData.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedItem(item);
                        setReplyText(item.adminReply || "");
                      }}
                      className="p-5 active:bg-slate-50 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-black ${item.isUrgent || item.answers?.[1]?.includes("🚨") ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"}`}
                        >
                          {formatCustomId(item)}
                        </span>
                        <StatusText status={item.status} />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] font-black uppercase text-indigo-600 truncate max-w-[60%]">
                          {item.answers?.[1] || "—"}
                        </div>
                        <LevelBadge level={item.answers?.[3]} />
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 italic">
                        Огноо: {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* STATS TAB (SAME AS BEFORE BUT RESPONSIVE) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in pb-20">
            <DonutChartCard
              title="Хүйс"
              total={stats.female + stats.male}
              items={[
                { label: "Эмэгтэй", count: stats.female, color: "#EC4899" },
                { label: "Эрэгтэй", count: stats.male, color: "#3B82F6" },
              ]}
            />
            <DonutChartCard
              title="Төрөл"
              total={stats.total}
              items={[
                { label: "🚨 SOS", count: stats.sos, color: "#F43F5E" },
                { label: "📝 Ердийн", count: stats.normal, color: "#6366F1" },
              ]}
            />
            <DonutChartCard
              title="Түвшин"
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

      {/* MODAL (UNCHANGED BUT ENSURE MAX-WIDTH ON MOBILE) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
          <div className="bg-white w-full max-w-5xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden max-h-[96vh] flex flex-col animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center p-6 border-b bg-slate-50/50">
              <h2 className="text-lg font-black italic uppercase text-indigo-600">
                {formatCustomId(selectedItem)}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
              {/* Modal content same as before but ensured layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {Object.entries(selectedItem.answers || {}).map(
                    ([key, val]) => (
                      <div
                        key={key}
                        className="bg-slate-50 p-5 rounded-2xl border border-white shadow-sm"
                      >
                        <p className="text-[8px] font-black text-indigo-400 uppercase mb-1 tracking-widest italic">
                          Асуулт {key}
                        </p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">
                          {val || "—"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
                <div className="space-y-6">
                  {selectedItem.imageUrl || selectedItem.image ? (
                    <img
                      src={selectedItem.imageUrl || selectedItem.image}
                      className="w-full rounded-2xl shadow-lg border-2 border-slate-50"
                      alt="evidence"
                    />
                  ) : (
                    <div className="bg-slate-100 rounded-2xl aspect-video flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase italic">
                      Зураггүй
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100">
                    {selectedItem.status !== "Шийдвэрлэсэн" ? (
                      <div className="space-y-4">
                        <textarea
                          className="w-full bg-slate-50 rounded-2xl p-5 text-sm font-bold outline-none ring-1 ring-slate-100 focus:ring-indigo-500 shadow-inner min-h-[120px]"
                          placeholder="Шийдвэрийг бичнэ үү..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                          onClick={handleReplySubmit}
                          disabled={isSubmitting || !replyText.trim()}
                          className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg transition-all ${isSubmitting || !replyText.trim() ? "bg-slate-200 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"}`}
                        >
                          {isSubmitting
                            ? "Түр хүлээнэ үү..."
                            : "Шийдвэрлэх & Хаах"}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black uppercase text-emerald-500 mb-2 italic">
                          Шийдвэрлэсэн тайлбар:
                        </p>
                        <p className="text-sm font-bold text-slate-700 italic">
                          "{selectedItem.adminReply || "Тайлбар байхгүй."}"
                        </p>
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

// --- ТУСЛАХ КОМПОНЕНТУУД ---

// Төлөвийг текстээр харуулах (Text Status)
function StatusText({ status }) {
  const isSolved = status === "Шийдвэрлэсэн";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${isSolved ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600 animate-pulse"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isSolved ? "bg-emerald-500" : "bg-orange-500"}`}
      ></span>
      {status || "Шинэ"}
    </span>
  );
}

// Түвшинг харуулах (Level Badge)
function LevelBadge({ level }) {
  let style = "bg-slate-100 text-slate-400";
  if (level?.includes("🔥")) style = "bg-red-50 text-red-600";
  else if (level?.includes("⚠️")) style = "bg-orange-50 text-orange-600";
  else if (level?.includes("⚖️")) style = "bg-emerald-50 text-emerald-600";

  return (
    <span className={`px-2 py-1 rounded-md font-bold text-[9px] ${style}`}>
      {level || "---"}
    </span>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-sm border-b-4 transition-all hover:scale-[1.02] ${color}`}
    >
      <p className="text-[8px] font-black text-slate-300 italic uppercase mb-1">
        {title}
      </p>
      <p className="text-2xl font-black italic text-slate-800 tracking-tighter">
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
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center border border-white">
      <h3 className="text-slate-800 font-black text-[9px] uppercase mb-8 italic">
        {title}
      </h3>
      <div className="relative w-32 h-32 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F8FAFC"
            strokeWidth="10"
          />
          {items.map((item, idx) => {
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
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: `rotate(${(offset / circumference) * 360}deg)`,
                  transformOrigin: "50% 50%",
                }}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-800 italic">
            {total}
          </span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-[9px] font-black uppercase"
          >
            <span className="text-slate-500">{item.label}</span>
            <span className="text-slate-800 font-mono">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[8px] font-black uppercase text-slate-300 ml-1 italic">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 rounded-xl py-3 px-3 text-[10px] font-bold outline-none ring-1 ring-slate-100 focus:ring-indigo-500"
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
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-xl font-black uppercase text-[9px] tracking-widest text-white animate-bounce ${type === "error" ? "bg-rose-500" : "bg-indigo-600"}`}
    >
      {msg}
    </div>
  );
}
