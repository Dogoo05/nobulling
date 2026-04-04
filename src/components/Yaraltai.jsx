import { useState } from "react";

export default function Yaraltai() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submittedId, setSubmittedId] = useState(""); // Илгээсэн ID-г хадгалах

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

  const handleSOS = async (e) => {
    e.preventDefault();
    if (!description.trim()) return alert("Тайлбар бичнэ үү!");

    setLoading(true);
    // ID үүсгэх: SOS-ОГНОО-САНАМСАРГҮЙ_ТОО
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
        setSubmittedId(finalId); // Амжилттай болбол ID-г харуулна
      } else {
        const errorData = await res.json();
        alert(`Алдаа: ${errorData.error || "Илгээхэд алдаа гарлаа"}`);
      }
    } catch (error) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  // Хэрэв ID үүссэн бол (Амжилттай илгээгдсэн бол) дараахыг харуулна:
  if (submittedId) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-[3rem] shadow-2xl text-center border-2 border-red-100 animate-in zoom-in duration-300 my-10">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-bounce">
          🚨
        </div>
        <h2 className="text-2xl font-black mb-2 text-red-600 uppercase italic">
          Илгээгдлээ!
        </h2>
        <p className="text-slate-400 mb-2 font-bold text-[10px] uppercase tracking-widest">
          Таны SOS код:
        </p>

        <div className="p-6 bg-red-50 rounded-3xl border-2 border-dashed border-red-200 mb-8">
          <code className="text-2xl font-black tracking-widest block text-red-600">
            {submittedId}
          </code>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(submittedId);
            alert("Код хуулагдлаа! Үүнийг хадгалж аваад хариугаа шалгаарай.");
          }}
          className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest mb-3 shadow-lg shadow-red-100"
        >
          📋 КОД ХУУЛАХ
        </button>

        <button
          onClick={() => {
            setSubmittedId("");
            setDescription("");
            setFile(null);
            setPreview(null);
          }}
          className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest"
        >
          ХААХ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-[2.5rem] shadow-2xl border border-red-50 my-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter italic">
          🚨 Яаралтай тусламж
        </h2>
        <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">
          Таны мэдээлэл нууц байна
        </p>
      </div>

      <form onSubmit={handleSOS} className="space-y-6">
        <textarea
          className="w-full h-40 p-6 bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-[1.5rem] outline-none transition-all font-bold text-sm text-black resize-none"
          placeholder="Тусламж хэрэгтэй байгаа зүйлээ энд бичнэ үү..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="bg-red-50/50 p-6 rounded-[2rem] border-2 border-dashed border-red-100">
          <p className="text-[10px] font-black text-red-400 uppercase mb-4 ml-2">
            Зураг хавсаргах (заавал биш)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-[10px] text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-red-600 file:text-white file:font-black cursor-pointer"
          />
          {preview && (
            <div className="mt-4 relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-md">
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
          className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "ИЛГЭЭЖ БАЙНА..." : "🚀 ДОХИО ИЛГЭЭХ"}
        </button>
      </form>
    </div>
  );
}
