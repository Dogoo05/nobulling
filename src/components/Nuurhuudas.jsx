import Link from "next/link";
// Санамж: Хэрэв чи 'yar.js' хуудас руу үсрэх гэж байгаа бол заавал YarPage-ийг энд import хийх шаардлагагүй.
// Next.js-ийн Link href="/yar" гэхэд л хангалттай.

export default function Nuurhuudas() {
  const symptoms = [
    "Найз нөхдөөсөө хөндийрөх",
    "Сэтгэл санаа тогтворгүй болох",
    "Хичээлдээ явах дургүй болох",
    "Өөрийгөө буруутгах мэдрэмж",
  ];

  return (
    <div className="bg-white text-[#1A1A1A] font-sans selection:bg-[#F79434]/30 overflow-x-hidden">
      {/* --- 🚨 ЯАРАЛТАЙ ТУСЛАМЖ ТОГТМОЛ ТОВЧЛУУР (Floating) --- */}
      <Link href="/yar">
        <div className="fixed bottom-6 right-6 z-[100] group cursor-pointer">
          <button className="w-16 h-16 bg-red-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl animate-bounce border-4 border-white">
            🚨
          </button>
        </div>
      </Link>

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 md:pt-24 pb-16 md:pb-24 flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        <div className="absolute top-0 -left-10 md:-left-20 w-48 h-48 md:w-72 md:h-72 bg-[#2D4999] opacity-[0.03] rounded-full blur-3xl"></div>

        <div className="relative z-10 order-2 md:order-1 text-center md:text-left">
          <span className="inline-block py-1 px-4 rounded-full bg-[#2D4999]/10 text-[#2D4999] text-xs md:text-sm font-bold mb-4 md:mb-6">
            Бид хамтдаа хүчтэй 🤝
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] text-[#2D4999]">
            Чи ганцаараа <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D4999] to-[#F79434]">
              биш.
            </span>
          </h1>
          <p className="mt-6 md:mt-8 text-base md:text-xl text-gray-500 leading-relaxed max-w-lg mx-auto md:mx-0">
            Дээрэлхэлтийн эсрэг нэгдэж, бие биедээ тусалъя. Тусламж авах нь
            хамгийн зөв бөгөөд зоригтой алхам юм.
          </p>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row justify-center md:justify-start gap-4 md:gap-5 px-4 sm:px-0">
            <Link
              href="/asuult"
              className="bg-[#2D4999] text-white px-8 md:px-10 py-4 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all text-center"
            >
              Тусламж хүсэх
            </Link>

            <Link
              href="/yar"
              className="bg-red-600 text-white px-8 md:px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-red-700 hover:-translate-y-1 transition-all text-center"
            >
              🚨 ЯАРАЛТАЙ ТУСЛАМЖ
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2 relative group w-full max-w-md mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#F79434] to-[#2D4999] rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white p-2 md:p-3 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <img
              src="https://cccp.gov.mn/images/content/fc6e0f71b6eba7f6034b4fd9ab5974d8.png"
              alt="Together"
              className="w-full h-auto object-cover rounded-[2rem] transform group-hover:scale-105 transition duration-700"
            />
          </div>
        </div>
      </section>

      {/* --- INFO SECTION --- */}
      <section id="learn-more" className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D4999] mb-4 md:mb-6">
              Дээрэлхэлт гэж юу вэ?
            </h2>
            <div className="w-20 md:w-24 h-1.5 bg-[#F79434] mx-auto rounded-full mb-6 md:mb-8"></div>
            <p className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-gray-600 italic px-2">
              "Энэ бол хэн нэгнийг санаатайгаар, давтан үйлдлээр гомдоох,
              айлгах, гадуурхах үйлдэл юм. Үүнд бие махбод болон сэтгэл санааны
              бүх дарамт орно."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Сэтгэлзүйн",
                desc: "Доромжлох, гадуурхах, худлаа цуу яриа тараах.",
                icon: "🗣️",
                color: "border-[#F79434]",
              },
              {
                title: "Бие махбодын",
                desc: "Цохих, түлхэх, эд зүйлсийг нь эвдэх.",
                icon: "👊",
                color: "border-[#2D4999]",
              },
              {
                title: "Цахим",
                desc: "Сошиал сувгаар дарамтлах, нууц задрах.",
                icon: "📱",
                color: "border-[#5AC8FA]",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-[2rem] border-t-8 ${item.color} shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-xl mb-3 text-[#2D4999]">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SYMPTOMS SECTION --- */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-[#2D4999]">
          Анхаарах шинж тэмдгүүд
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {symptoms.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="w-3 h-3 bg-[#F79434] rounded-full"></div>
              <span className="font-semibold text-gray-700 text-sm">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- ACTION CARDS --- */}
      <section className="bg-gradient-to-br from-[#2D4999] to-[#1e326b] py-16 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-[#F79434] inline-block"></span> Хэрэв
              чи өртсөн бол:
            </h3>
            <ul className="space-y-4">
              <li>✓ Итгэдэг хүндээ заавал хэлээрэй.</li>
              <li>✓ Өөрийгөө битгий буруутга.</li>
              <li>✓ Ганцаараа битгий бай.</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#F79434] to-[#ffab5a] p-8 rounded-[2rem] text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-white inline-block"></span> Хэрэв чи
              харсан бол:
            </h3>
            <ul className="space-y-4">
              <li>● Үл тоож болохгүй.</li>
              <li>● Найзыгаа дэмжиж хамт бай.</li>
              <li>● Багш, эцэг эхэд мэдэгд.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-black text-xl text-[#2D4999] uppercase">
            Anti-Bullying
          </p>
          <p className="mt-4 text-gray-400 text-xs">
            © 2026. Сайн үйлс бүхэн дэлгэрэх болтугай.
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <Link href="/yar" className="text-xs font-black text-red-600">
              🚨 ЯАРАЛТАЙ
            </Link>
            <Link href="#" className="text-xs font-black text-gray-500">
              ПРОФАЙЛ
            </Link>
            <Link href="#" className="text-xs font-black text-gray-500">
              МЭДЭЭЛЭЛ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
