import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nuurhuudas() {
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    const inputId = searchId.trim().toUpperCase();
    if (!inputId) return;

    setIsSearching(true);
    setErrorMsg("");
    setSearchResult(null);

    try {
      const res = await fetch(`/api/huselt?id=${encodeURIComponent(inputId)}`);
      const json = await res.json();

      if (json.success && json.data) {
        setSearchResult(json.data);
      } else {
        setErrorMsg("Уучлаарай, ийм ID-тай мэдээлэл олдсонгүй.");
      }
    } catch (e) {
      setErrorMsg("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans relative">
      {showUrgentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={handleDismiss}
          ></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
              <span className="text-3xl relative">🚨</span>
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Тусламж <span className="text-red-600">хэрэгтэй юу?</span>
            </h2>
            <div className="flex flex-col gap-2">
              <Link
                href="/yar"
                className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg"
              >
                ТИЙМ, ТУСЛАМЖ ХҮСЬЕ
              </Link>
              <button
                onClick={handleDismiss}
                className="w-full py-2 text-slate-400 font-black text-[9px] uppercase tracking-widest"
              >
                ДАХИН ХАРУУЛАХГҮЙ
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
            Чи ганцаараа биш 🤝
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase italic">
            Чи <br /> ганцаараа <br />{" "}
            <span className="text-indigo-600">биш.</span>
          </h1>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-4">
            <Link
              href="/asuult"
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all"
            >
              Тусламж хүсэх →
            </Link>
            <Link
              href="/yar"
              className="bg-white text-red-600 border-2 border-red-50 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-red-600 transition-all"
            >
              🚨 Яаралтай SOS
            </Link>
          </div>
        </div>

        <div className="w-full max-w-[400px] mx-auto lg:mr-0">
          <div className="bg-white p-8 md:p-10 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 text-center relative z-10">
              Хариу шалгах
            </h2>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 mb-8 italic text-center relative z-10">
              Кодоо оруулаад хариугаа харна уу
            </p>

            <div className="space-y-4 relative z-10">
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="ID CODE (ЖИШЭЭ: SOS-...)"
                className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 p-5 rounded-2xl text-sm font-black outline-none text-center uppercase tracking-[0.1em] transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-lg disabled:opacity-50"
              >
                {isSearching ? "Хайж байна..." : "ШАЛГАХ"}
              </button>
            </div>

            {errorMsg && (
              <p className="mt-4 text-[9px] font-black text-rose-500 uppercase text-center">
                {errorMsg}
              </p>
            )}

            {searchResult && (
              <div className="mt-8 animate-in slide-in-from-bottom-4">
                <div
                  className={`relative p-6 rounded-[2.5rem] shadow-xl ${searchResult.status === "Шийдвэрлэсэн" ? "bg-emerald-600" : "bg-slate-100 border border-slate-200"}`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p
                        className={`text-[9px] font-black uppercase tracking-widest ${searchResult.status === "Шийдвэрлэсэн" ? "text-white/80" : "text-slate-400"}`}
                      >
                        {searchResult.status === "Шийдвэрлэсэн"
                          ? "Багшийн хариу:"
                          : "Төлөв:"}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${searchResult.status === "Шийдвэрлэсэн" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}
                      >
                        {searchResult.status}
                      </span>
                    </div>

                    <div
                      className={`p-5 rounded-2xl ${searchResult.status === "Шийдвэрлэсэн" ? "bg-white/10 border border-white/20" : "bg-white border border-slate-100"}`}
                    >
                      <p
                        className={`text-[13px] font-bold leading-relaxed italic ${searchResult.status === "Шийдвэрлэсэн" ? "text-white" : "text-slate-600"}`}
                      >
                        {searchResult.status === "Шийдвэрлэсэн"
                          ? `"${searchResult.adminReply || "Хариу бичигдээгүй байна."}"`
                          : "Багш одоогоор мэдээлэлтэй танилцаж байна. Тун удахгүй хариу өгөх болно."}
                      </p>
                    </div>

                    <div
                      className={`flex justify-between items-center opacity-60 text-[8px] font-black uppercase tracking-widest pt-2 ${searchResult.status === "Шийдвэрлэсэн" ? "text-white" : "text-slate-400"}`}
                    >
                      <span>ID: {searchResult.customId}</span>
                      <span>
                        {new Date(searchResult.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSearchResult(null)}
                  className="w-full mt-4 text-[8px] font-black uppercase text-slate-300 tracking-[0.3em] hover:text-slate-500"
                >
                  Цэвэрлэх
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-12 text-center border-t border-slate-50">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          SafeSpace Mongolia 2026
        </p>
      </footer>
    </div>
  );
}
