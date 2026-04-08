import { useState, useEffect, useCallback } from "react";
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

  // --- ID ТУЛГАХ ЛОГИК (Админ талтай ижил) ---
  const getFormattedId = (item) => {
    if (!item || !item.createdAt) return "";
    const date = new Date(item.createdAt);
    const dateStr =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");
    const randomPart = item._id ? item._id.slice(-4).toUpperCase() : "";
    const isSos =
      item.isUrgent ||
      (item.answers && item.answers[1] && item.answers[1].includes("🚨"));
    return isSos ? `SOS-${dateStr}-${randomPart}` : `${dateStr}-${randomPart}`;
  };

  const handleSearch = async () => {
    let cleanId = searchId.trim().toUpperCase();
    if (!cleanId) return;

    setIsSearching(true);
    setErrorMsg("");
    setSearchResult(null);

    try {
      const res = await fetch("/api/huselt");
      const json = await res.json();

      if (json.success) {
        // Бүх дата дотроос ID-аар нь шүүж хайх
        const found = json.data.find(
          (item) => getFormattedId(item) === cleanId,
        );

        if (found) {
          setSearchResult(found);
        } else {
          setErrorMsg("Уучлаарай, ийм ID кодтой мэдээлэл олдсонгүй.");
        }
      } else {
        setErrorMsg("Мэдээлэл татахад алдаа гарлаа.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Сүлжээний алдаа гарлаа.");
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

      {/* --- MAIN HERO SECTION --- */}
      <main className="max-w-6xl mx-auto px-6 py-8 md:py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
          <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
            Чи ганцаараа биш 🤝
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase italic">
            Чи <br /> ганцаараа <br />{" "}
            <span className="text-indigo-600">биш.</span>
          </h1>
          <p className="text-slate-400 font-bold text-[13px] leading-snug max-w-[340px] mx-auto lg:mx-0 uppercase tracking-tight">
            Дээрэлхэлтийн эсрэг нэгдэж, бие биедээ тусалъя. Тусламж авах нь
            хамгийн зөв сонголт.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-4">
            <Link
              href="/asuult"
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-center"
            >
              Тусламж хүсэх →
            </Link>
            <Link
              href="/yar"
              className="bg-white text-red-600 border-2 border-red-50 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-red-600 transition-all text-center"
            >
              🚨 Яаралтай SOS
            </Link>
          </div>
        </div>

        {/* --- SEARCH BOX (RIGHT SIDE) --- */}
        <div className="w-full max-w-[360px] mx-auto lg:mr-0 order-1 lg:order-2">
          <div className="bg-white p-8 md:p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

            <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 text-center relative z-10">
              Хариу шалгах
            </h2>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 mb-8 italic text-center leading-none relative z-10">
              Кодоо оруулаад хариугаа харна уу
            </p>

            <div className="space-y-4 relative z-10">
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="ID CODE (Жишээ: 2026...)"
                className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 p-5 rounded-2xl text-sm font-black outline-none text-center uppercase tracking-[0.15em] transition-all shadow-inner"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
              >
                {isSearching ? "Хайж байна..." : "ШАЛГАХ"}
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {errorMsg && (
              <p className="mt-4 text-[9px] font-black text-rose-500 uppercase text-center animate-pulse">
                {errorMsg}
              </p>
            )}

            {/* TEACHER'S REPLY BOX */}
            {searchResult && (
              <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                <div
                  className={`relative p-6 rounded-[2.5rem] overflow-hidden shadow-xl ${
                    searchResult.isUrgent ||
                    searchResult.answers?.[1]?.includes("🚨")
                      ? "bg-rose-600 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  <div className="relative space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👩‍🏫</span>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
                          Багшийн хариу:
                        </p>
                      </div>
                      <span className="bg-white/20 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter">
                        {searchResult.status || "Шинэ"}
                      </span>
                    </div>

                    <div className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-inner">
                      <p className="text-[12px] font-bold leading-relaxed italic">
                        "
                        {searchResult.adminReply ||
                          "Багш мэдээлэлтэй танилцаж байна. Тун удахгүй хариу өгөх болно."}
                        "
                      </p>
                    </div>

                    <div className="flex justify-between items-center opacity-50 text-[8px] font-black uppercase tracking-widest pt-2">
                      <span>SafeSpace ID: {getFormattedId(searchResult)}</span>
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

      {/* --- INFO CARDS SECTION --- */}
      <section className="bg-white py-20 border-t border-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard
            icon="🤫"
            title="Бүрэн нууцлал"
            desc="Чиний мэдээллийг хэзээ ч бусдад задлахгүй. Зөвхөн эрх бүхий багш харах эрхтэй."
          />
          <InfoCard
            icon="🛡️"
            title="Чи аюулгүй"
            desc="Бид сургуулийн орчинд чамайг аюулгүй байлгахын тулд бүх алхмыг шуурхай авна."
            color="bg-indigo-600 text-white shadow-indigo-100/50 shadow-2xl"
          />
          <InfoCard
            icon="🤝"
            title="Ганцаараа биш"
            desc="Чиний адил олон хүүхэд энэ асуудлыг даван туулсан. Бид ч бас чамд тусалъя."
          />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center border-t border-slate-50 bg-[#FDFDFF]">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4">
          SafeSpace Mongolia 2026
        </p>
        <div className="flex justify-center gap-8 opacity-30 grayscale text-[10px] font-black uppercase italic tracking-tighter">
          <span>Anti-Bully Campaign</span>
          <span>•</span>
          <span>Support Center</span>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for Info Cards
function InfoCard({ icon, title, desc, color = "bg-slate-50 text-slate-800" }) {
  return (
    <div
      className={`p-10 rounded-[3rem] space-y-4 transition-transform hover:-translate-y-2 duration-300 ${color}`}
    >
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-black uppercase italic tracking-tighter">
        {title}
      </h3>
      <p
        className={`text-[11px] font-bold uppercase leading-tight tracking-tight ${color.includes("white") ? "opacity-80" : "text-slate-400"}`}
      >
        {desc}
      </p>
    </div>
  );
}
