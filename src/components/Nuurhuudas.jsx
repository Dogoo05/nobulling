import Link from "next/link";

export default function Nuurhuudas() {
  const symptoms = [
    "Найз нөхдөөсөө хөндийрөх",
    "Сэтгэл санаа тогтворгүй болох",
    "Хичээлдээ явах дургүй болох",
    "Өөрийгөө буруутгах мэдрэмж",
  ];

  return (
    <div className="bg-white text-[#1A1A1A] font-sans selection:bg-[#F79434]/30 overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 md:pt-24 pb-16 md:pb-24 flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        {/* Арын чимэглэл blur - Mobile дээр жижигсэв */}
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
              className="group relative bg-[#2D4999] text-white px-8 md:px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center"
            >
              Тусламж хүсэх
              <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <Link
              href="#learn-more"
              className="bg-white border-2 border-gray-100 text-gray-600 px-8 md:px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 text-center"
            >
              Мэдээлэл авах
            </Link>
          </div>
        </div>

        {/* Зургийн хэсэг - Хэмжээг нь автоматаар тохируулдаг болгосон */}
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
                className={`bg-white p-8 md:p-10 rounded-[2rem] border-t-8 ${item.color} shadow-sm hover:shadow-xl transition-shadow duration-300`}
              >
                <span className="text-3xl md:text-4xl mb-4 md:mb-6 block">
                  {item.icon}
                </span>
                <h3 className="font-bold text-xl mb-3 text-[#2D4999]">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SYMPTOMS SECTION --- */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 md:mb-16 text-[#2D4999]">
          Анхаарах шинж тэмдгүүд
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {symptoms.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 md:gap-5 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#F79434]/50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-[#F79434]/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 md:w-3 h-2.5 md:h-3 bg-[#F79434] rounded-full"></div>
              </div>
              <span className="font-semibold text-gray-700 text-left text-sm md:text-base">
                {s}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* --- ACTION CARDS --- */}
      <section className="bg-gradient-to-br from-[#2D4999] to-[#1e326b] py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-white/20">
            <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-white">
              <span className="w-6 md:w-8 h-1 bg-[#F79434] inline-block"></span>{" "}
              Хэрэв чи өртсөн бол:
            </h3>
            <ul className="space-y-4 md:space-y-5 text-base md:text-lg">
              {[
                "Итгэдэг хүндээ заавал хэлээрэй.",
                "Өөрийгөө битгий буруутга.",
                "Ганцаараа битгий бай.",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 opacity-90 text-white"
                >
                  <span className="text-[#F79434]">✓</span> {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#F79434] to-[#ffab5a] p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-white">
              <span className="w-6 md:w-8 h-1 bg-white inline-block"></span>{" "}
              Хэрэв чи харсан бол:
            </h3>
            <ul className="space-y-4 md:space-y-5 text-base md:text-lg">
              {[
                "Үл тоож болохгүй.",
                "Найзыгаа дэмжиж хамт бай.",
                "Багш, эцэг эхэд мэдэгд.",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-white font-medium"
                >
                  <span>●</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 md:py-16 text-center bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-10 md:mb-12"></div>
          <p className="font-black text-xl md:text-2xl text-[#2D4999] tracking-tight uppercase">
            Anti-Bullying
          </p>
          <p className="mt-4 text-gray-400 text-[10px] md:text-sm">
            © 2026. Сайн үйлс бүхэн дэлгэрэх болтугай.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-10">
            {["ТУСЛАМЖ АВАХ", "ПРОФАЙЛ", "МЭДЭЭЛЭЛ"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[10px] md:text-xs font-black tracking-widest text-gray-500 hover:text-[#2D4999] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
