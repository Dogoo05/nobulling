import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <img
              src="https://i.ibb.co/Mk24pLXk/Screenshot-2026-03-26-at-20-40-20.png"
              alt="Logo"
              className="w-11 h-11 rounded-2xl object-cover border-2 border-indigo-600 transition-transform group-hover:rotate-6 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-indigo-900 tracking-tight leading-none">
              Anti-Bully
            </span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">
              Platform
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 text-[15px] font-bold text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Нүүр хуудас
            </Link>
            <Link
              href="/asuult"
              className="hover:text-indigo-600 transition-colors"
            >
              Тусламж
            </Link>
          </div>

          <Link
            href="/manager"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
          >
            Админ хэсэг
          </Link>
        </div>
        <div className="md:hidden">
          <button
            className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div
        className={`md:hidden bg-white border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 py-6 space-y-4 font-bold text-slate-600">
          <Link
            href="/"
            className="hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            Нүүр хуудас
          </Link>
          <Link
            href="/asuult"
            className="hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            Тусламж
          </Link>
          <Link
            href="/manager"
            className="bg-indigo-50 text-indigo-600 px-4 py-3 rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            Админ удирдлага
          </Link>
        </div>
      </div>
    </nav>
  );
}
