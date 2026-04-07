import { useEffect, useState, useCallback, useRef } from "react";

// Асуултуудын нэрс
const questionTexts = {
  1: "Хэлбэр",
  2: "Хугацаа",
  3: "Давтамж",
  4: "Хаана",
  5: "Хэн",
  6: "Ярьсан эсэх",
  7: "Хандлага",
  8: "Сэтгэл санаа",
  9: "Тусламж",
  10: "Хэрэгцээ",
};

// Төрлүүдийн сонголт
const types = ["Бүх төрөл", "Үг хэлээр", "Бие махбодиор", "Цахимаар", "Бусад"];

const CustomSelect = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full md:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white px-4 py-3 rounded-2xl font-black uppercase text-[10px] outline-none border border-slate-100 cursor-pointer shadow-sm hover:bg-slate-50 transition-all flex justify-between items-center min-w-[150px]"
      >
        <span className="tracking-wider text-slate-400 mr-2">{label}:</span>
        <span className="text-slate-700">{value}</span>
        <span
          className={`ml-2 transition-transform duration-300 opacity-40 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-50 z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[10px] font-black uppercase cursor-pointer ${value === opt ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Manager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [filterStatus, setFilterStatus] = useState("Бүх төлөв");
  const [filterType, setFilterType] = useState("Бүх төрөл");
  const [searchId, setSearchId] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [reply, setReply] = useState("");

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) setData(d.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData(true);
      const interval = setInterval(() => fetchData(false), 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, fetchData]);

  const handleResolve = async () => {
    if (!selectedItem || !reply.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/huselt", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedItem.customId,
          status: "Шийдвэрлэсэн",
          adminReply: reply,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSelectedItem((prev) => ({
            ...prev,
            status: "Шийдвэрлэсэн",
            adminReply: reply,
          }));
          setData((prev) =>
            prev.map((item) =>
              item.customId === selectedItem.customId
                ? { ...item, status: "Шийдвэрлэсэн", adminReply: reply }
                : item,
            ),
          );
          setReply("");
          setSubmitSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Нууц үг буруу байна!"); //
    }
  };

  const filteredData = data.filter((item) => {
    const matchStatus =
      filterStatus === "Бүх төлөв" ||
      (filterStatus === "Шинэ"
        ? item.status !== "Шийдвэрлэсэн"
        : item.status === filterStatus);
    const matchType =
      filterType === "Бүх төрөл" ||
      (item.answers && item.answers[1] === filterType);
    const matchSearch = item.customId
      ?.toUpperCase()
      .includes(searchId.toUpperCase().trim());
    return matchStatus && matchType && matchSearch;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border border-slate-100">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-100">
            <span className="text-white text-3xl font-black italic">S</span>
          </div>
          <h1 className="text-2xl font-black mb-2 uppercase text-slate-800">
            Safe Admin
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            Системийн удирдлага
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              className={`w-full p-5 bg-slate-50 rounded-2xl text-center font-black outline-none border-2 transition-all ${loginError ? "border-rose-400 animate-shake" : "border-transparent focus:border-indigo-500"}`}
              placeholder="НУУЦ ҮГ"
            />
            {loginError && (
              <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">
                {loginError}
              </p>
            )}
            <button className="w-full p-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98]">
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFE] pb-20">
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Safe<span className="text-indigo-600">Admin</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Management Portal
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
          >
            Шинэчлэх
          </button>
        </header>

        {/* Шүүлтүүрүүд */}
        <div className="flex flex-col md:flex-row gap-3 mb-8 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex-1 relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
              🔍
            </span>
            <input
              type="text"
              placeholder="ID-аар хайх..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl font-bold text-[11px] outline-none bg-slate-50 border border-transparent focus:border-indigo-100 transition-all"
            />
          </div>
          <CustomSelect
            options={["Бүх төлөв", "Шинэ", "Шийдвэрлэсэн"]}
            value={filterStatus}
            onChange={setFilterStatus}
            label="Төлөв"
          />
          <CustomSelect
            options={types}
            value={filterType}
            onChange={setFilterType}
            label="Төрөл"
          />
        </div>

        {/* Хүснэгт */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-50">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 font-black uppercase text-[8px] text-slate-400 tracking-widest">
              <tr>
                <th className="p-6 pl-8">Мэдээлэл / ID</th>
                <th className="p-6 text-center">Төлөв</th>
                <th className="p-6 pr-8 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-20 text-center font-black uppercase text-slate-300 animate-pulse tracking-widest"
                  >
                    Уншиж байна...
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.customId}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="p-6 pl-8">
                      <p className="font-black uppercase text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {item.customId}
                      </p>
                      <p className="text-slate-400 truncate max-w-[300px] font-medium mt-0.5">
                        {item.description || "Тайлбар байхгүй"}
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === "Шийдвэрлэсэн" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600 animate-pulse"}`}
                      >
                        {item.status === "Шийдвэрлэсэн" ? "Шийдсэн" : "Шинэ"}
                      </span>
                    </td>
                    <td className="p-6 pr-8 text-right font-black text-slate-400 group-hover:text-indigo-600 transition-all">
                      ҮЗЭХ →
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модал - Бүх асуултыг харуулах хэсэг */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="font-black text-xl tracking-tight uppercase text-slate-800">
                {selectedItem.customId}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* 10 асуултын хариулт */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(questionTexts).map(([key, label]) => (
                  <div
                    key={key}
                    className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50"
                  >
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                      {label}
                    </p>
                    <p className="font-black text-slate-700 text-[13px]">
                      {selectedItem.answers && selectedItem.answers[key]
                        ? selectedItem.answers[key]
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Нэмэлт тайлбар:
                </p>
                <div className="p-6 bg-indigo-50/30 border border-indigo-100/30 rounded-[2rem] text-[13px] font-bold text-slate-700 leading-relaxed italic shadow-inner">
                  "{selectedItem.description || "Тайлбар байхгүй"}"
                </div>
              </div>

              {selectedItem.imageUrl && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Хавсаргасан файл:
                  </p>
                  <img
                    src={selectedItem.imageUrl}
                    className="w-full rounded-[2rem] border-8 border-white shadow-xl object-contain bg-slate-100 max-h-[300px]"
                    alt="Evidence"
                  />
                </div>
              )}

              {/* Шийдвэрлэх хэсэг */}
              <div className="pt-6 border-t border-slate-100">
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-widest">
                      Илгээсэн хариу:
                    </p>
                    <p className="font-black text-emerald-900 text-[14px] leading-relaxed">
                      {selectedItem.adminReply}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full h-32 p-5 bg-slate-50 rounded-[2rem] outline-none border-2 border-transparent focus:border-indigo-400 focus:bg-white transition-all font-bold text-[13px] placeholder:text-slate-300 shadow-inner"
                      placeholder="Хариуг энд бичнэ үү..."
                    />
                    <button
                      onClick={handleResolve}
                      disabled={submitting || !reply.trim() || submitSuccess}
                      className={`w-full py-5 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.3em] shadow-xl transition-all active:scale-[0.97] flex items-center justify-center gap-3 ${submitSuccess ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-indigo-600"}`}
                    >
                      {submitting
                        ? "Илгээж байна..."
                        : submitSuccess
                          ? "✓ АМЖИЛТТАЙ"
                          : "ШИЙДВЭРЛЭХ"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
