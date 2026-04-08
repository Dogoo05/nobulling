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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white px-4 py-3 rounded-2xl font-black uppercase text-[10px] border border-slate-100 shadow-sm flex justify-between items-center min-w-[150px]"
      >
        <span className="text-slate-400 mr-2">{label}:</span>
        <span className="text-slate-700">{value}</span>
        <span
          className={`ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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

export default function SafeViewer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Бүх төлөв");
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 30000); // 30 секунд тутам авто-шинэчлэлт
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredData = data.filter((item) => {
    const matchStatus =
      filterStatus === "Бүх төлөв" ||
      (filterStatus === "Шинэ"
        ? item.status === "Шинэ" || !item.status
        : item.status === filterStatus);
    const matchType =
      filterType === "Бүх төрөл" ||
      (item.answers && item.answers[1]?.includes(filterType));
    const matchSearch = item.customId
      ?.toUpperCase()
      .includes(searchId.toUpperCase().trim());
    return matchStatus && matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFE] pb-20 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Safe<span className="text-indigo-600">Viewer</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Хяналтын самбар (View Only)
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-[10px] font-black uppercase transition-all active:scale-95"
          >
            🔄 Шинэчлэх
          </button>
        </header>

        {/* ШҮҮЛТҮҮР */}
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
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl font-bold text-[11px] outline-none bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 transition-all"
            />
          </div>
          <CustomSelect
            options={["Бүх төлөв", "Шинэ", "Шалгаж байна", "Шийдвэрлэсэн"]}
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

        {/* ЖАГСААЛТ */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-50">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 font-black uppercase text-[8px] text-slate-400 tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-6 pl-8">ID / Хугацаа</th>
                <th className="p-6">Төрөл</th>
                <th className="p-6 text-center">Төлөв</th>
                <th className="p-6 pr-8 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center font-black text-slate-300 animate-pulse tracking-widest"
                  >
                    УНШИЖ БАЙНА...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center font-black text-slate-300 tracking-widest"
                  >
                    МЭДЭЭЛЭЛ ОЛДСОНГҮЙ
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
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-black uppercase ${item.isUrgent ? "text-red-600" : "text-slate-800"}`}
                        >
                          {item.customId}
                        </p>
                        {item.isUrgent && (
                          <span className="bg-red-100 text-red-600 text-[7px] px-2 py-0.5 rounded-full font-black animate-pulse">
                            SOS
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[10px]">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="p-6 font-bold text-slate-600">
                      {item.isUrgent
                        ? "🚨 ЯАРАЛТАЙ SOS"
                        : item.answers?.[1] || "Анкет"}
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === "Шийдвэрлэсэн" ? "bg-emerald-50 text-emerald-600" : item.status === "Шалгаж байна" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}
                      >
                        {item.status || "Шинэ"}
                      </span>
                    </td>
                    <td className="p-6 pr-8 text-right font-black text-slate-300 group-hover:text-indigo-600 transition-all uppercase">
                      Харах →
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* МОДАЛ (ЗӨВХӨН ХАРАХ) */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-3">
                <h2 className="font-black text-xl tracking-tight uppercase text-slate-800">
                  {selectedItem.customId}
                </h2>
                {selectedItem.isUrgent && (
                  <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full animate-pulse">
                    🚨 SOS
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* АНКЕТНЫ ХАРИУЛТУУД */}
              {!selectedItem.isUrgent && selectedItem.answers && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(questionTexts).map(([key, label]) => (
                    <div
                      key={key}
                      className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50"
                    >
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                        {label}
                      </p>
                      <p className="font-bold text-slate-700 text-[12px]">
                        {selectedItem.answers[key] || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* ТАЙЛБАР */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Мэдээллийн агуулга:
                </p>
                <div
                  className={`p-6 border rounded-[2rem] text-[14px] font-bold italic shadow-inner ${selectedItem.isUrgent ? "bg-red-50 border-red-100 text-red-900" : "bg-slate-50 border-slate-100 text-slate-700"}`}
                >
                  "{selectedItem.description || "Тайлбар бичээгүй"}"
                </div>
              </div>

              {/* ЗУРАГ */}
              {selectedItem.imageUrl && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Хавсаргасан файл:
                  </p>
                  <img
                    src={selectedItem.imageUrl}
                    className="w-full rounded-[2rem] border-4 border-white shadow-lg max-h-[500px] object-contain bg-slate-100"
                    alt="Evidence"
                  />
                </div>
              )}

              {/* ӨМНӨ НЬ ӨГСӨН ХАРИУ БАЙВАЛ ХАРУУЛАХ */}
              {selectedItem.adminReply && (
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-2 tracking-widest">
                    Өгсөн хариу:
                  </p>
                  <p className="p-6 bg-indigo-50/50 rounded-[2rem] font-bold text-slate-800 text-[13px] leading-relaxed border border-indigo-100">
                    {selectedItem.adminReply}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]"
              >
                ХААХ
              </button>
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
      `}</style>
    </div>
  );
}
