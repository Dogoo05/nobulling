import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Асуултуудын жагсаалт (Өөрчлөхгүй)
const questions = [
  {
    id: 1,
    question:
      "1. Танд тохиолдож буй дээрэлхэлт голчлон ямар хэлбэрээр илэрч байна вэ?",
  },
  {
    id: 2,
    question: "2. Энэ таагүй нөхцөл байдал анх хэзээ тохиолдож эхэлсэн бэ?",
  },
  {
    id: 3,
    question:
      "3. Энэ байдал хэр удаан хугацаанд, ямар давтамжтай үргэлжилж байна вэ?",
  },
  { id: 4, question: "4. Дээрэлхэлт голчлон хаана болдог вэ?" },
  { id: 5, question: "5. Чамд хэн хамгийн их дарамт үзүүлдэг вэ?" },
  { id: 6, question: "6. Чи энэ талаар хэн нэгэнд итгэж ярьж байсан уу?" },
  { id: 7, question: "7. Тэдний хандлага ямар байсан бэ?" },
  { id: 8, question: "8. Энэ зүйл чиний сэтгэл санаанд яаж нөлөөлж байна?" },
  {
    id: 9,
    question:
      "9. Танд энэ нөхцөл байдлаас гарахад юу хамгийн их тус болно гэж бодож байна?",
  },
  {
    id: 10,
    question: "10. Яг одоо таны хувьд юу хамгийн чухал хэрэгцээ байна вэ?",
  },
];

export default function Manager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Бүгд");
  const [selectedItem, setSelectedItem] = useState(null); // Modal-д харуулах дата
  const [reply, setReply] = useState("");
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/huselt");
      const d = await res.json();
      if (d.success) setData(d.data || []);
    } catch (err) {
      alert("Сервертэй холбогдож чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") setIsLoggedIn(true);
    else alert("Нууц үг буруу!");
  };

  const handleResolve = async (id) => {
    if (!reply) return alert("Хариу бичнэ үү.");
    const res = await fetch("/api/huselt", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "Шийдвэрлэсэн", adminReply: reply }),
    });
    if (res.ok) {
      fetchData();
      setSelectedItem(null);
      setReply("");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Мөрөн дээр дарахад modal нээгдэхээс сэргийлнэ
    if (!confirm("Устгах уу?")) return;
    const res = await fetch(`/api/huselt?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  const filteredData = data.filter(
    (i) => filterStatus === "Бүгд" || i.status === filterStatus,
  );

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-sm w-full border border-slate-100"
        >
          <h1 className="text-xl font-black mb-6 text-center italic">
            ADMIN ACCESS
          </h1>
          <input
            type="password"
            autoFocus
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none mb-4 text-center font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all">
            НЭВТРЭХ
          </button>
        </form>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black italic uppercase">
            Manager <span className="text-indigo-600">Dashboard</span>
          </h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-5 py-2 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase"
          >
            Гарах
          </button>
        </header>

        {/* Stats & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-2">
            {["Бүгд", "Хүлээгдэж буй", "Шийдвэрлэсэн"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterStatus === s ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-100"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Нийт: {filteredData.length}
          </p>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  ID код
                </th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Төлөв
                </th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Огноо
                </th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Уншиж байх үед харагдах 5 мөр "Skeleton" эффект
                [...Array(5)].map((_, i) => (
                  <tr
                    key={i}
                    className="animate-pulse border-b border-slate-50"
                  >
                    <td className="p-5">
                      <div className="h-4 bg-slate-100 rounded w-24"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-4 bg-slate-100 rounded w-16"></div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="h-4 bg-slate-100 rounded w-6 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.customId}
                    onClick={() => {
                      setSelectedItem(item);
                      setReply(item.adminReply || "");
                    }}
                    className="border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="p-5 font-black text-slate-700">
                      {item.customId}
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.status === "Шийдвэрлэсэн" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5 text-xs text-slate-400 font-bold">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={(e) => handleDelete(e, item.customId)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center font-black text-slate-300 uppercase text-xs"
                  >
                    Мэдээлэл олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-20 text-center font-black text-slate-300 uppercase text-xs">
              Мэдээлэл олдсонгүй
            </div>
          )}
        </div>
      </div>

      {/* Modal - Хүсэлтийн дэлгэрэнгүй */}
      {/* Modal - Хүсэлтийн дэлгэрэнгүй */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-lg font-black italic uppercase">
                Хүсэлт:{" "}
                <span className="text-indigo-600">{selectedItem.customId}</span>
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors font-bold text-slate-400 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto flex-1">
              {/* 1. ЗУРАГ ХАМГИЙН ДЭЭР */}
              <div className="w-full bg-slate-50 border-b border-slate-100">
                {selectedItem.imageUrl ? (
                  <div
                    className="relative group cursor-zoom-in"
                    onClick={() => window.open(selectedItem.imageUrl)}
                  >
                    <img
                      src={selectedItem.imageUrl}
                      className="w-full h-auto max-h-[400px] object-contain mx-auto"
                      alt="Attached"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-sm">
                        Томруулах
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <span className="text-5xl block mb-2">🖼️</span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      Зураг хавсаргаагүй байна
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8 space-y-8">
                {/* 2. ДЭЛГЭРЭНГҮЙ ТАЙЛБАР */}
                {selectedItem.description && (
                  <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">
                      Хэрэглэгчийн тайлбар
                    </h4>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                      "{selectedItem.description}"
                    </p>
                  </div>
                )}

                {/* 3. АСУУЛТ ХАРИУЛТУУД */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">
                    Асуулгын хариултууд
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {questions.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <p className="text-[10px] font-bold text-slate-400 max-w-[250px]">
                          {q.question}
                        </p>
                        <p className="text-xs font-black text-indigo-600 sm:text-right">
                          {selectedItem.answers?.[q.id] || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. БАГШИЙН ХАРИУ */}
                <div className="pt-6 border-t border-slate-100 pb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Шийдвэрлэлт
                  </h4>
                  {selectedItem.status === "Шийдвэрлэсэн" ? (
                    <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-600 text-xs">✅</span>
                        <span className="text-[10px] font-black text-green-600 uppercase">
                          Илгээсэн хариу:
                        </span>
                      </div>
                      <p className="text-sm font-black text-green-800 leading-relaxed">
                        {selectedItem.adminReply}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Энд зөвлөгөө эсвэл хариуг бичнэ үү..."
                        className="w-full h-32 p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-3xl outline-none transition-all font-bold text-sm resize-none"
                      ></textarea>
                      <button
                        onClick={() => handleResolve(selectedItem.customId)}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all"
                      >
                        ХАРИУ ИЛГЭЭХ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
