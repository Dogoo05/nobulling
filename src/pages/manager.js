import React, { useState, useEffect, useMemo, useCallback } from "react";

const questionLabels = {
  1: "Хэлбэр",
  2: "Хэзээ",
  3: "Түвшин",
  4: "Хаана",
  5: "Хэн",
  6: "Хэлсэн",
  7: "Гэр бүл",
  8: "Сэтгэл санаа",
  9: "Хүйс",
  10: "Хэрэгцээ",
};

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
  const [filterStatus, setFilterStatus] = useState("Бүгд");

  const showNotification = useCallback((msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const json = await res.json();
      if (json.success) {
        setData(json.data || []);
      }
    } catch (err) {
      showNotification("Өгөгдөл татахад алдаа гарлаа", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  function formatCustomId(item) {
    if (!item) return "ID";
    const existingId = item.id || item.customId || item.SOS_ID;
    if (existingId) return existingId;
    const date = item.createdAt ? new Date(item.createdAt) : new Date();
    const dateStr =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");
    const idSuffix = item._id
      ? item._id.toString().slice(-4).toUpperCase()
      : "RAND";
    return item.type === "yaraltai"
      ? `SOS-${dateStr}-${idSuffix}`
      : `${dateStr}-${idSuffix}`;
  }

  const stats = useMemo(() => {
    const total = data.length;
    const sosCount = data.filter(
      (d) => d.type === "yaraltai" || formatCustomId(d).includes("SOS"),
    ).length;
    const normalCount = total - sosCount;
    const female = data.filter((d) => {
      const val = d.answers?.[9] || d.answers?.["9"];
      if (!val) return false;
      const strVal = Array.isArray(val) ? val[0] : val;
      return strVal?.toString().includes("Эмэгтэй");
    }).length;
    const male = data.filter((d) => {
      const val = d.answers?.[9] || d.answers?.["9"];
      if (!val) return false;
      const strVal = Array.isArray(val) ? val[0] : val;
      return strVal?.toString().includes("Эрэгтэй");
    }).length;
    const resolved = data.filter((d) => d.status === "Шийдвэрлэсэн").length;
    const pending = total - resolved;

    return {
      total,
      type: { sos: sosCount, normal: normalCount, sum: total },
      gender: { female, male, sum: female + male || 1 },
      status: { resolved, pending, sum: total },
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const customId = formatCustomId(item);
        const isSos = customId.includes("SOS");
        const itemTypeLabel = isSos ? "Яаралтай" : "Асуулга";
        const itemStatus = item.status || "Шинэ";
        const matchSearch =
          searchTerm === "" ||
          customId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === "Бүгд" || itemTypeLabel === filterType;
        const matchStatus =
          filterStatus === "Бүгд" || itemStatus === filterStatus;
        return matchSearch && matchType && matchStatus;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, filterType, filterStatus, searchTerm]);

  const handleUpdateStatus = async () => {
    if (
      isSubmitting ||
      !selectedItem ||
      !replyText.trim() ||
      selectedItem.status === "Шийдвэрлэсэн"
    )
      return;
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
        showNotification("Амжилттай шийдвэрлэлээ");
        setSelectedItem(null);
        fetchData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-black text-2xl italic">
            NB
          </div>
          <h2 className="font-black uppercase text-indigo-900 mb-8 text-sm tracking-widest">
            АДМИН НЭВТРЭХ
          </h2>
          <input
            type="password"
            placeholder="Нууц үг"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-center outline-none focus:border-indigo-600 mb-4 transition-all"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (password === "admin123"
                ? setIsLoggedIn(true)
                : alert("Нууц үг буруу!"))
            }
          />
          <button
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-indigo-700 transition-all shadow-xl"
            onClick={() =>
              password === "admin123"
                ? setIsLoggedIn(true)
                : alert("Нууц үг буруу!")
            }
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 font-sans text-slate-900">
      {toast.show && <Toast msg={toast.message} type={toast.type} />}

      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* HEADER - Responsive Flex */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white font-black italic">
              NB
            </div>
            <h1 className="text-sm font-black uppercase text-indigo-900 tracking-tighter italic">
              No-Bullying Admin
            </h1>
          </div>
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("manager")}
              className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "manager" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400"}`}
            >
              Менежер
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "stats" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400"}`}
            >
              Статистик
            </button>
          </div>
        </div>

        {activeTab === "manager" ? (
          <div className="space-y-4">
            {/* SEARCH & FILTERS - Responsive Wrap */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
              <input
                type="text"
                placeholder="ID Хайх..."
                className="bg-slate-50 border border-slate-100 rounded-2xl py-2 px-6 text-xs font-bold outline-none focus:border-indigo-500 w-full lg:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
                <FilterSelect
                  label="Төрөл"
                  value={filterType}
                  options={["Бүгд", "Яаралтай", "Асуулга"]}
                  onChange={setFilterType}
                />
                <FilterSelect
                  label="Төлөв"
                  value={filterStatus}
                  options={["Бүгд", "Шинэ", "Шийдвэрлэсэн"]}
                  onChange={setFilterStatus}
                />
              </div>
            </div>

            {/* TABLE CONTAINER - Horizontal Scroll for Mobile */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-center min-w-[800px]">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">
                    <th className="px-6 py-5">ID ДУГААР</th>
                    <th className="px-4 py-5">ТӨРӨЛ</th>
                    <th className="px-4 py-5">ХҮНДРЭЛ</th>
                    <th className="px-6 py-5 text-left">ТАЙЛБАР ТОЙМ</th>
                    <th className="px-6 py-5">ТӨЛӨВ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-20 text-xs font-black text-slate-300"
                      >
                        Ачаалж байна...
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => {
                      const displayId = formatCustomId(item);
                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-slate-50 cursor-pointer transition-all group"
                          onClick={() => {
                            setSelectedItem(item);
                            setReplyText(item.adminReply || "");
                          }}
                        >
                          <td
                            className={`px-6 py-4 font-mono font-black text-[11px] ${displayId.includes("SOS") ? "text-red-500" : "text-slate-600"}`}
                          >
                            {displayId}
                          </td>
                          <td className="px-4 py-4 text-[9px] font-black uppercase">
                            <span
                              className={
                                displayId.includes("SOS")
                                  ? "bg-red-50 text-red-500 px-3 py-1 rounded-lg"
                                  : "bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg"
                              }
                            >
                              {displayId.includes("SOS") ? "SOS" : "АСУУЛГА"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[10px] font-bold text-slate-500">
                            {displayId.includes("SOS")
                              ? "Маш хүнд"
                              : item.answers?.[3] || "Дунд"}
                          </td>
                          <td className="px-6 py-4 text-left">
                            <div className="max-w-[300px] text-[11px] text-slate-400 truncate italic group-hover:text-slate-600 transition-colors">
                              "
                              {item.description ||
                                item.answers?.[2] ||
                                "Тайлбар байхгүй"}
                              "
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* STATS GRID - Responsive 1 to 3 columns */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <DonutChart
              title="ТУСЛАМЖИЙН ТӨРӨЛ"
              total={stats.type.sum}
              items={[
                {
                  label: "Яаралтай",
                  count: stats.type.sos,
                  stroke: "stroke-red-500",
                  bg: "bg-red-500",
                },
                {
                  label: "Ердийн",
                  count: stats.type.normal,
                  stroke: "stroke-indigo-400",
                  bg: "bg-indigo-400",
                },
              ]}
            />
            <DonutChart
              title="ХҮЙСНИЙ ХАРЬЦАА"
              total={stats.gender.sum}
              items={[
                {
                  label: "ЭМЭГТЭЙ",
                  count: stats.gender.female,
                  stroke: "stroke-pink-500",
                  bg: "bg-pink-500",
                },
                {
                  label: "ЭРЭГТЭЙ",
                  count: stats.gender.male,
                  stroke: "stroke-blue-500",
                  bg: "bg-blue-500",
                },
              ]}
            />
            <DonutChart
              title="ШИЙДВЭРЛЭЛТ"
              total={stats.status.sum}
              items={[
                {
                  label: "Шийдвэрлэсэн",
                  count: stats.status.resolved,
                  stroke: "stroke-emerald-500",
                  bg: "bg-emerald-500",
                },
                {
                  label: "Хүлээгдэж буй",
                  count: stats.status.pending,
                  stroke: "stroke-orange-400",
                  bg: "bg-orange-400",
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* MODAL - Full width on Mobile, Large on Desktop */}
      {selectedItem && (
        <div className="fixed inset-0 bg-indigo-950/50 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-6xl rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
            <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-100">
                <h2 className="text-xl md:text-2xl font-black text-indigo-900 italic">
                  {formatCustomId(selectedItem)}
                </h2>
                <button
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"
                  onClick={() => setSelectedItem(null)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {selectedItem.answers && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(questionLabels).map(([key, label]) => {
                      const ans =
                        selectedItem.answers[key] ||
                        selectedItem.answers[String(key)];
                      if (!ans) return null;
                      return (
                        <div
                          key={key}
                          className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100"
                        >
                          <p className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest">
                            {label}
                          </p>
                          <p className="text-xs font-bold text-slate-700">
                            {Array.isArray(ans) ? ans.join(", ") : ans}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="p-6 md:p-8 rounded-[2rem] bg-indigo-50/30 border-2 border-dashed border-indigo-100">
                  <p className="text-[10px] font-black text-indigo-400 uppercase mb-3 tracking-widest italic">
                    Хүүхдийн мессеж:
                  </p>
                  <p className="text-sm md:text-lg font-bold text-slate-800 italic leading-relaxed italic">
                    "
                    {selectedItem.description ||
                      selectedItem.answers?.[2] ||
                      "Тайлбар байхгүй"}
                    "
                  </p>
                </div>

                {(selectedItem.image || selectedItem.imageUrl) && (
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                      Хавсаргасан зураг:
                    </p>
                    <div className="rounded-[2rem] overflow-hidden border-4 md:border-8 border-slate-50 shadow-xl inline-block bg-white">
                      <img
                        src={selectedItem.image || selectedItem.imageUrl}
                        alt="Evidence"
                        className="max-w-full h-auto object-contain max-h-[400px] md:max-h-[550px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-[380px] lg:w-[400px] bg-slate-50/80 p-6 md:p-10 flex flex-col border-t md:border-t-0 md:border-l border-slate-100">
              <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase text-center italic tracking-tighter">
                Шийдвэрлэх
              </h3>
              <textarea
                className={`flex-1 w-full bg-white rounded-[2rem] p-6 text-sm font-bold outline-none border-2 border-transparent focus:border-indigo-500 mb-6 shadow-inner resize-none transition-all min-h-[150px] ${selectedItem.status === "Шийдвэрлэсэн" ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Энд хариу бичнэ үү..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={selectedItem.status === "Шийдвэрлэсэн"}
              />
              <button
                className="w-full bg-indigo-600 text-white py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs hover:bg-indigo-700 shadow-xl transition-all active:scale-95 disabled:opacity-50"
                onClick={handleUpdateStatus}
                disabled={
                  isSubmitting ||
                  !replyText.trim() ||
                  selectedItem.status === "Шийдвэрлэсэн"
                }
              >
                {selectedItem.status === "Шийдвэрлэсэн"
                  ? "ШИЙДВЭРЛЭГДСЭН"
                  : "ХАРИУ ИЛГЭЭХ"}
              </button>
              <button
                className="md:hidden mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"
                onClick={() => setSelectedItem(null)}
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DonutChart({ title, total, items }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const displayTotal = total || 0;
  const firstPercent =
    displayTotal > 0 ? (items[0].count / displayTotal) * 100 : 0;
  const firstOffset = circumference - (firstPercent / 100) * circumference;
  const secondPercent =
    displayTotal > 0 ? (items[1].count / displayTotal) * 100 : 0;
  const secondOffset = circumference - (secondPercent / 100) * circumference;
  const rotationAngle = (firstPercent / 100) * 360;

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center">
      <p className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-[0.15em] mb-8 md:mb-10 italic text-center">
        {title}
      </p>
      <div className="relative flex items-center justify-center mb-8 md:mb-10">
        <svg className="w-40 h-40 md:w-48 md:h-48 transform -rotate-90 overflow-visible">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="16"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={firstOffset}
            strokeLinecap="round"
            className={`${items[0].stroke} transition-all duration-1000`}
            style={{ transformOrigin: "center" }}
          />
          {secondPercent > 0 && (
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={secondOffset}
              strokeLinecap="round"
              className={`${items[1].stroke} transition-all duration-1000`}
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transformOrigin: "center",
              }}
            />
          )}
        </svg>
        <span className="absolute text-4xl md:text-5xl font-black text-indigo-900 leading-none">
          {displayTotal}
        </span>
      </div>
      <div className="w-full space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center px-2"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.bg}`} />
              <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {item.label}
              </span>
            </div>
            <span className="text-xs md:text-sm font-black text-slate-700">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
        {label}:
      </span>
      <select
        className="bg-slate-50 border border-slate-200 rounded-xl py-1 px-3 md:px-4 text-[9px] md:text-[10px] font-bold outline-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

function StatusBadge({ status }) {
  const isOk = status === "Шийдвэрлэсэн";
  return (
    <span
      className={`px-3 md:px-4 py-1.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase border whitespace-nowrap ${isOk ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}
    >
      {status || "ШИНЭ"}
    </span>
  );
}

function Toast({ msg, type }) {
  return (
    <div
      className={`fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-[200] px-6 md:px-10 py-3 rounded-2xl text-white font-black text-[9px] md:text-[10px] uppercase shadow-2xl animate-bounce ${type === "error" ? "bg-red-500" : "bg-indigo-600"}`}
    >
      {msg}
    </div>
  );
}
