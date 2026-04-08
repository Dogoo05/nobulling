import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nuurhuudas() {
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("urgent_dismissed");
    if (!isDismissed) {
      setTimeout(() => setShowUrgentModal(true), 800);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("urgent_dismissed", "true");
    setShowUrgentModal(false);
  };

  const handleSearch = async () => {
    let cleanId = searchId.trim().toUpperCase();
    if (!cleanId) return;

    setIsSearching(true);
    try {
      const url = `/api/huselt?id=${encodeURIComponent(cleanId)}`;
      let res = await fetch(url);
      let data = await res.json();
      if (data.success) {
        setSearchResult(data.data);
      } else {
        setSearchResult({ adminReply: "Ийм ID кодтой мэдээлэл олдсонгүй." });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans relative overflow-x-hidden">
      {/* 🚨 SOS MODAL */}
      {showUrgentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in"
            onClick={handleDismiss}
          ></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 text-center space-y-6 animate-in zoom-in duration-300 border border-slate-50">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
              <span className="text-3xl relative">🚨</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Тусламж <span className="text-red-600">хэрэгтэй юу?</span>
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Чи ганцаараа биш, бид чамтай хамт байна.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/yar"
                className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
              >
                ТИЙМ, ТУСЛАМЖ ХҮСЬЕ
              </Link>
              <button
                onClick={handleDismiss}
                className="w-full py-2 text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-slate-600"
              >
                ДАХИН ХАРУУЛАХГҮЙ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN HERO --- */}
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
            Чи ганцаараа биш 🤝
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.8] tracking-tighter uppercase italic">
            Чи <br />
            ганцаараа <br />
            <span className="text-indigo-600">биш.</span>
          </h1>
          <p className="text-slate-400 font-bold text-[13px] leading-snug max-w-[340px] mx-auto lg:mx-0 uppercase tracking-tight">
            Дээрэлхэлтийн эсрэг нэгдэж, бие биедээ тусалъя. Тусламж авах нь
            хамгийн зөв сонголт.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-2">
            <Link
              href="/asuult"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-center"
            >
              Тусламж хүсэх →
            </Link>
            <Link
              href="/yar"
              className="bg-white text-red-600 border-2 border-red-50 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:border-red-600 transition-all text-center"
            >
              🚨 Яаралтай SOS
            </Link>
          </div>
        </div>

        {/* --- SEARCH BOX --- */}
        <div className="w-full max-w-[340px] mx-auto lg:mr-0">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-xl border border-slate-50">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 text-center">
              Хариу шалгах
            </h2>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1 mb-6 italic text-center leading-none">
              Кодоо оруулаад хариугаа харна уу
            </p>

            <div className="space-y-3">
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="ID CODE"
                className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-600 p-4 rounded-xl text-sm font-black outline-none text-center uppercase tracking-[0.2em] transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-indigo-600 transition-all shadow-md disabled:opacity-50"
              >
                {isSearching ? "Хайж байна..." : "ШАЛГАХ"}
              </button>
            </div>

            {/* TEACHER'S REPLY BOX */}
            {searchResult && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div
                  className={`relative p-6 rounded-[2rem] overflow-hidden shadow-lg ${
                    searchResult.isUrgent
                      ? "bg-red-600 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                  <div className="relative space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {searchResult.isUrgent ? "🚨" : "👩‍🏫"}
                      </span>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-70">
                        Хариу:
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                      <p className="text-[12px] font-bold leading-relaxed italic">
                        "{searchResult.adminReply || "Багш танилцаж байна..."}"
                      </p>
                    </div>
                    <div className="flex justify-between items-center opacity-50 text-[8px] font-black uppercase tracking-widest">
                      <span>SafeSpace Shield</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- INFO CARDS --- */}
      <section className="bg-white py-16 border-t border-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-3">
            <div className="text-3xl">🤫</div>
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-800">
              Бүрэн нууцлал
            </h3>
            <p className="text-slate-500 text-[11px] font-bold uppercase leading-tight tracking-tight">
              Чиний мэдээллийг хэзээ ч бусдад задлахгүй. Зөвхөн сэтгэл зүйч л
              харах эрхтэй.
            </p>
          </div>
          <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] space-y-3 shadow-xl shadow-indigo-100/50">
            <div className="text-3xl">🛡️</div>
            <h3 className="text-lg font-black uppercase italic tracking-tighter">
              Чи аюулгүй
            </h3>
            <p className="text-indigo-100 text-[11px] font-bold uppercase leading-tight tracking-tight">
              Бид сургуулийн орчинд чамайг аюулгүй байлгахын тулд бүх алхмыг
              шуурхай авна.
            </p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-3">
            <div className="text-3xl">🤝</div>
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-800">
              Ганцаараа биш
            </h3>
            <p className="text-slate-500 text-[11px] font-bold uppercase leading-tight tracking-tight">
              Чиний адил олон хүүхэд энэ асуудлыг даван туулсан. Бид ч бас чамд
              тусалъя.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 text-center border-t border-slate-50 bg-[#FDFDFF]">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-3">
          SafeSpace Mongolia 2026
        </p>
        <div className="flex justify-center gap-6 opacity-30 grayscale text-[10px] font-black uppercase italic tracking-tight">
          <span>Anti-Bully Campaign</span>
          <span>Support Center</span>
        </div>
      </footer>
    </div>
  );
}
