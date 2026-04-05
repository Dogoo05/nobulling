import { useEffect, useState, useCallback, useMemo } from "react";

const types = ["Бүгд", "ЯАРАЛТАЙ", "Үг хэлээр", "Бие махбодиор", "Цахимаар"];

export default function Manager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Бүгд");
  const [filterType, setFilterType] = useState("Бүгд");
  const [searchId, setSearchId] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [reply, setReply] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(
        () => setToast((prev) => ({ ...prev, show: false })),
        3000,
      );
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) {
        const sortedData = d.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setData(sortedData);
      }
    } catch (err) {
      setToast({
        show: true,
        message: "Дата уншихад алдаа гарлаа",
        type: "error",
      });
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

  const stats = useMemo(
    () => ({
      total: data.length,
      pending: data.filter((d) => d.status !== "Шийдвэрлэсэн").length,
      resolved: data.filter((d) => d.status === "Шийдвэрлэсэн").length,
      urgent: data.filter((d) => d.isUrgent).length,
    }),
    [data],
  );

  const handleResolve = async (id) => {
    if (!reply.trim())
      return setToast({
        show: true,
        message: "Хариу бичнэ үү!",
        type: "error",
      });
    try {
      const res = await fetch("/api/huselt", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Шийдвэрлэсэн", adminReply: reply }),
      });
      if (res.ok) {
        setSelectedItem(null);
        setReply("");
        setToast({
          show: true,
          message: "Амжилттай шийдвэрлэлээ ✅",
          type: "success",
        });
        fetchData(false);
      }
    } catch (e) {
      setToast({ show: true, message: "Алдаа гарлаа", type: "error" });
    }
  };

  const filteredData = data.filter((item) => {
    const matchStatus = filterStatus === "Бүгд" || item.status === filterStatus;
    let matchType = true;
    if (filterType === "ЯАРАЛТАЙ")
      matchType = item.isUrgent || item.customId?.startsWith("SOS");
    else if (filterType !== "Бүгд")
      matchType = Object.values(item.answers || {}).some((val) =>
        val.includes(filterType),
      );
    const matchSearch = item.customId
      ?.toUpperCase()
      .includes(searchId.toUpperCase().trim());
    return matchStatus && matchType && matchSearch;
  });

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-sm text-center">
          <h1 className="text-2xl font-black mb-8 uppercase tracking-tighter text-indigo-600 italic">
            Safe Admin
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              password === "admin123"
                ? setIsLoggedIn(true)
                : setToast({
                    show: true,
                    message: "Нууц үг буруу!",
                    type: "error",
                  });
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl mb-4 text-center font-bold outline-none border-2 border-transparent focus:border-indigo-100"
              placeholder="Нууц үг"
            />
            <button className="w-full p-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-10 text-[11px]">
      {toast.show && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 rounded-xl shadow-2xl font-black text-[10px] uppercase tracking-widest ${toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto pt-6 px-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">
              Safe<span className="text-indigo-600">Admin</span>
            </h1>
            <p className="text-[7px] font-black uppercase text-slate-400 tracking-[0.3em]">
              Dashboard
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-indigo-600 font-black text-[10px] uppercase"
          >
            🔄 Refresh
          </button>
        </header>

        {/* Stats Section - Шахаж жижигсгэв */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
              Нийт
            </p>
            <p className="text-xl font-black text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-orange-400">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1 text-orange-500">
              Хүлээгдэх
            </p>
            <p className="text-xl font-black text-orange-500">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-green-400">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1 text-green-600">
              Шийдсэн
            </p>
            <p className="text-xl font-black text-green-500">
              {stats.resolved}
            </p>
          </div>
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-md border-l-4 border-l-white/20">
            <p className="text-[8px] font-black text-indigo-100 uppercase mb-1">
              SOS 🚨
            </p>
            <p className="text-xl font-black text-white">{stats.urgent}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 bg-white p-2 rounded-2xl border border-slate-100">
          <input
            type="text"
            placeholder="ID хайх..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="bg-slate-50 p-2.5 rounded-xl font-bold outline-none border border-transparent focus:border-indigo-50"
          />
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 p-2.5 rounded-xl font-black uppercase text-[9px] outline-none cursor-pointer"
          >
            <option value="Бүгд">Төлөв</option>
            <option value="Хүлээгдэж буй">Хүлээгдэж буй</option>
            <option value="Шийдвэрлэсэн">Шийдвэрлэсэн</option>
          </select>
          <select
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 p-2.5 rounded-xl font-black uppercase text-[9px] outline-none cursor-pointer"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "Бүгд" ? "Төрөл" : t}
              </option>
            ))}
          </select>
        </div>

        {/* Table - Шахаж цэгцэлсэн хувилбар */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-black uppercase text-slate-400 text-[8px]">
                <th className="p-3 pl-6">ID / ТАЙЛАН</th>
                <th className="p-3 text-center hidden md:table-cell">ТӨРӨЛ</th>
                <th className="p-3 text-center">ТӨЛӨВ</th>
                <th className="p-3 pr-6 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-10 text-center font-black animate-pulse text-slate-300"
                  >
                    УНШИЖ БАЙНА...
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.customId}
                    className="group hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="p-2.5 pl-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[12px] ${item.isUrgent ? "text-red-500 animate-pulse" : "text-slate-300"}`}
                        >
                          {item.isUrgent ? "🚨" : "📄"}
                        </span>
                        <div className="leading-tight overflow-hidden">
                          <p className="font-black uppercase tracking-tighter text-slate-800 text-[11px]">
                            {item.customId}
                          </p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase truncate max-w-[180px] italic">
                            {item.description || "Тайлбар байхгүй"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5 text-center hidden md:table-cell">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-black uppercase text-[8px] border border-indigo-100/50">
                        {item.answers?.[1]
                          ?.replace(/[^\w\sа-яөү]/gi, "")
                          .substring(0, 12) || "БУСАД"}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <div
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-black uppercase text-[7px] border ${item.status === "Шийдвэрлэсэн" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}
                      >
                        {item.status === "Шийдвэрлэсэн" ? "OK" : "NEW"}
                      </div>
                    </td>
                    <td className="p-2.5 pr-6 text-right">
                      <span className="w-6 h-6 rounded-lg bg-slate-50 inline-flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all text-[10px]">
                        →
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <span className="font-black uppercase text-indigo-600 tracking-tighter text-lg">
                {selectedItem.customId}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 bg-white rounded-2xl font-black shadow-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="p-5 bg-slate-50 rounded-2xl font-bold italic text-slate-700 text-[12px] border border-slate-100">
                "{selectedItem.description || "Тайлбар байхгүй"}"
              </div>
              {selectedItem.imageUrl && (
                <img
                  src={selectedItem.imageUrl}
                  className="w-full rounded-2xl border-4 border-white shadow-md object-cover max-h-64"
                  alt="Evidence"
                />
              )}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-5 bg-green-50 rounded-2xl border border-green-100 font-bold italic text-green-800 text-[11px]">
                    <p className="text-[8px] font-black uppercase text-green-600 mb-1">
                      Илгээсэн хариу:
                    </p>
                    {selectedItem.adminReply}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Хариу эсвэл зөвлөгөө бичих..."
                      className="w-full h-24 p-4 bg-slate-50 rounded-2xl outline-none font-bold text-[11px] resize-none border-2 border-transparent focus:border-indigo-50 shadow-inner"
                    />
                    <button
                      onClick={() => handleResolve(selectedItem.customId)}
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-100"
                    >
                      Хариу илгээх
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
