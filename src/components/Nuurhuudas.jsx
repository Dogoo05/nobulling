import Link from "next/link";

export default function Nuurhuudas() {
  const symptoms = [
    "Найз нөхдөөсөө хөндийрөх",
    "Сэтгэл санаа тогтворгүй болох",
    "Хичээлдээ явах дургүй болох",
    "Өөрийгөө буруутгах мэдрэмж",
  ];

  return (
    <div className="bg-[#FFFFFF] text-[#1A1A1A] font-sans">
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-[#2D4999]">
            Чи ганцаараа биш. <br />
            Бид чамайг <span className="text-[#F79434]">сонсоход</span> бэлэн.
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-md">
            Дээрэлхэлтийн эсрэг нэгдэж, бие биедээ тусалъя. Тусламж авах нь
            хамгийн зөв бөгөөд зоригтой алхам юм.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/asuult"
              className="bg-[#2D4999] text-white px-10 py-4 rounded-full font-bold shadow-md hover:bg-[#1e326b] transition-all"
            >
              Тусламж хүсэх
            </Link>
            <Link
              href="#learn-more"
              className="border-2 border-gray-200 text-gray-600 px-10 py-4 rounded-full font-bold hover:bg-gray-50 transition-all"
            >
              Мэдээлэл авах
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative p-4">
            <div className="absolute inset-0 bg-[#F79434] rounded-[2rem] rotate-3 -z-10 opacity-10"></div>
            <img
              src="https://cccp.gov.mn/images/content/fc6e0f71b6eba7f6034b4fd9ab5974d8.png"
              alt="Together"
              className="w-full rounded-[2rem] border-2 border-[#2D4999]/10"
            />
          </div>
        </div>
      </section>
      <section id="learn-more" className="bg-[#F9FAFB] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold border-l-8 border-[#F79434] pl-6 text-[#2D4999]">
              Дээрэлхэлт гэж юу вэ?
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-gray-700 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              Энэ бол хэн нэгнийг санаатайгаар, давтан үйлдлээр гомдоох, айлгах,
              гадуурхах үйлдэл юм. Үүнд үг хэлээр доромжлох, бие махбодод
              халдах, цахимаар дарамтлах зэрэг бүх хэлбэр орно.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border-b-4 border-[#F79434] shadow-sm">
              <span className="text-3xl">🗣️</span>
              <h3 className="font-bold text-lg mt-4 mb-2">Сэтгэлзүйн</h3>
              <p className="text-sm text-gray-500">
                Доромжлох, гадуурхах, худлаа цуу яриа тараах.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-b-4 border-[#2D4999] shadow-sm">
              <span className="text-3xl">👊</span>
              <h3 className="font-bold text-lg mt-4 mb-2">Бие махбодын</h3>
              <p className="text-sm text-gray-500">
                Цохих, түлхэх, эд зүйлсийг нь эвдэх.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-b-4 border-[#5AC8FA] shadow-sm">
              <span className="text-3xl">📱</span>
              <h3 className="font-bold text-lg mt-4 mb-2">Цахим</h3>
              <p className="text-sm text-gray-500">
                Сошиал сувгаар дарамтлах, нууц задрах.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#2D4999]">
          Анхаарах шинжүүд
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {symptoms.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200"
            >
              <div className="w-3 h-3 bg-[#F79434] rounded-full"></div>
              <span className="font-medium text-gray-700">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- ACTION CARDS --- */}
      <section className="bg-[#2D4999] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 text-white">
          <div className="bg-white/10 backdrop-blur-sm p-10 rounded-[2rem] border border-white/20">
            <h3 className="text-2xl font-bold mb-6">Хэрэв чи өртсөн бол:</h3>
            <ul className="space-y-4 opacity-90">
              <li>• Итгэдэг хүндээ заавал хэлээрэй.</li>
              <li>• Өөрийгөө битгий буруутга.</li>
              <li>• Ганцаараа битгий бай.</li>
            </ul>
          </div>
          <div className="bg-[#F79434] p-10 rounded-[2rem] shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-white">
              Хэрэв чи харсан бол:
            </h3>
            <ul className="space-y-4 text-white/90 font-medium">
              <li>• Үл тоож болохгүй.</li>
              <li>• Найзыгаа дэмжиж хамт бай.</li>
              <li>• Багш, эцэг эхэд мэдэгд.</li>
            </ul>
          </div>
        </div>
      </section>
      <footer className="py-12 text-center border-t border-gray-100">
        <p className="font-bold text-[#2D4999]">Anti-Bullying Platform</p>
        <p className="mt-2 text-sm text-gray-400">
          © 2026. Бүх эрх хуулиар хамгаалагдсан.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-xs font-bold text-gray-500">
          <Link href="/asuult" className="hover:text-[#F79434]">
            ТУСЛАМЖ АВАХ
          </Link>
          <Link href="/profile" className="hover:text-[#F79434]">
            ПРОФАЙЛ
          </Link>
        </div>
      </footer>
    </div>
  );
}
