import { useEffect, useState, useCallback, useMemo } from "react";

const questionTexts = {
  1: "Дээрэлхэлтийн хэлбэр",
  2: "Анх эхэлсэн хугацаа",
  3: "Давтамж",
  4: "Хаана болдог",
  5: "Хэн дарамталдаг",
  6: "Хүнд ярьсан эсэх",
  7: "Тэдний хандлага",
  8: "Сэтгэл санааны байдал",
  9: "Юу тус болох",
  10: "Чухал хэрэгцээ",
};

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

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      3000,
    );
  };

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) {
        setData(d.data || []);
      }
    } catch (err) {
      showToast("Дата уншихад алдаа гарлаа", "error");
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
      urgent: data.filter((d) => d.isUrgent || d.customId?.startsWith("SOS"))
        .length,
    }),
    [data],
  );


  const handleResolve = async (customId) => {
    if (!reply.trim()) {
      showToast("Хариу бичнэ үү!", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/huselt", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customId,
          status: "Шийдвэрлэсэн",
          adminReply: reply,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setSelectedItem((prev) => ({
          ...prev,
          status: "Шийдвэрлэсэн",
          adminReply: reply,
        }));
        setReply("");
        showToast("Хариу амжилттай илгээгдлээ ✅", "success");
        fetchData(false); 
      } else {
        showToast(result.error || "Алдаа гарлаа", "error");
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("Сервертэй холбогдоход алдаа гарлаа", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Энэ хүсэлтийг устгахдаа итгэлтэй байна уу?")) return;
    try {
      
      const res = await fetch(`/api/huselt?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (result.success) {
        setSelectedItem(null);
        showToast("Амжилттай устгагдлаа", "success");
        fetchData(false);
      } else {
        showToast(result.error || "Устгаж чадсангүй", "error");
      }
    } catch (e) {
      showToast("Серверийн алдаа гарлаа", "error");
    }
  };

  const filteredData = data.filter((item) => {
    const matchStatus =
      filterStatus === "Бүгд" ||
      (filterStatus === "Шинэ"
        ? item.status !== "Шийдвэрлэсэн"
        : item.status === filterStatus);
    let matchType = true;
    if (filterType === "ЯАРАЛТАЙ")
      matchType = item.isUrgent || item.customId?.startsWith("SOS");
    else if (filterType !== "Бүгд")
      matchType = Object.values(item.answers || {}).some((v) =>
        v.includes(filterType),
      );
    const matchSearch = item.customId
      ?.toUpperCase()
      .includes(searchId.toUpperCase().trim());
    return matchStatus && matchType && matchSearch;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] p-4 font-sans">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-200 w-full max-w-sm text-center">
          <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter text-indigo-600 italic">
            Safe Admin
          </h1>
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
              className="w-full p-5 bg-slate-50 rounded-2xl mb-4 text-center font-black outline-none border-2 border-transparent focus:border-indigo-200"
              placeholder="НУУЦ ҮГ"
            />
            <button className="w-full p-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
              НЭВТРЭХ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-10 text-[11px]">
      {toast.show && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1001] px-8 py-4 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-widest ${toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto pt-8 px-4">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              Safe<span className="text-indigo-600">Admin</span>
            </h1>
            <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.4em] mt-1">
              Системийн удирдлага
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 text-indigo-600 font-black text-[9px] uppercase hover:bg-slate-50 transition-all"
          >
            🔄 Шинэчлэх
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Нийт хүсэлт",
              val: stats.total,
              color: "text-slate-800",
              bg: "bg-white",
            },
            {
              label: "Шинэ хүсэлт",
              val: stats.pending,
              color: "text-orange-600",
              bg: "bg-white",
              border: "border-l-4 border-l-orange-500",
            },
            {
              label: "Шийдвэрлэсэн",
              val: stats.resolved,
              color: "text-green-600",
              bg: "bg-white",
              border: "border-l-4 border-l-green-500",
            },
            {
              label: "ЯАРАЛТАЙ (SOS)",
              val: stats.urgent,
              color: "text-white",
              bg: "bg-red-600",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.bg} p-5 rounded-[2rem] border border-slate-100 shadow-sm ${s.border || ""}`}
            >
              <p
                className={`text-[8px] font-black uppercase mb-1 ${s.color === "text-white" ? "text-red-100" : "text-slate-400"}`}
              >
                {s.label}
              </p>
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
          <input
            type="text"
            placeholder="ID-аар хайх..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 bg-slate-50 p-3.5 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-100"
          />
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 px-5 py-3.5 rounded-2xl font-black uppercase text-[9px] outline-none"
          >
            <option value="Бүгд">Бүх Төлөв</option>
            <option value="Шинэ">Шинэ</option>
            <option value="Шийдвэрлэсэн">Шийдвэрлэсэн</option>
          </select>
          <select
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 px-5 py-3.5 rounded-2xl font-black uppercase text-[9px] outline-none"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "Бүгд" ? "Бүх Төрөл" : t}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-black uppercase text-slate-400 text-[8px]">
                <th className="p-5 pl-8">ID / Хүсэлтийн мэдээлэл</th>
                <th className="p-5 text-center hidden md:table-cell">Төрөл</th>
                <th className="p-5 text-center">Төлөв</th>
                <th className="p-5 pr-8 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center font-black text-slate-300 uppercase animate-pulse italic"
                  >
                    Датаг ачаалж байна...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center font-black text-slate-300 uppercase italic"
                  >
                    Мэдээлэл олдсонгүй
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.customId}
                    className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="p-4 pl-8">
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-lg ${item.isUrgent ? "animate-bounce" : "opacity-30"}`}
                        >
                          {item.isUrgent ? "🚨" : "📄"}
                        </span>
                        <div>
                          <p
                            className={`font-black uppercase tracking-tighter text-[12px] ${item.isUrgent ? "text-red-600" : "text-slate-800"}`}
                          >
                            {item.customId}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[250px] italic">
                            {item.description || "Тайлбар байхгүй"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center hidden md:table-cell">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black uppercase text-[8px] border border-indigo-100">
                        {item.answers?.[1] || "БУСАД"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-black uppercase text-[8px] border ${item.status === "Шийдвэрлэсэн" ? "bg-green-50 text-green-600 border-green-200" : "bg-orange-50 text-orange-600 border-orange-200"}`}
                      >
                        {item.status === "Шийдвэрлэсэн" ? "Шийдсэн" : "Шинэ"}
                      </span>
                    </td>
                    <td className="p-4 pr-8 text-right">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300 font-black">
                        →
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-[1000]"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <div className="flex items-center gap-3">
                  <h2
                    className={`text-2xl font-black uppercase tracking-tighter ${selectedItem.isUrgent ? "text-red-600" : "text-indigo-600"}`}
                  >
                    {selectedItem.customId}
                  </h2>
                  {selectedItem.isUrgent && (
                    <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase animate-pulse">
                      Яаралтай
                    </span>
                  )}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(selectedItem.customId)}
                  className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 shadow-sm transition-colors"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-slate-50 border border-slate-100 shadow-sm font-black transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(selectedItem.answers || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                        {questionTexts[key] || `Асуулт ${key}`}
                      </p>
                      <p className="text-[11px] font-black text-indigo-900 uppercase leading-tight">
                        {value}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {selectedItem.imageUrl && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">
                    Хавсаргасан зураг:
                  </h4>
                  <div className="relative group">
                    <img
                      src={selectedItem.imageUrl}
                      alt="Attachment"
                      className="w-full h-auto rounded-[2.5rem] border-4 border-white shadow-2xl object-contain bg-slate-100 cursor-zoom-in"
                      onClick={() =>
                        window.open(selectedItem.imageUrl, "_blank")
                      }
                    />
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[8px] px-3 py-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black tracking-widest">
                      Томоор харах 🔍
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Дэлгэрэнгүй тайлбар:
                </h4>
                <div className="p-6 bg-indigo-50/30 rounded-[2rem] font-bold italic text-slate-700 text-[12px] border border-indigo-50 leading-relaxed shadow-inner">
                  {selectedItem.description || "Тайлбар бичээгүй байна."}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                {selectedItem.status === "Шийдвэрлэсэн" ? (
                  <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100">
                    <p className="text-[9px] font-black uppercase text-green-600 mb-2 tracking-widest italic">
                      Илгээсэн хариу зөвлөгөө:
                    </p>
                    <p className="font-bold italic text-green-900 text-[12px] leading-relaxed">
                      {selectedItem.adminReply}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Энд хариу зөвлөгөө эсвэл авсан арга хэмжээг бичнэ үү..."
                      className="w-full h-32 p-6 bg-slate-50 rounded-[2rem] outline-none font-bold text-[12px] resize-none border-2 border-transparent focus:border-indigo-100 shadow-inner"
                    />
                    <button
                      onClick={() => handleResolve(selectedItem.customId)}
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                      Шийдвэрлэх & Хариу илгээх
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
