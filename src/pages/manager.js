import React, { useState, useEffect, useMemo, useCallback } from "react";

/**
 * ANTI-BULLY ADMIN SYSTEM v4.0 (COMPLETE REVISED EDITION)
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

  // ID форматлах
  const formatCustomId = useCallback((item) => {
    if (!item || !item.createdAt) return "ID";
    const date = new Date(item.createdAt);
    const dateStr =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");
    const randomPart = item._id ? item._id.slice(-4).toUpperCase() : "RAND";
    const isSos =
      item.isUrgent || item.type === "SOS" || item.answers?.[1]?.includes("🚨");
    return isSos ? `SOS-${dateStr}-${randomPart}` : `${dateStr}-${randomPart}`;
  }, []);

  // Хүүхдийн бичсэн тайлбарыг ялгах
  const getChildMessage = (item) => {
    if (!item) return "";
    return (
      item.description ||
      item.message ||
      item.text ||
      item.answers?.[2] ||
      "Тайлбар бичээгүй байна."
    );
  };

  const stats = useMemo(() => {
    const total = data.length;
    if (total === 0)
      return { total: 0, female: 0, male: 0, sos: 0, solved: 0, pending: 0 };
    const female = data.filter((i) =>
      i.answers?.[9]?.includes("Эмэгтэй"),
    ).length;
    const male = data.filter((i) => i.answers?.[9]?.includes("Эрэгтэй")).length;
    const sos = data.filter(
      (i) => i.isUrgent || i.type === "SOS" || i.answers?.[1]?.includes("🚨"),
    ).length;
    const solved = data.filter((i) => i.status === "Шийдвэрлэсэн").length;
    return { total, female, male, sos, solved, pending: total - solved };
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
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl">
          <h2 className="text-xl font-black italic uppercase text-center mb-8">
            Admin Login
          </h2>
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
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 mb-4 text-center font-bold outline-none focus:border-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg"
            >
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 text-slate-800 font-sans">
      {toast.show && <Toast msg={toast.message} type={toast.type} />}

      <div className="max-w-[1300px] mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-[2.5rem] shadow-sm border border-white gap-4 sticky top-4 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-black italic">
              A
            </div>
            <h1 className="text-lg font-black italic uppercase text-indigo-600 tracking-tighter">
              NoBully Admin
            </h1>
          </div>
          <nav className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("manager")}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "manager" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
            >
              Менежер
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "stats" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
            >
              Статистик
            </button>
          </nav>
        </header>

        {activeTab === "manager" ? (
          <div className="space-y-6">
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

            <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-50">
              <table className="w-full text-left hidden md:table">
                <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 italic">
                  <tr>
                    <th className="px-8 py-6">ID дугаар</th>
                    <th className="px-8 py-6">Огноо</th>
                    <th className="px-8 py-6">Төрөл / Тайлбар</th>
                    <th className="px-8 py-6 text-center">Төлөв</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-20 text-center font-black uppercase text-slate-300"
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
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black ${item.type === "SOS" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"}`}
                          >
                            {formatCustomId(item)}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-slate-700">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-[10px] font-black uppercase text-indigo-600 truncate max-w-[200px]">
                            {item.answers?.[1] ||
                              (item.type === "SOS" ? "🚨 SOS ДОХИО" : "—")}
                          </div>
                          <div className="text-[9px] text-slate-400 truncate max-w-[200px] italic">
                            {getChildMessage(item)}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <StatusText status={item.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Mobile List View */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedItem(item);
                      setReplyText(item.adminReply || "");
                    }}
                    className="p-6 active:bg-slate-50 space-y-3"
                  >
                    <div className="flex justify-between">
                      <span className="text-[10px] font-mono font-black">
                        {formatCustomId(item)}
                      </span>
                      <StatusText status={item.status} />
                    </div>
                    <div className="text-[11px] font-black text-indigo-600 uppercase">
                      {item.answers?.[1] ||
                        (item.type === "SOS" ? "🚨 SOS ДОХИО" : "—")}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-2 italic">
                      "{getChildMessage(item)}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DonutChartCard
              title="Төрөл"
              total={stats.total}
              items={[
                { label: "🚨 SOS", count: stats.sos, color: "#F43F5E" },
                {
                  label: "📝 Ердийн",
                  count: stats.total - stats.sos,
                  color: "#6366F1",
                },
              ]}
            />
            <DonutChartCard
              title="Хүйс"
              total={stats.female + stats.male}
              items={[
                { label: "Эмэгтэй", count: stats.female, color: "#EC4899" },
                { label: "Эрэгтэй", count: stats.male, color: "#3B82F6" },
              ]}
            />
            <DonutChartCard
              title="Төлөв"
              total={stats.total}
              items={[
                {
                  label: "Шийдвэрлэсэн",
                  count: stats.solved,
                  color: "#10B981",
                },
                {
                  label: "Хүлээгдэж буй",
                  count: stats.pending,
                  color: "#F59E0B",
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* MODAL WINDOW - Харилцан яриа хэлбэрээр харуулах */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
          <div className="bg-white w-full max-w-5xl rounded-t-[3rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[96vh] flex flex-col animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center p-6 md:p-8 border-b bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black italic uppercase text-indigo-600">
                  {formatCustomId(selectedItem)}
                </h2>
                <p className="text-[9px] font-black text-slate-400 uppercase mt-2 italic tracking-widest">
                  Огноо: {new Date(selectedItem.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center font-bold text-slate-400 hover:text-rose-500"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* ЗҮҮН ТАЛ: ХАРИЛЦАН ЯРИА */}
                <div className="space-y-4">
                  {/* 1. Хүүхдийн тайлбар */}
                  <div className="flex flex-col gap-1">
                    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative z-10">
                      <p className="text-[10px] font-black text-indigo-500 uppercase italic mb-3 tracking-widest">
                        Хүүхдийн илгээсэн тайлбар:
                      </p>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed italic whitespace-pre-wrap">
                        "{getChildMessage(selectedItem)}"
                      </p>
                    </div>

                    {/* 2. Багшийн хариу (Яг доор нь залгаа) */}
                    <div className="mt-[-20px] pt-10 px-8 pb-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
                      <p className="text-[10px] font-black uppercase italic mb-3 tracking-widest opacity-80 text-indigo-100">
                        Багшийн өгсөн хариу:
                      </p>

                      {selectedItem.status === "Шийдвэрлэсэн" ? (
                        <div className="space-y-4">
                          <p className="text-sm font-black italic leading-relaxed">
                            "{selectedItem.adminReply || "Тайлбар бичээгүй."}"
                          </p>
                          <div className="flex justify-between items-center pt-4 border-t border-indigo-500/50">
                            <span className="text-[9px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">
                              Шийдвэрлэсэн
                            </span>
                            <span className="text-[8px] font-bold opacity-60 italic">
                              {selectedItem.resolvedAt
                                ? new Date(
                                    selectedItem.resolvedAt,
                                  ).toLocaleString()
                                : ""}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <textarea
                            className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm font-bold placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all min-h-[120px]"
                            placeholder="Энд хариугаа бичээрэй..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <button
                            onClick={handleReplySubmit}
                            disabled={isSubmitting || !replyText.trim()}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg ${isSubmitting || !replyText.trim() ? "bg-indigo-400 opacity-50" : "bg-white text-indigo-600 hover:bg-indigo-50"}`}
                          >
                            {isSubmitting ? "Илгээж байна..." : "Хариу илгээх"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Нэмэлт өгөгдөл (Хэрэв асуулгаар ирсэн бол) */}
                  {selectedItem.answers &&
                    Object.keys(selectedItem.answers).length > 2 && (
                      <div className="pt-4 space-y-2">
                        <p className="text-[9px] font-black text-slate-300 uppercase italic px-4">
                          Бусад хариултууд:
                        </p>
                        {Object.entries(selectedItem.answers).map(
                          ([k, v]) =>
                            v &&
                            k !== "1" &&
                            k !== "2" &&
                            k !== "3" && (
                              <div
                                key={k}
                                className="bg-slate-50 p-3 rounded-xl flex justify-between text-[10px] font-bold border border-white"
                              >
                                <span className="text-slate-400">
                                  Асуулт {k}:
                                </span>
                                <span className="text-slate-700">{v}</span>
                              </div>
                            ),
                        )}
                      </div>
                    )}
                </div>

                {/* БАРУУН ТАЛ: ЗУРАГ БА ТӨЛӨВ */}
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-white">
                    <p className="text-[10px] font-black uppercase text-slate-400 italic mb-4 px-2">
                      Хавсаргасан файл
                    </p>
                    {selectedItem.imageUrl || selectedItem.image ? (
                      <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transition-transform hover:scale-[1.01]">
                        <img
                          src={selectedItem.imageUrl || selectedItem.image}
                          className="w-full h-auto object-cover"
                          alt="evidence"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase italic">
                        Зураггүй
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-white flex gap-2">
                    <span className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-indigo-600 shadow-sm">
                      {selectedItem.answers?.[1] ||
                        (selectedItem.type === "SOS" ? "ЯАРАЛТАЙ" : "ЕРДИЙН")}
                    </span>
                    <span className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-rose-500 shadow-sm uppercase">
                      {selectedItem.answers?.[3] || "Дунд түвшин"}
                    </span>
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

// UI COMPONENTS
function StatusText({ status }) {
  const isSolved = status === "Шийдвэрлэсэн";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase ${isSolved ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600 animate-pulse"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isSolved ? "bg-emerald-500" : "bg-orange-500"}`}
      ></span>
      {status || "Шинэ"}
    </span>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border-b-8 ${color}`}>
      <p className="text-[9px] font-black text-slate-300 italic uppercase mb-1">
        {title}
      </p>
      <p className="text-3xl font-black italic text-slate-800 tracking-tighter">
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
    <div className="bg-white p-8 rounded-[3rem] shadow-sm flex flex-col items-center border border-white">
      <h3 className="text-slate-800 font-black text-[10px] uppercase mb-8 italic">
        {title}
      </h3>
      <div className="relative w-36 h-36 mb-8">
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
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-2xl italic">
          {total}
        </div>
      </div>
      <div className="w-full space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-[10px] font-black uppercase"
          >
            <span className="text-slate-400">{item.label}</span>
            <span className="text-slate-800 font-mono">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Toast({ msg, type }) {
  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 rounded-3xl shadow-2xl font-black uppercase text-[10px] text-white ${type === "error" ? "bg-rose-500" : "bg-indigo-600"}`}
    >
      {msg}
    </div>
  );
}
