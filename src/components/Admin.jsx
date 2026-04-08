import { useEffect, useState, useCallback, useRef } from "react";

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

const types = ["Бүх төрөл", "Үг хэлээр", "Бие махбодиор", "Цахимаар", "Бусад"];

// --- CUSTOM SELECT COMPONENT ---
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white px-5 py-3.5 rounded-2xl font-black uppercase text-[10px] border border-slate-100 shadow-sm flex justify-between items-center min-w-[160px] active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{label}:</span>
          <span className="text-indigo-600">{value}</span>
        </div>
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-[115%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-50 z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`px-5 py-3 text-[10px] font-black uppercase cursor-pointer transition-colors ${value === opt ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function SafeViewer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("Бүх төрөл");
  const [searchId, setSearchId] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) setData(d.data || []);
    } catch (err) {
      console.error("Дата татахад алдаа гарлаа:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // ЗӨВХӨН ШИЙДВЭРЛЭСЭН ХЭРГҮҮДИЙГ ШҮҮХ ЛОГИК
  const filteredData = data.filter((item) => {
    const isResolved = item.status === "Шийдвэрлэсэн";
    const matchType =
      filterType === "Бүх төрөл" ||
      (item.answers && item.answers[1]?.includes(filterType));
    const matchSearch = item.customId
      ?.toUpperCase()
      .includes(searchId.toUpperCase().trim());
    return isResolved && matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto pt-10 px-4">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
              Safe<span className="text-emerald-600">Resolved</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Шийдвэрлэсэн хэргийн сан
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="group bg-white px-6 py-3.5 rounded-2xl shadow-sm border border-slate-100 text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <span className="group-hover:rotate-180 transition-transform duration-500">
              🔄
            </span>
            Шинэчлэх
          </button>
        </header>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex-1 relative">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Хэргийн ID-аар хайх..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl font-bold text-[12px] outline-none bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 transition-all"
            />
          </div>
          <CustomSelect
            options={types}
            value={filterType}
            onChange={setFilterType}
            label="Төрөл"
          />
        </div>

        {/* TABLE WRAPPER - Гар утсан дээр гүйдэг хэсэг */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar-h">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-50/50 font-black uppercase text-[9px] text-slate-400 tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-7 pl-9">ID / Хугацаа</th>
                  <th className="p-7">Төрөл</th>
                  <th className="p-7 text-center">Төлөв</th>
                  <th className="p-7 pr-9 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[12px]">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-24 text-center font-black text-slate-300 animate-pulse tracking-widest uppercase"
                    >
                      Уншиж байна...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-24 text-center font-black text-slate-300 tracking-widest uppercase italic"
                    >
                      Шийдвэрлэсэн хэрэг байхгүй байна
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item._id || item.customId}
                      className="hover:bg-emerald-50/20 transition-colors cursor-pointer group"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="p-7 pl-9">
                        <p className="font-black uppercase text-slate-800 tracking-tight">
                          {item.customId}
                        </p>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </td>
                      <td className="p-7 font-bold text-slate-600">
                        {item.isUrgent
                          ? "🚨 ЯАРАЛТАЙ SOS"
                          : item.answers?.[1] || "Бусад"}
                      </td>
                      <td className="p-7 text-center">
                        <span className="px-5 py-2 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap shadow-sm">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-7 pr-9 text-right">
                        <span className="font-black text-slate-300 group-hover:text-emerald-600 transition-all uppercase flex items-center justify-end gap-2">
                          Хариу харах{" "}
                          <span className="group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL VIEW --- */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-7 bg-emerald-500 rounded-full"></div>
                <h2 className="font-black text-xl tracking-tight uppercase text-slate-800">
                  {selectedItem.customId}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* МЕНЕЖЕРИЙН ХАРИУ (Хамгийн чухал) */}
              <div className="p-7 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 shadow-inner">
                <p className="text-[10px] font-black text-emerald-700 uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Менежерийн шийдвэр:
                </p>
                <p className="font-bold text-emerald-950 text-[16px] leading-relaxed italic">
                  "{selectedItem.adminReply || "Хариу бичигдээгүй байна."}"
                </p>
              </div>

              {/* Хэргийн дэлгэрэнгүй */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] ml-2">
                  Ирсэн гомдол:
                </p>
                <div className="p-7 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-slate-700 text-[14px] font-medium leading-relaxed">
                  {selectedItem.description || "Тайлбар байхгүй."}
                </div>
              </div>

              {/* Хавсаргасан зураг */}
              {selectedItem.imageUrl && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] ml-2">
                    Хавсаргасан файл:
                  </p>
                  <img
                    src={selectedItem.imageUrl}
                    className="w-full rounded-[2.5rem] border-4 border-white shadow-xl max-h-[450px] object-contain bg-slate-50"
                    alt="Evidence"
                  />
                </div>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-black active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
              >
                ХААХ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CSS FOR SCROLLBARS */}
      <style jsx global>{`
        .custom-scrollbar-h::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar-h::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar-h::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
