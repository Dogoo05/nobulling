import React from "react";
import Link from "next/link";

const bullyTypes = [
  {
    title: "Үг хэлээр",
    desc: "Доромжлох, нэр хоч өгөх, сүрдүүлэх, шоолох.",
    icon: "💬",
  },
  {
    title: "Бие махбодиор",
    desc: "Цохих, түлхэх, эд зүйлсийг нь эвдэх, булаах.",
    icon: "👊",
  },
  {
    title: "Нийгмээс тусгаарлах",
    desc: "Найз нөхдийн дундаас хасах, цуурхал тараах.",
    icon: "🚫",
  },
  {
    title: "Цахимаар",
    desc: "Сошиал медиагаар доромжлох, нууц задруулах.",
    icon: "📱",
  },
];

const protectionTactics = [
  {
    step: "Хүчтэй зогсох",
    text: "Нүд рүү нь эгц харж, тод дуугаар 'Үүнийгээ зогсоо!' гэж хэлээд шууд холдож яв. Тэдэнтэй хэрүүл хийх хэрэггүй.",
  },
  {
    step: "Тайван байдлаа хадгалах",
    text: "Дээрэлхэгч чиний уурлах эсвэл уйлахыг харахыг хүсдэг. Тэдэнд хүссэн хариуг нь битгий өг.",
  },
  {
    step: "Олноос битгий тасар",
    text: "Дээрэлхэгчид ихэвчлэн ганцаараа байгаа хүүхдийг сонгодог. Найзуудтайгаа эсвэл олон хүнтэй газар байхыг хичээ.",
  },
  {
    step: "Бүгдийг тэмдэглэ",
    text: "Хэзээ, хаана, юу болсон, хэн харсан талаар өдрийн тэмдэглэл хөтөлж эсвэл зураг авч баримтжуул.",
  },
];

export default function Zvlgoo() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans text-slate-900 pb-10">
      <nav className=" bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex justify-between items-center shadow-sm">
        <h2 className="font-black italic text-sm tracking-tighter uppercase">
          Safe<span className="text-indigo-600">Guide</span>
        </h2>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50">
          <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            01. Дээрэлхэлт гэж юу вэ?
          </h3>
          <p className="text-[12px] font-bold text-slate-600 leading-relaxed mb-4">
            Дээрэлхэлт бол нэг хүн эсвэл бүлэг хүмүүс өөр нэгнийг санаатайгаар,
            удаа дараа гомдоож, доромжилж байгаа үйлдэл юм. Энэ нь хэзээ ч чиний
            буруу биш.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {bullyTypes.map((type, i) => (
              <div
                key={i}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center"
              >
                <div className="text-xl mb-1">{type.icon}</div>
                <h4 className="font-black text-[9px] uppercase mb-1">
                  {type.title}
                </h4>
                <p className="text-[8px] font-bold text-slate-400 leading-tight">
                  {type.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-900 p-7 rounded-[3rem] text-white shadow-xl">
            <h3 className="font-black italic text-lg uppercase tracking-tight mb-4 leading-none">
              Сэтгэл санаагаа <br /> хэрхэн хамгаалах вэ?
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-[11px] font-bold opacity-90">
                <span className="text-indigo-400">●</span> Өөрийгөө битгий
                тусгаарла, дуртай зүйлээ хийж өөрийгөө баярлуул.
              </li>
              <li className="flex gap-3 text-[11px] font-bold opacity-90">
                <span className="text-indigo-400">●</span> Уйлах эсвэл уурлах нь
                сул тал биш, энэ бол чиний сэтгэл хөдлөл.
              </li>
              <li className="flex gap-3 text-[11px] font-bold opacity-90">
                <span className="text-indigo-400">●</span> Дээрэлхэлтийг
                зогсоохын тулд чи заавал том хүнд хандах ёстой.
              </li>
            </ul>
          </div>
          <div className="bg-white p-7 rounded-[3rem] border border-slate-100">
            <h3 className="text-slate-900 font-black text-sm uppercase mb-4 tracking-tighter">
              Тактикууд (Яаж хандах вэ?)
            </h3>
            <div className="space-y-4">
              {protectionTactics.map((t, i) => (
                <div key={i} className="border-l-2 border-indigo-100 pl-4">
                  <h4 className="font-black text-[10px] uppercase text-indigo-600 mb-0.5">
                    {t.step}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight italic">
                    "{t.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-[-10px] right-[-10px] text-7xl opacity-5 grayscale">
            ⚖️
          </div>
          <h3 className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
            03. Хууль чиний талд
          </h3>
          <div className="space-y-2 text-[11px] font-bold text-emerald-900 leading-relaxed">
            <p>
              ● <span className="underline">Хүүхдийн эрхийн тухай хууль:</span>{" "}
              Хүүхэд бүр хүчирхийлэл, дарамт шахалтаас ангид байх эрхтэй.
            </p>
            <p>
              ● <span className="underline">Зөрчлийн тухай хууль:</span> Бусдыг
              доромжлох, гүтгэх, биед нь халдах нь хуулийн дагуу хариуцлага
              хүлээлгэх үндэслэл болно.
            </p>
            <p>
              ● <span className="underline">Сургуулийн дүрэм:</span> Сургууль
              бол хүүхэд бүрт аюулгүй орчныг бүрдүүлэх үүрэгтэй байгууллага юм.
            </p>
          </div>
        </section>
        <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            Админууд болон Томчуудад
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <h4 className="font-black text-[11px] mb-2 uppercase tracking-tighter">
                Шинж тэмдгийг ажиглах:
              </h4>
              <p className="text-[10px] font-bold text-slate-500 leading-tight italic">
                Хичээлээ таслах, зан ааш нь өөрчлөгдөх, бие дээрээ шарх сорвитой
                болох, эд зүйлсээ алдах.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <h4 className="font-black text-[11px] mb-2 uppercase tracking-tighter">
                Яаж туслах вэ?
              </h4>
              <p className="text-[10px] font-bold text-slate-500 leading-tight italic">
                Хүүхдээ шүүмжлэлгүйгээр сонс. "Энэ чиний буруу биш" гэдгийг
                байнга хэлж, хамгаалалттай гэдгийг нь мэдрүүл.
              </p>
            </div>
          </div>
        </section>

        <footer className="text-center py-6 border-t border-slate-200">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4">
            SafeSpace Mongolia 2026
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/"
              className="text-[10px] font-black text-indigo-500 uppercase tracking-widest"
            >
              Нүүр хуудас
            </Link>
            <Link
              href="/yar"
              className="text-[10px] font-black text-red-500 uppercase tracking-widest"
            >
              Тусламж авах
            </Link>
          </div>
        </footer>
      </div>

      <style jsx>{`
        section {
          animation: fadeInUp 0.6s ease-out both;
        }
        section:nth-child(2) {
          animation-delay: 0.1s;
        }
        section:nth-child(3) {
          animation-delay: 0.2s;
        }
        section:nth-child(4) {
          animation-delay: 0.3s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
