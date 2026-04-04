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

  // --- УСТГАХ ФУНКЦ ---
  const handleDelete = async (id) => {
    if (!confirm("Та энэ мэдээллийг бүрмөсөн устгахдаа итгэлтэй байна уу?"))
      return;

    try {
      const res = await fetch(`/api/huselt?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedItem(null); // Модал нээлттэй байвал хаана
        fetchData(false); // Жагсаалтыг шинэчилнэ
      } else {
        alert("Устгахад алдаа гарлаа.");
      }
    } catch (error) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
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
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] p-6">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl w-full max-w-sm border border-white">
          <h1 className="text-xl font-[900] mb-2 text-center uppercase">
            Админ нэвтрэх
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
              className="w-full p-4 bg-slate-100 rounded-2xl mb-4 text-center text-sm font-bold border-2 border-transparent focus:border-black/5 outline-none transition-all"
              placeholder="••••••••"
            />
            <button className="w-full p-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-black font-sans pb-20 selection:bg-indigo-100">
      <div className="max-w-xl mx-auto pt-8 px-4">
        <header className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-[1000] tracking-tighter uppercase leading-none">
              Мэдээллийн сан
            </h1>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1 italic">
              Удирдах хэсэг
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest">
              Нийт
            </span>
            <span className="text-xl font-black leading-none">
              {filteredData.length}
            </span>
          </div>
        </header>

        {/* Хайлт & Шүүлтүүр */}
        <div className="bg-white/70 backdrop-blur-md p-2 rounded-[2rem] shadow-sm border border-white flex flex-col gap-2 mb-6">
          <input
            type="text"
            placeholder="ID-аар хайх..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-white p-4 pl-6 rounded-[1.5rem] text-[11px] font-black outline-none border border-slate-100 focus:shadow-inner"
          />
          <div className="flex gap-2">
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 p-3 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase outline-none text-center"
            >
              <option value="Бүгд">Төлөв: Бүгд</option>
              <option value="Хүлээгдэж буй">Хүлээгдэж буй</option>
              <option value="Шийдвэрлэсэн">Шийдвэрлэсэн</option>
            </select>
            <select
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 p-3 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase outline-none text-center"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "Бүгд" ? "Төрөл: Бүгд" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Жагсаалт */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-20 text-center animate-pulse font-black text-slate-300 text-xs uppercase">
              Ачаалж байна...
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.customId}
                onClick={() => setSelectedItem(item)}
                className={`group bg-white p-5 rounded-[2rem] border border-white shadow-sm flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${item.isUrgent && item.status === "Хүлээгдэж буй" ? "ring-2 ring-red-500/10 bg-red-50/10" : ""}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`w-2 h-2 rounded-full ${item.status === "Шийдвэрлэсэн" ? "bg-green-500" : "bg-orange-400 animate-pulse"}`}
                    />
                    <span className="font-[900] text-[13px] uppercase">
                      {item.customId}
                    </span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(item.createdAt).toLocaleDateString()} /{" "}
                    <span className="text-indigo-600">
                      {item.answers?.[1] || "Бусад"}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm text-xs font-bold">
                  →
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- МОДАЛ ЦОНХ (ЭНД УСТГАХ ТОВЧ НЭМЭГДСЭН) --- */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 z-[200] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-8 pb-4 flex justify-between items-start border-b border-slate-50">
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-1">
                  Дэлгэрэнгүй
                </h2>
                <h3 className="text-xl font-black tracking-tighter uppercase">
                  {selectedItem.customId}
                </h3>
              </div>
              <div className="flex gap-2">
                {/* 🗑️ МОДАЛ ДОТОРХ УСТГАХ ТОВЧ */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedItem.customId);
                  }}
                  className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  title="Устгах"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold active:scale-90 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide text-black">
              <div className="p-6 bg-slate-50 rounded-[2rem] text-sm font-bold leading-relaxed italic border border-slate-100">
                "{selectedItem.description || "Тайлбар байхгүй."}"
              </div>

              {selectedItem.imageUrl && (
                <img
                  src={selectedItem.imageUrl}
                  className="w-full rounded-[2rem] shadow-2xl border-4 border-white"
                  alt="Evidence"
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(selectedItem.answers || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
                    >
                      <p className="text-[8px] font-black text-indigo-600 uppercase mb-1">
                        Асуулт {key}
                      </p>
                      <p className="text-[10px] font-black text-slate-900 truncate">
                        {value}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <div className="pt-8 border-t border-slate-50">
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100">
                    <p className="text-[9px] font-black uppercase text-green-600 mb-2">
                      Админы хариу
                    </p>
                    <p className="text-xs font-bold text-green-900 italic">
                      "{selectedItem.adminReply}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Хариу бичнэ үү..."
                      className="w-full h-32 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none font-bold text-xs transition-all shadow-inner resize-none text-black"
                    />
                    <button
                      onClick={() => handleResolve(selectedItem.customId)}
                      className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest active:scale-95 transition-all"
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
