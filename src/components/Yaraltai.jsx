import { useState } from "react";
import Link from "next/link";

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
    if (!description.trim()) return alert("Тайлбар бичнэ үү.");

    setLoading(true);
    try {
      let imgData = "";
      if (file) imgData = await processImage(file);

      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
      const randomStr = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
      const sosId = `SOS-${dateStr}-${randomStr}`;

      const res = await fetch("/api/huselt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customId: sosId,
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
        alert("Алдаа: " + data.error);
      }
    } catch (error) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFDFF]">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl text-center border-2 border-slate-50">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-pulse">
            🚨
          </div>
          <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter text-slate-800">
            ДОХИО ХҮЛЭЭН АВЛАА!
          </h2>
          <p className="text-slate-400 mb-8 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
            Таны код дээр дарж хуулж авна уу:
          </p>
          <div
            onClick={() => handleCopy(submittedId)}
            className={`p-8 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer ${isCopied ? "bg-green-50 border-green-500" : "bg-red-50 border-red-200"}`}
          >
            <code
              className={`text-2xl font-black tracking-widest ${isCopied ? "text-green-600" : "text-red-600"}`}
            >
              {isCopied ? "ХУУЛАГДЛАА ✅" : submittedId}
            </code>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest"
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
          <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter italic">
            Яаралтай тусламж
          </h2>
          <p className="text-[10px] text-gray-400 font-bold mt-3 uppercase tracking-widest opacity-60">
            Мэдээллийн аюулгүй байдал 100%
          </p>
        </div>
        <form onSubmit={handleSOS} className="space-y-5">
          <textarea
            className="w-full h-48 p-6 bg-slate-50 border-2 border-transparent focus:border-red-500 rounded-[2rem] outline-none font-bold text-sm resize-none"
            placeholder="Юу тохиолдоод байна вэ? Бидэнд итгэж бичээрэй..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="bg-red-50/40 p-6 rounded-[2rem] border-2 border-dashed border-red-100 transition-colors">
            <p className="text-[9px] font-black text-red-400 uppercase mb-4 tracking-widest">
              📸 Зураг хавсаргах (заавал биш)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-[10px] file:py-2 file:px-6 file:rounded-xl file:border-0 file:bg-red-600 file:text-white file:font-black uppercase cursor-pointer"
            />
            {preview && (
              <div className="mt-5 relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
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
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-red-200"
          >
            {loading ? "ИЛГЭЭЖ БАЙНА..." : "🚀 ДОХИО ИЛГЭЭХ"}
          </button>
        </form>
      </div>
    </div>
  );
}
