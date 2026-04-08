import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuItems = [
    { name: "Нүүр хуудас", href: "/", icon: "🏠" },
    { name: "Жагсаалт", href: "/admn", icon: "📋" },

    { name: "Зөвлөгөө", href: "/zuv", icon: "💡" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex justify-between items-center">
          {/* LOGO (Desktop & Mobile Main) */}
          <Link href="/" className="flex items-center gap-2 group py-1">
            <div className="relative">
              <img
                src="https://i.ibb.co/Mk24pLXk/Screenshot-2026-03-26-at-20-40-20.png"
                alt="Logo"
                className="w-9 h-9 md:w-11 md:h-11 rounded-xl object-cover border-2 border-indigo-600 transition-transform group-hover:rotate-6 shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm md:text-xl text-indigo-900 leading-none uppercase tracking-tight">
                No-Bullying
              </span>
              <span className="text-[7px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-[0.1em]">
                Platform
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 text-[15px] font-bold text-slate-600">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="hover:text-indigo-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/manager"
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
              Админ хэсэг
            </Link>
          </div>

          {/* HAMBURGER BUTTON */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-xl text-slate-600 hover:bg-indigo-50 active:scale-90 transition-all focus:outline-none"
              onClick={() => setIsOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-5 flex flex-col h-full relative">
            {/* SIDEBAR TOP: Logo & Name */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.ibb.co/Mk24pLXk/Screenshot-2026-03-26-at-20-40-20.png"
                  alt="Sidebar Logo"
                  className="w-10 h-10 rounded-xl border-2 border-indigo-600 object-cover shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-black text-indigo-900 text-base uppercase leading-none">
                    Anti-Bully
                  </span>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-1">
                    Management
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 active:scale-90 transition-all"
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
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* SIDEBAR MENU: Линкүүд */}
            <div className="flex flex-col space-y-1">
              {/* Цэсний гарчиг хэсэг */}
              <div className="px-2 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-indigo-600 rounded-full opacity-80"></div>
                <p className="text-[14px] font-black text-black uppercase tracking-[0.15em]">
                  Үндсэн цэс
                </p>
              </div>
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between px-4 py-3.5 rounded-2xl text-slate-600 font-bold 
                             hover:bg-indigo-50 hover:text-indigo-600 
                             active:bg-indigo-100 active:scale-[0.97] transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                    <span className="text-[15px]">{item.name}</span>
                  </div>
                  <svg
                    className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}

              <div className="pt-6 mt-4 border-t border-slate-300">
                <Link
                  href="/manager"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-center text-sm font-black 
                             shadow-lg shadow-indigo-100 hover:bg-indigo-700 
                             active:bg-indigo-800 active:scale-[0.95] transition-all flex items-center justify-center gap-3"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M11 16l4-4m0 0l-4-4m4 4H9"
                    />
                  </svg>
                  Админ нэвтрэх
                </Link>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-auto pb-2 text-center">
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest italic">
                Version 1.0.4
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
