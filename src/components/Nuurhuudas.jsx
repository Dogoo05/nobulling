import { useState } from "react";
import Link from "next/link";

export default function Nuurhuudas() {
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const symptoms = [
    "Найз нөхдөөсөө хөндийрөх",
    "Сэтгэл санаа тогтворгүй болох",
    "Хичээлдээ явах дургүй болох",
    "Өөрийгөө буруутгах мэдрэмж",
  ];

  const handleSearch = async () => {
    let cleanId = searchId.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const url = `/api/huselt?id=${encodeURIComponent(cleanId)}`;
      let res = await fetch(url);
      let data = await res.json();
      if (!data.success && !cleanId.startsWith("SOS-")) {
        const sosId = `SOS-${cleanId}`;
        const resSos = await fetch(
          `/api/huselt?id=${encodeURIComponent(sosId)}`,
        );
        const dataSos = await resSos.json();

        if (dataSos.success) {
          data = dataSos;
        }
      }

      if (data.success && data.data) {
        setSearchResult(data.data);
      } else {
        setError("Мэдээлэл олдсонгүй. ID кодыг дахин шалгана уу. ⏳");
      }
    } catch (e) {
      setError("Сервертэй холбогдоход алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      <Link href="/yar" className="block relative z-50 group">
        <div className="bg-red-600 hover:bg-red-700 py-3 px-4 flex items-center justify-center gap-3 transition-colors shadow-lg">
          <span className="text-lg animate-bounce">🚨</span>
          <span className="text-white font-black text-[10px] uppercase tracking-widest italic">
            Яаралтай тусламж хэрэгтэй юу?{" "}
            <span className="underline ml-2 font-bold uppercase tracking-tighter animate-pulse">
              Энд дар →
            </span>
          </span>
        </div>
      </Link>
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-md">
            AS
          </div>
          <span className="font-black text-lg tracking-tighter uppercase italic text-slate-800">
            SafeSpace
          </span>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 pt-6 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-center lg:text-left">
          <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
            Бид хамтдаа 🤝
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase italic">
            Чи ганцаараа <br />
            <span className="text-indigo-600">биш.</span>
          </h1>
          <p className="text-slate-400 font-bold text-[11px] leading-snug max-w-[280px] mx-auto lg:mx-0 uppercase tracking-tight">
            Дээрэлхэлтийн эсрэг нэгдэж, бие биедээ тусалъя. Тусламж авах нь зөв
            алхам.
          </p>
          <div className="flex justify-center lg:justify-start pt-2">
            <Link
              href="/asuult"
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Тусламж хүсэх →
            </Link>
          </div>
        </div>
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-50 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div>
                <h2 className="text-lg font-black uppercase italic tracking-tighter text-slate-800 leading-none">
                  Хариу шалгах
                </h2>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">
                  ID кодоо оруулан багшийн хариуг харна уу
                </p>
              </div>

              <div className="space-y-2">
                <input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="ЖИШЭЭ: 2026-ABCD"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 p-4 rounded-xl text-xs font-bold outline-none transition-all placeholder:text-slate-200 text-center uppercase"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-md active:scale-95"
                >
                  {loading ? "Хайж байна..." : "ШАЛГАХ"}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 rounded-xl">
                  <p className="text-[9px] font-black text-red-500 uppercase text-center leading-tight">
                    {error}
                  </p>
                </div>
              )}

              {searchResult && (
                <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      ID: {searchResult.customId}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                        searchResult.status === "Шийдвэрлэсэн"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {searchResult.status || "Шинэ"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[7px] font-black text-slate-300 uppercase mb-1">
                        Таны тайлбар:
                      </p>
                      <p className="text-[9px] font-bold text-slate-600 italic line-clamp-2 leading-relaxed">
                        "{searchResult.description || "Тайлбар байхгүй"}"
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-2xl shadow-lg ${searchResult.isUrgent ? "bg-red-600 shadow-red-100" : "bg-indigo-600 shadow-indigo-100"}`}
                    >
                      <p className="text-[8px] font-black text-white/70 uppercase mb-1 italic tracking-widest">
                        {searchResult.isUrgent
                          ? "‼️ БАГШИЙН ЯАРАЛТАЙ ЗӨВЛӨГӨӨ:"
                          : "БАГШИЙН ЗӨВЛӨГӨӨ:"}
                      </p>
                      <p className="text-[11px] font-bold text-white leading-relaxed italic">
                        {searchResult.adminReply ||
                          "Багш одоогоор анкеттай танилцаж байна. Түр хүлээнэ үү... ✍️"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">
            Дээрэлхэлт гэж юу вэ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                title: "Сэтгэлзүйн",
                icon: "🗣️",
                desc: "Доромжлох, гадуурхах, цуу яриа тараах.",
              },
              {
                title: "Бие махбодын",
                icon: "👊",
                desc: "Цохих, түлхэх, эд зүйлсийг нь эвдэх.",
              },
              {
                title: "Цахим",
                icon: "📱",
                desc: "Сошиал сувгаар дарамтлах, нууц задрах.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-md font-black uppercase italic text-slate-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-[10px] font-bold leading-tight uppercase tracking-tight">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-lg font-black text-center mb-6 uppercase italic text-slate-800 underline decoration-indigo-100 decoration-4 underline-offset-4">
          Шинж тэмдгүүд
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {symptoms.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="font-black text-slate-700 text-[9px] uppercase tracking-tight">
                {s}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center border-t border-slate-50 bg-white">
        <p className="text-slate-200 text-[8px] font-black uppercase tracking-[0.4em]">
          © 2026 SAFE SPACE PROJECT • UB
        </p>
      </footer>
    </div>
  );
}
