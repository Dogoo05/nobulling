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
      console.error(err);
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

  const handleResolve = async (id) => {
    if (!reply) return alert("Хариу бичнэ үү.");
    const res = await fetch("/api/huselt", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "Шийдвэрлэсэн", adminReply: reply }),
    });
    if (res.ok) {
      alert("Амжилттай илгээгдлээ! ✅");
      setSelectedItem(null);
      setReply("");
      fetchData(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Та энэ мэдээллийг устгахдаа итгэлтэй байна уу?")) return;
    const res = await fetch(`/api/huselt?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSelectedItem(null);
      fetchData(false);
    }
  };

  const filteredData = data.filter((item) => {
    const matchStatus = filterStatus === "Бүгд" || item.status === filterStatus;
    let matchType = true;
    if (filterType === "ЯАРАЛТАЙ")
      matchType = item.isUrgent || item.customId?.startsWith("SOS");
    else if (filterType !== "Бүгд")
      matchType = (item.answers?.[1] || "").includes(filterType);
    const matchSearch = item.customId
      ?.toUpperCase()
      .includes(searchId.toUpperCase().trim());
    return matchStatus && matchType && matchSearch;
  });

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 w-full max-w-sm">
          <h1 className="text-lg font-black mb-6 text-center uppercase tracking-tighter">
            Нэвтрэх
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === "admin123") setIsLoggedIn(true);
              else alert("Нууц үг буруу!");
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl mb-4 text-center text-sm font-bold border border-slate-100 outline-none focus:ring-1 ring-slate-300"
              placeholder="Нууц үг"
            />
            <button className="w-full p-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
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
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">
              Мэдээллийн сан
            </h1>
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1">
              Удирдлага
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-tighter">
              Нийт
            </span>
            <span className="text-lg font-black leading-none">
              {filteredData.length}
            </span>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="bg-white p-2 rounded-[1.8rem] shadow-sm border border-slate-100 flex flex-col gap-2 mb-6">
          <input
            type="text"
            placeholder="ID-аар хайх..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-slate-50 p-4 rounded-2xl text-[11px] font-bold outline-none border border-transparent focus:border-slate-100"
          />
          <div className="flex gap-2">
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-white border border-slate-50 text-[10px] font-black uppercase outline-none text-center"
            >
              <option value="Бүгд">Төлөв: Бүгд</option>
              <option value="Хүлээгдэж буй">Хүлээгдэж буй</option>
              <option value="Шийдвэрлэсэн">Шийдвэрлэсэн</option>
            </select>
            <select
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-white border border-slate-50 text-[10px] font-black uppercase outline-none text-center"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "Бүгд" ? "Төрөл: Бүгд" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List Feed */}
        <div className="space-y-2">
          {loading ? (
            <div className="p-20 text-center font-black text-slate-200 text-xs uppercase animate-pulse">
              Уншиж байна...
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.customId}
                onClick={() => setSelectedItem(item)}
                className={`bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all ${item.isUrgent && item.status === "Хүлээгдэж буй" ? "border-l-4 border-l-red-400 bg-red-50/10" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${item.status === "Шийдвэрлэсэн" ? "bg-green-400" : "bg-orange-400 animate-pulse"}`}
                    />
                    <span className="font-black text-xs uppercase tracking-tight truncate">
                      {item.customId}
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                    {new Date(item.createdAt).toLocaleDateString()} •{" "}
                    {item.answers?.[1] || "Бусад"}
                  </p>
                </div>
                <div className="text-slate-200 text-sm font-black pl-4">→</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modern Light Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 z-[200]">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
                  Бүртгэл
                </span>
                <span className="text-sm font-black uppercase tracking-tight">
                  {selectedItem.customId}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedItem.customId);
                  }}
                  className="w-10 h-10 bg-red-50 text-red-400 rounded-full flex items-center justify-center hover:bg-red-400 hover:text-white transition-all active:scale-90"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-xs font-bold active:scale-90"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-hide">
              <div className="p-5 bg-slate-50 rounded-2xl text-[13px] font-bold text-slate-700 leading-relaxed italic border border-slate-100">
                "{selectedItem.description || "Тайлбар байхгүй."}"
              </div>

              {selectedItem.imageUrl && (
                <img
                  src={selectedItem.imageUrl}
                  className="w-full rounded-2xl shadow-sm border border-slate-100"
                  alt="Evidence"
                />
              )}

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedItem.answers || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="p-3 bg-white rounded-xl border border-slate-50 shadow-sm"
                    >
                      <p className="text-[7px] font-black text-indigo-400 uppercase mb-0.5 tracking-tighter">
                        Асуулт {key}
                      </p>
                      <p className="text-[10px] font-black text-slate-800 leading-tight truncate">
                        {value}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <div className="pt-6 border-t border-slate-50 mt-4">
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100">
                    <p className="text-[9px] font-black uppercase text-green-500 mb-1">
                      Бидний хариу
                    </p>
                    <p className="text-xs font-bold text-green-900 leading-relaxed italic">
                      "{selectedItem.adminReply}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Хариу илгээх..."
                      className="w-full h-32 p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs shadow-inner resize-none focus:ring-1 ring-slate-100"
                    />
                    <button
                      onClick={() => handleResolve(selectedItem.customId)}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-indigo-100"
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
