import { useState } from "react";
import Link from "next/link";

export default function Nuurhuudas() {
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const symptoms = [
    "Найз нөхдөөсөө хөндийрөх",
    "Сэтгэл санаа тогтворгүй болох",
    "Хичээлдээ явах дургүй болох",
    "Өөрийгөө буруутгах мэдрэмж",
  ];

  const handleSearch = async () => {
    const cleanId = searchId.trim().toUpperCase();
    if (!cleanId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/huselt?id=${cleanId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResult(data.data);
      } else {
        alert("Код олдсонгүй.");
        setSearchResult(null);
      }
    } catch (e) {
      alert("Алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* --- Floating SOS Button --- */}
      <Link href="/yar">
        <button className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-red-600 rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce border-4 border-white text-white">
          🚨
        </button>
      </Link>

      {/* --- Navigation --- */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-100">
            AS
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic text-slate-800">
            SafeSpace
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/asuult"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Анкет бөглөх
          </Link>
        </div>
      </nav>

      {/* --- Hero & Interaction Section --- */}
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            Бид хамтдаа хүчтэй 🤝
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase italic">
            Чи ганцаараа <br />
            <span className="text-indigo-600">биш.</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm md:text-base leading-relaxed max-w-sm mx-auto lg:mx-0 uppercase tracking-tight">
            Дээрэлхэлтийн эсрэг нэгдэж, бие биедээ тусалъя. Тусламж авах нь
            хамгийн зөв алхам юм.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link
              href="/asuult"
              className="bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Тусламж хүсэх →
            </Link>
          </div>
        </div>

        {/* --- Right Column: SOS and Search --- */}
        <div className="space-y-6 w-full max-w-md mx-auto">
          {/* 1. ЯАРАЛТАЙ ТУСЛАМЖ (ДЭЭР НЬ) */}
          <Link href="/yar" className="block group">
            <div className="bg-red-600 p-8 rounded-[2.5rem] shadow-xl shadow-red-100 border border-red-500 flex items-center justify-between transition-all group-hover:scale-[1.02] group-active:scale-95">
              <div className="text-white">
                <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">
                  Яаралтай тусламж
                </h2>
                <p className="text-red-200 text-[9px] font-black uppercase tracking-widest mt-2">
                  Яг одоо тусламж хэрэгтэй бол энд дар
                </p>
              </div>
              <span className="text-4xl group-hover:animate-bounce">🚨</span>
            </div>
          </Link>

          {/* 2. ХАРИУ ШАЛГАХ (ДООРОО) */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-100 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">
                  Хариу шалгах
                </h2>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">
                  Өөрийн нууц кодыг оруулж хариугаа хар
                </p>
              </div>

              <div className="space-y-3">
                <input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="ID: 2026-ABCD"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-50 p-5 rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-slate-200"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95"
                >
                  {loading ? "Хайж байна..." : "Шалгах"}
                </button>
              </div>

              {searchResult && (
                <div className="pt-6 border-t border-slate-50 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${searchResult.status === "Шийдвэрлэсэн" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
                    >
                      {searchResult.status || "Хүлээгдэж буй"}
                    </span>
                    <button
                      onClick={() => setSearchResult(null)}
                      className="text-slate-200 hover:text-slate-400"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-5 bg-indigo-50/50 rounded-[2rem] border border-indigo-50">
                    <p className="text-[8px] font-black text-indigo-300 uppercase mb-2 tracking-widest italic">
                      Багшийн хариу:
                    </p>
                    <p className="text-xs font-bold text-indigo-900 leading-relaxed italic">
                      {searchResult.adminReply ||
                        "Таны хүсэлтийг хүлээн авлаа. Багш удахгүй хариу бичих болно."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- Types Grid (Буцааж нэмэв) --- */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
              Дээрэлхэлт гэж юу вэ?
            </h2>
            <div className="w-16 h-1 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-50 hover:shadow-xl transition-all group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Symptoms Section (Буцааж нэмэв) --- */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-2xl font-black text-center mb-12 uppercase italic tracking-tighter text-slate-800">
          Анхаарах шинж тэмдгүүд
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {symptoms.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
            >
              <div className="w-3 h-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100"></div>
              <span className="font-black text-slate-700 text-xs uppercase tracking-tight">
                {s}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* --- Action Cards (Буцааж нэмэв) --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl">
            <h3 className="text-2xl font-black mb-8 uppercase italic tracking-tighter">
              Хэрэв чи өртсөн бол:
            </h3>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest opacity-80">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">●</span> Итгэдэг хүндээ заавал
                хэлээрэй.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">●</span> Өөрийгөө битгий
                буруутга.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">●</span> Ганцаараа битгий бай.
              </li>
            </ul>
          </div>
          <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100">
            <h3 className="text-2xl font-black mb-8 uppercase italic tracking-tighter">
              Хэрэв чи харсан бол:
            </h3>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest">
              <li className="flex items-start gap-3">
                <span>●</span> Үл тоож болохгүй.
              </li>
              <li className="flex items-start gap-3">
                <span>●</span> Найзыгаа дэмжиж хамт бай.
              </li>
              <li className="flex items-start gap-3">
                <span>●</span> Багш, эцэг эхэд мэдэгд.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-16 text-center border-t border-slate-50">
        <p className="text-slate-200 text-[10px] font-black uppercase tracking-[0.5em]">
          © 2026 ANTI-BULLYING PROJECT
        </p>
      </footer>
    </div>
  );
}
