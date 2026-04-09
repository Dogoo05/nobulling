import React, { useEffect, useState, useCallback } from "react";

export default function Admin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [expandedId, setExpandedId] = useState(null);

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

  const filteredData = data.filter((item) => {
    const isResolved = item.status === "Шийдвэрлэсэн";

    const idToSearch = item.customId || item.id || "";
    const matchSearch = idToSearch
      .toUpperCase()
      .includes(searchId.toUpperCase().trim());
    return isResolved && matchSearch;
  });

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
              Safe<span className="text-emerald-600">Resolved</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Шийдвэрлэсэн хэргийн жагсаалт
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
          >
            <span>🔄</span> Шинэчлэх
          </button>
        </header>

        <div className="mb-6 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <input
            type="text"
            placeholder="Хэргийн ID-аар хайх..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full px-5 py-3 rounded-xl font-bold text-[12px] outline-none bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-100 transition-all"
          />
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-300 tracking-widest">
              <tr>
                <th className="p-5 pl-8">ID Дугаар / Огноо</th>
                <th className="p-5 pr-8 text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="2"
                    className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest text-[11px]"
                  >
                    Уншиж байна...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="2"
                    className="p-20 text-center font-black text-slate-300 uppercase italic tracking-widest text-[11px]"
                  >
                    Хэрэг олдсонгүй
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const itemId = item._id || item.customId;
                  const isExpanded = expandedId === itemId;

                  return (
                    <React.Fragment key={itemId}>
                      <tr
                        className={`cursor-pointer transition-all ${isExpanded ? "bg-emerald-50/40" : "hover:bg-slate-50"}`}
                        onClick={() => toggleRow(itemId)}
                      >
                        <td className="p-5 pl-8">
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-[10px] transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
                            >
                              ▶
                            </span>
                            <div>
                              <p className="font-black uppercase text-slate-800 tracking-tight text-[14px]">
                                {item.customId || "ID-ГҮЙ"}
                              </p>
                              <p className="text-slate-400 text-[9px] font-bold uppercase">
                                {item.createdAt
                                  ? new Date(
                                      item.createdAt,
                                    ).toLocaleDateString()
                                  : "Огноогүй"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 pr-8 text-right">
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                            Шийдвэрлэсэн
                          </span>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td
                            colSpan="2"
                            className="p-0 border-none bg-slate-50/30"
                          >
                            <div className="px-6 md:px-12 py-6 animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
                                <p className="text-[9px] font-black text-emerald-600 uppercase mb-3 tracking-widest flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                  Менежерийн шийдвэр:
                                </p>
                                <p className="font-bold text-slate-800 text-[15px] md:text-[17px] leading-relaxed italic">
                                  "
                                  {item.adminReply ||
                                    "Хариу бичигдээгүй байна."}
                                  "
                                </p>
                                <div className="mt-5 pt-4 border-t border-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                  <span>
                                    Хугацаа:{" "}
                                    {item.createdAt
                                      ? new Date(
                                          item.createdAt,
                                        ).toLocaleString()
                                      : "-"}
                                  </span>
                                  <span className="text-emerald-500">
                                    NoBully Archive System
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
