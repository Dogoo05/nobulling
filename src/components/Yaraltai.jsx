import { useState } from "react";

export default function Yaraltai() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submittedId, setSubmittedId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
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

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSOS = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Тайлбар хэсгийг бөглөнө үү.");
      return;
    }

    setLoading(true);
    try {
      let imgData = "";
      if (file) imgData = await processImage(file);

      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: { төрөл: "🚨 ЯАРАЛТАЙ SOS" },
          description: description,
          imageUrl: imgData,
          isUrgent: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedId(data.customId);
      } else {
        alert("Алдаа гарлаа: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl text-center border-2 border-slate-50 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-pulse">
            🚨
          </div>
          <h2 className="text-2xl font-black mb-2 text-slate-800 uppercase italic tracking-tighter">
            ДОХИО ХҮЛЭЭН АВЛАА!
          </h2>
          <p className="text-slate-400 mb-8 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
            Таны мэдээлэл нууцлагдсан. <br /> Доорх код дээр дарж хуулж авна уу:
          </p>

          <div
            onClick={() => handleCopy(submittedId)}
            className={`p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-2 ${
              isCopied
                ? "bg-green-50 border-green-500 shadow-xl shadow-green-100"
                : "bg-red-50 border-red-200 hover:bg-red-100/50 hover:border-red-400"
            }`}
          >
            <code
              className={`text-2xl font-black tracking-widest transition-colors duration-300 ${
                isCopied ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCopied ? "ХУУЛАГДЛАА ✅" : submittedId}
            </code>
            <span
              className={`text-[9px] font-black uppercase tracking-widest ${isCopied ? "text-green-400" : "text-red-300"}`}
            >
              {isCopied ? "Амжилттай хадгалагдлаа" : "ДАРЖ ХУУЛЖ АВАХ"}
            </span>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            НҮҮР ХУУДАС РУУ БУЦАХ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] py-12 px-4">
      <div className="max-w-md mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl border border-red-50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 animate-bounce">
            🆘
          </div>
          <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter italic leading-none">
            Яаралтай тусламж
          </h2>
          <p className="text-[10px] text-gray-400 font-bold mt-3 uppercase tracking-[0.2em] opacity-60">
            Мэдээллийн аюулгүй байдал 100%
          </p>
        </div>

        <form onSubmit={handleSOS} className="space-y-5">
          <div className="relative">
            <textarea
              className="w-full h-48 p-6 bg-slate-50 border-2 border-transparent focus:border-red-500 rounded-[2rem] outline-none transition-all font-bold text-sm text-black resize-none placeholder:text-slate-300 shadow-inner"
              placeholder="Яг одоо юу тохиолдоод байна вэ? Бидэнд итгэж бүхнээ бичээрэй..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="bg-red-50/40 p-6 rounded-[2rem] border-2 border-dashed border-red-100 group hover:border-red-300 transition-colors">
            <p className="text-[9px] font-black text-red-400 uppercase mb-4 ml-1 tracking-widest flex items-center gap-2">
              <span>📸</span> Зураг хавсаргах (заавал биш)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:bg-red-600 file:text-white file:font-black file:uppercase file:text-[9px] cursor-pointer"
            />
            {preview && (
              <div className="mt-5 relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg animate-in fade-in zoom-in">
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
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-md hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 disabled:grayscale disabled:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
                ИЛГЭЭЖ БАЙНА...
              </span>
            ) : (
              "🚀 ДОХИО ИЛГЭЭХ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
