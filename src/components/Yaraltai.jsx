import { useState } from "react";

export default function Yaraltai() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submittedId, setSubmittedId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Файл сонгох
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Зургийг жижигсгэж боловсруулах
  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Хуулах үйлдэл
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // SOS илгээх
  const handleSOS = async (e) => {
    e.preventDefault();
    if (!description.trim()) return; // Validation text-ээр гаргаж болно

    setLoading(true);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const finalId = `SOS-${dateStr}-${randomPart}`;

    try {
      let imgData = "";
      if (file) imgData = await processImage(file);

      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customId: finalId,
          description: description,
          imageUrl: imgData,
          isUrgent: true,
          status: "Хүлээгдэж буй",
          createdAt: new Date(),
        }),
      });

      if (res.ok) {
        setSubmittedId(finalId);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-[3rem] shadow-2xl text-center border-2 border-slate-50 mt-10 animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
          🚨
        </div>
        <h2 className="text-xl font-black mb-2 text-slate-800 uppercase italic tracking-tighter">
          Хүлээн авлаа!
        </h2>
        <p className="text-slate-400 mb-4 font-bold text-[9px] uppercase tracking-widest">
          Доорх код дээр дарж хуулж авна уу:
        </p>

        {/* --- КОДЫН ХЭСЭГ: Ногоон болох эффект --- */}
        <div
          onClick={() => handleCopy(submittedId)}
          className={`p-6 rounded-[2rem] border-2 border-dashed transition-all duration-300 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-2 ${
            isCopied
              ? "bg-green-50 border-green-500 shadow-lg shadow-green-100"
              : "bg-red-50 border-red-200 hover:bg-red-100/50"
          }`}
        >
          <code
            className={`text-2xl font-black tracking-widest transition-colors duration-300 ${
              isCopied ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCopied ? "ХУУЛАГДЛАА" : submittedId}
          </code>

          <span
            className={`text-[8px] font-black uppercase tracking-tighter transition-colors ${
              isCopied ? "text-green-400" : "text-red-300"
            }`}
          >
            {isCopied ? "Амжилттай хадгалагдлаа ✅" : "Дарж хуулж авах"}
          </span>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => {
              setSubmittedId("");
              setDescription("");
              setFile(null);
              setPreview(null);
            }}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
          >
            ХААХ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-[2.5rem] shadow-2xl border border-red-50 mt-10">
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-red-600 uppercase tracking-tighter italic leading-none">
          🚨 Яаралтай тусламж
        </h2>
        <p className="text-[9px] text-gray-300 font-black mt-2 uppercase tracking-widest">
          Мэдээлэл нууц байна
        </p>
      </div>

      <form onSubmit={handleSOS} className="space-y-4">
        <textarea
          className="w-full h-44 p-5 bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-[1.5rem] outline-none transition-all font-bold text-xs text-black resize-none"
          placeholder="Тусламж хэрэгтэй зүйлээ энд бичнэ үү..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="bg-red-50/30 p-5 rounded-[1.5rem] border-2 border-dashed border-red-50">
          <p className="text-[8px] font-black text-red-300 uppercase mb-3 ml-1 tracking-widest">
            Зураг хавсаргах (заавал биш)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-[9px] text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-red-600 file:text-white file:font-black cursor-pointer"
          />
          {preview && (
            <div className="mt-4 relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95 disabled:grayscale"
        >
          {loading ? "ИЛГЭЭЖ БАЙНА..." : "🚀 ДОХИО ИЛГЭЭХ"}
        </button>
      </form>
    </div>
  );
}
