import { useEffect, useState, useCallback } from "react";

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

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) setData(d.data);
    } catch (err) {
      console.error("Fetch Error:", err);
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

  // Modal нээлттэй үед арын хуудасны scroll-ийг хаах
  useEffect(() => {
    if (selectedItem) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [selectedItem]);

  const handleResolve = async (id) => {
    if (!reply.trim()) return alert("Хариу бичнэ үү.");
    try {
      const res = await fetch("/api/huselt", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Шийдвэрлэсэн", adminReply: reply }),
      });
      if (res.ok) {
        alert("Амжилттай шийдвэрлэлээ! ✅");
        setSelectedItem(null);
        setReply("");
        fetchData(false);
      }
    } catch (e) {
      alert("Алдаа гарлаа.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Та энэ мэдээллийг бүрмөсөн устгахдаа итгэлтэй байна уу?"))
      return;
    try {
      const res = await fetch(`/api/huselt?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedItem(null);
        fetchData(false);
      }
    } catch (e) {
      alert("Устгахад алдаа гарлаа.");
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-200">
            🛡️
          </div>
          <h1 className="text-2xl font-black mb-2 uppercase tracking-tighter">
            Admin Login
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
            Удирдлагын хэсэгт нэвтрэх
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              password === "admin123"
                ? setIsLoggedIn(true)
                : alert("Нууц үг буруу!");
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 bg-slate-50 rounded-2xl mb-4 text-center text-sm font-bold border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all outline-none"
              placeholder="Нууц үг"
            />
            <button className="w-full p-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100">
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-20">
      <div className="max-w-xl mx-auto pt-10 px-4">
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              Safe<span className="text-indigo-600">Admin</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Database Management
            </p>
          </div>
          <div className="bg-white px-5 py-3 rounded-3xl border border-slate-100 shadow-sm text-center min-w-[80px]">
            <span className="text-[9px] font-black text-slate-300 block uppercase tracking-tighter mb-0.5">
              Нийт
            </span>
            <span className="text-xl font-black leading-none text-indigo-600">
              {filteredData.length}
            </span>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="bg-white p-3 rounded-[2.2rem] shadow-sm border border-slate-100 space-y-2 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="ID эсвэл код хайх..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-50/50 p-4 pl-12 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-50 focus:bg-white transition-all"
            />
            <span className="absolute left-5 top-4 opacity-30">🔍</span>
          </div>
          <div className="flex gap-2">
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 p-3.5 rounded-xl bg-slate-50/50 border border-transparent text-[10px] font-black uppercase outline-none text-center hover:bg-white hover:border-slate-100 transition-all cursor-pointer"
            >
              <option value="Бүгд">Бүх Төлөв</option>
              <option value="Хүлээгдэж буй">Хүлээгдэж буй</option>
              <option value="Шийдвэрлэсэн">Шийдвэрлэсэн</option>
            </select>
            <select
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 p-3.5 rounded-xl bg-slate-50/50 border border-transparent text-[10px] font-black uppercase outline-none text-center hover:bg-white hover:border-slate-100 transition-all cursor-pointer"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "Бүгд" ? "Бүх Төрөл" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List Feed */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center font-black text-slate-200 text-xs uppercase animate-pulse tracking-widest">
              Мэдээлэл шинэчилж байна...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase">
              Илэрц олдсонгүй
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.customId}
                onClick={() => setSelectedItem(item)}
                className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md active:scale-[0.98] transition-all group ${item.isUrgent ? "ring-2 ring-red-100" : ""}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-sm ${item.isUrgent ? "bg-red-50" : "bg-slate-50"}`}
                  >
                    {item.isUrgent ? "🚨" : "📄"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${item.status === "Шийдвэрлэсэн" ? "bg-green-500" : "bg-orange-500 animate-pulse"}`}
                      />
                      <span className="font-black text-sm uppercase tracking-tighter truncate">
                        {item.customId}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                      {new Date(item.createdAt).toLocaleDateString()} •{" "}
                      {item.answers?.[1]?.substring(0, 15) || "Бусад"}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors text-[10px]">
                  →
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal View */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 z-[999]"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-[3rem] md:rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-10 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${selectedItem.isUrgent ? "bg-red-50" : "bg-indigo-50"}`}
                >
                  {selectedItem.isUrgent ? "🚨" : "🛡️"}
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-0.5">
                    ID Бүртгэл
                  </span>
                  <span className="text-lg font-black uppercase tracking-tight text-slate-800">
                    {selectedItem.customId}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(selectedItem.customId)}
                  className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black hover:bg-slate-200 transition-all active:scale-90 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Дэлгэрэнгүй тайлбар
                </h4>
                <div className="p-6 bg-slate-50 rounded-[2rem] text-sm font-bold text-slate-700 leading-relaxed italic border border-slate-100/50 shadow-inner">
                  "{selectedItem.description || "Тайлбар оруулаагүй байна."}"
                </div>
              </div>

              {selectedItem.imageUrl && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Хавсаргасан зураг
                  </h4>
                  <div className="rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-sm">
                    <img
                      src={selectedItem.imageUrl}
                      className="w-full object-contain max-h-96"
                      alt="Evidence"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Хариултууд
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedItem.answers || {}).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors"
                      >
                        <p className="text-[8px] font-black text-indigo-400 uppercase mb-1 tracking-tighter italic">
                          Асуулт {key}
                        </p>
                        <p className="text-[11px] font-black text-slate-800 leading-tight">
                          {value}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Admin Reply Section */}
              <div className="pt-8 border-t border-slate-100 mt-4 pb-4">
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-6 bg-green-50/50 rounded-[2rem] border border-green-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">
                        Бидний илгээсэн хариу
                      </p>
                    </div>
                    <p className="text-sm font-bold text-green-900 leading-relaxed italic">
                      "{selectedItem.adminReply}"
                    </p>
                    <p className="text-[8px] font-bold text-green-400 text-right uppercase mt-2">
                      {new Date(
                        selectedItem.updatedAt || selectedItem.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">
                        Хариу илгээх
                      </p>
                    </div>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Зөвлөгөө эсвэл хариуг энд бичнэ үү..."
                      className="w-full h-40 p-6 bg-slate-50 rounded-[2rem] border-none outline-none font-bold text-sm shadow-inner resize-none focus:ring-4 ring-indigo-50 transition-all placeholder:text-slate-300"
                    />
                    <button
                      onClick={() => handleResolve(selectedItem.customId)}
                      className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100 text-xs"
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
