import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nuurhuudas() {
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("urgent_dismissed");
    if (!isDismissed) {
      setShowUrgentModal(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("urgent_dismissed", "true");
    setShowUrgentModal(false);
  };

  const handleSearch = async () => {
    let cleanId = searchId.trim().toUpperCase();
    if (!cleanId) return;
    try {
      const url = `/api/huselt?id=${encodeURIComponent(cleanId)}`;
      let res = await fetch(url);
      let data = await res.json();
      if (data.success) setSearchResult(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans relative overflow-x-hidden">
      {/* 🚨 SOS MODAL */}
      {showUrgentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in"
            onClick={handleDismiss}
          ></div>
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in p-10 text-center space-y-8">
            <button
              onClick={handleDismiss}
              className="absolute top-6 right-6 text-slate-400 font-black"
            >
              ✕
            </button>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <span className="text-4xl">🚨</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Яаралтай тусламж <br />
                <span className="text-red-600">хэрэгтэй юу?</span>
              </h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Чи ганцаараа биш, бид чамайг хамгаална.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/yar"
                className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-100"
              >
                ТИЙМ, ТУСЛАМЖ ХЭРЭГТЭЙ
              </Link>
              <button
                onClick={handleDismiss}
                className="w-full bg-slate-50 text-slate-400 py-6 rounded-2xl font-black text-[9px] uppercase tracking-widest"
              >
                ДАХИН ХАРУУЛАХГҮЙ (ХААХ)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            Чи ганцаараа биш 🤝
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase italic">
            Чи ганцаараа <br />
            <span className="text-indigo-600">биш.</span>
          </h1>
          <p className="text-slate-400 font-bold text-[13px] leading-snug max-w-[320px] mx-auto lg:mx-0 uppercase tracking-tight">
            Дээрэлхэлтийн эсрэг нэгдэж, бие биедээ тусалъя. Тусламж авах нь
            хамгийн зөв сонголт.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <Link
              href="/asuult"
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-indigo-100"
            >
              Тусламж хүсэх →
            </Link>
            <Link
              href="/yar"
              className="bg-white text-red-600 border-2 border-red-100 px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
            >
              🚨 Яаралтай SOS
            </Link>
          </div>
        </div>

        {/* --- SEARCH BOX --- */}
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-50">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">
              Хариу шалгах
            </h2>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 mb-8 italic leading-none">
              Кодоо оруулаад хариугаа харна уу
            </p>
            <div className="space-y-4">
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="ID КОД"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 p-5 rounded-2xl text-sm font-black outline-none text-center uppercase tracking-widest"
              />
              <button
                onClick={handleSearch}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all"
              >
                ШАЛГАХ
              </button>
            </div>
            {searchResult && (
              <div className="mt-8 pt-8 border-t border-slate-50 animate-in fade-in slide-in-from-bottom-2">
                <div
                  className={`p-6 rounded-3xl shadow-xl ${searchResult.isUrgent ? "bg-red-600 shadow-red-200" : "bg-indigo-600 shadow-indigo-200"}`}
                >
                  <p className="text-[12px] font-bold text-white italic leading-relaxed text-center">
                    {searchResult.adminReply ||
                      "Багш анкеттай танилцаж байна... ✍️"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- 🆕 НЭМЭЛТ МЭДЭЭЛЛИЙН ХЭСЭГ (СЕКЦҮҮД) --- */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Мэдээлэл 1 */}
            <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem]">
              <div className="text-3xl">🤫</div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                Бүрэн нууцлал
              </h3>
              <p className="text-slate-500 text-[11px] font-bold uppercase leading-relaxed tracking-tight">
                Чиний илгээсэн мэдээллийг зөвхөн эрх бүхий багш, сэтгэл зүйч л
                харах бөгөөд бусдад хэзээ ч задлахгүй.
              </p>
            </div>
            {/* Мэдээлэл 2 */}
            <div className="space-y-4 p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
              <div className="text-3xl">🛡️</div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                Чи хамгаалалтад байна
              </h3>
              <p className="text-indigo-100 text-[11px] font-bold uppercase leading-relaxed tracking-tight">
                Бид сургуулийн орчинд чамайг аюулгүй байлгахын тулд боломжтой
                бүх алхмыг шуурхай авч хэрэгжүүлнэ.
              </p>
            </div>
            {/* Мэдээлэл 3 */}
            <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem]">
              <div className="text-3xl">🤝</div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                Ганцаараа биш
              </h3>
              <p className="text-slate-500 text-[11px] font-bold uppercase leading-relaxed tracking-tight">
                Чиний адил олон хүүхэд энэ асуудлыг даван туулж чадсан. Бид ч
                бас чамайг даван туулахад чинь тусалъя.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ЗӨВЛӨГӨӨ РҮҮ ҮСРЭХ ХЭСЭГ --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            {/* Гоёл чимэглэлийн эффект */}
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
            Юу хийхээ <br />
            <span className="text-indigo-500">мэдэхгүй байна уу?</span>
          </h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
            Дээрэлхэлтийн үед ямар хариу үйлдэл үзүүлэх талаарх мэргэжлийн
            зөвлөгөөг уншаарай.
          </p>
          <Link
            href="/zuv"
            className="inline-block bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all"
          >
            Зөвлөмж унших →
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center space-y-4 border-t border-slate-100">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          SafeSpace Mongolia 2026
        </p>
        <div className="flex justify-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
          <div className="font-black text-[10px] uppercase tracking-tighter italic">
            Anti-Bully Campaign
          </div>
          <div className="font-black text-[10px] uppercase tracking-tighter italic">
            Support Center
          </div>
        </div>
      </footer>
    </div>
  );
}
