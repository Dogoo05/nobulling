import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nuurhuudas() {
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // 1. Хуудас ачаалагдахад өмнө нь хаасан эсэхийг шалгах
  useEffect(() => {
    const isDismissed = sessionStorage.getItem("urgent_dismissed");
    if (!isDismissed) {
      setShowUrgentModal(true);
    }
  }, []);

  // 2. "Дахин харуулахгүй" товч дээр дарах үед sessionStorage-д хадгалах
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
      {/* 🚨 ЯАРАЛТАЙ ЦОНХ */}
      {showUrgentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={handleDismiss} // Гадна талд нь дарсан ч хаагдаж, хадгалагдана
          ></div>

          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* "X" товч */}
            <button
              onClick={handleDismiss}
              className="absolute top-6 right-6 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all font-black text-xl z-20"
            >
              ✕
            </button>

            <div className="p-10 text-center space-y-8 relative">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <span className="text-4xl">🚨</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-[1]">
                  Яаралтай тусламж <br />
                  <span className="text-red-600">хэрэгтэй байна уу?</span>
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed opacity-70">
                  Бид чамд туслахад үргэлж бэлэн байна
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/yar"
                  className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-95 text-center"
                >
                  ТИЙМ, ТУСЛАМЖ ХЭРЭГТЭЙ
                </Link>

                {/* 🔘 Дахин харуулахгүй товч */}
                <button
                  onClick={handleDismiss}
                  className="w-full bg-slate-50 text-slate-400 py-6 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  ДАХИН ХАРУУЛАХГҮЙ (ХААХ)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ҮНДСЭН НҮҮР ХУУДАС --- */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-md">
            AS
          </div>
          <span className="font-black text-lg tracking-tighter uppercase italic text-slate-800">
            SafeSpace
          </span>
        </div>
      </nav>

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
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-center"
            >
              Тусламж хүсэх →
            </Link>
            <Link
              href="/yar"
              className="bg-white text-red-600 border-2 border-red-100 px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 shadow-xl shadow-red-50 transition-all active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <span className="animate-pulse">🚨</span> Яаралтай тусламж
            </Link>
          </div>
        </div>

        {/* Хариу шалгах хэсэг */}
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-50">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">
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
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 shadow-lg transition-all"
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
    </div>
  );
}
