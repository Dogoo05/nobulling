import { useEffect, useState, useCallback } from "react";

export default function Admin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // --- ДАТА ТАТАХ ФУНКЦ ---
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

  // --- ЗӨВХӨН ШИЙДВЭРЛЭСЭН ХЭРГҮҮДИЙГ ШҮҮХ ---
  const filteredData = data.filter((item) => {
    const isResolved = item.status === "Шийдвэрлэсэн";
    const matchSearch = item.customId
      ?.toUpperCase()
      .includes(searchId.toUpperCase().trim());
    return isResolved && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto pt-10 px-4">
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
            <span>🔄</span> Шинэчлэх
          </button>
        </header>

        {/* SEARCH FILTER */}
        <div className="mb-8 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="relative w-full">
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
        </div>

        {/* TABLE (Зөвхөн текст) */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-300 tracking-widest">
                <tr>
                  <th className="p-7 pl-9">ID Дугаар / Огноо</th>
                  <th className="p-7 pr-9 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="p-24 text-center font-black text-slate-300 animate-pulse uppercase tracking-[0.2em]"
                    >
                      Уншиж байна...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="p-24 text-center font-black text-slate-300 uppercase italic tracking-widest"
                    >
                      Шийдвэрлэсэн хэрэг байхгүй байна
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item._id || item.customId}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="p-7 pl-9">
                        <p className="font-black uppercase text-slate-800 tracking-tight text-[15px]">
                          {item.customId}
                        </p>
                        <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </td>
                      <td className="p-7 pr-9 text-right">
                        <span className="font-black text-emerald-600 group-hover:translate-x-1 transition-all uppercase text-[10px] flex items-center justify-end gap-2">
                          Шийдвэр харах ➔
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

      {/* --- MODAL VIEW (Зөвхөн Менежерийн шийдвэр) --- */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="font-black text-xl tracking-tight uppercase text-slate-800">
                {selectedItem.customId}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="p-7 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 shadow-inner">
                <p className="text-[10px] font-black text-emerald-700 uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Менежерийн шийдвэр:
                </p>
                <p className="font-bold text-emerald-950 text-[18px] leading-relaxed italic">
                  "{selectedItem.adminReply || "Хариу бичигдээгүй байна."}"
                </p>
              </div>

              <div className="flex flex-col gap-1 px-4">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  Шийдвэрлэсэн хугацаа:
                </p>
                <p className="text-slate-500 font-bold text-[12px]">
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-lg mt-4 active:scale-95 transition-all"
              >
                ХААХ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
