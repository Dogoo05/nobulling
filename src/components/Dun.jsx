import React, { useState, useEffect, useMemo } from "react";

export default function Dun() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/huselt");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Дата татахад алдаа гарлаа:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (data.length === 0)
      return {
        total: 0,
        femalePct: 0,
        malePct: 0,
        sosPct: 0,
        normalPct: 0,
        normalTotal: 0,
      };

    const total = data.length;
    const female = data.filter((i) =>
      i.answers?.[9]?.includes("Эмэгтэй"),
    ).length;
    const male = data.filter((i) => i.answers?.[9]?.includes("Эрэгтэй")).length;
    const genderTotal = female + male;

    const sosData = data.filter(
      (i) => i.isUrgent || i.answers?.[1]?.includes("🚨"),
    );
    const sos = sosData.length;

    const normalWithLevel = data.filter(
      (i) =>
        !(i.isUrgent || i.answers?.[1]?.includes("🚨")) &&
        (i.answers?.[3]?.includes("🔥") ||
          i.answers?.[3]?.includes("⚠️") ||
          i.answers?.[3]?.includes("⚖️")),
    );

    const normalTotal = normalWithLevel.length;
    const heavy = normalWithLevel.filter((i) =>
      i.answers?.[3]?.includes("🔥"),
    ).length;
    const medium = normalWithLevel.filter((i) =>
      i.answers?.[3]?.includes("⚠️"),
    ).length;
    const low = normalWithLevel.filter((i) =>
      i.answers?.[3]?.includes("⚖️"),
    ).length;

    return {
      total,
      normalTotal,
      female,
      male,
      sos,
      heavy,
      medium,
      low,
      femalePct: genderTotal > 0 ? Math.round((female / genderTotal) * 100) : 0,
      malePct: genderTotal > 0 ? Math.round((male / genderTotal) * 100) : 0,
      sosPct: total > 0 ? Math.round((sos / total) * 100) : 0,
      normalPct: total > 0 ? Math.round(((total - sos) / total) * 100) : 0,
    };
  }, [data]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center font-black text-slate-400 uppercase italic p-4 text-center">
        Уншиж байна...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* TOP STATUS CARDS - Утас дээр 2 багана */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 p-4 md:px-6 md:py-4 rounded-2xl shadow-sm">
            <p className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase mb-1">
              Нийт хүсэлт
            </p>
            <span className="text-indigo-600 text-lg md:text-xl font-black">
              {stats.total}
            </span>
          </div>
          <div className="bg-white border border-slate-100 p-4 md:px-6 md:py-4 rounded-2xl shadow-sm">
            <p className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase mb-1">
              Яаралтай
            </p>
            <span className="text-red-500 text-lg md:text-xl font-black">
              {stats.sos}
            </span>
          </div>
        </div>

        {/* 1. ҮР ДҮНГИЙН ТАРХАЛТ */}
        <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 border border-white">
          <h3 className="text-slate-900 font-black text-xs md:text-sm uppercase mb-6 md:mb-10 italic">
            Үр дүнгийн тархалт (Ердийн)
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 w-full">
            <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset={
                    251.2 -
                    (251.2 * (stats.heavy + stats.medium)) /
                      (stats.normalTotal || 1)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset={
                    251.2 - (251.2 * stats.heavy) / (stats.normalTotal || 1)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
                  {stats.normalTotal}
                </span>
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase mt-1 italic">
                  Ердийн
                </span>
              </div>
            </div>
            <div className="w-full space-y-4 md:space-y-6">
              {[
                {
                  label: "Маш хүнд",
                  count: stats.heavy,
                  color: "bg-red-500",
                  text: "text-red-500",
                },
                {
                  label: "Хүнд",
                  count: stats.medium,
                  color: "bg-orange-500",
                  text: "text-orange-500",
                },
                {
                  label: "Дунд",
                  count: stats.low,
                  color: "bg-emerald-500",
                  text: "text-emerald-500",
                },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] md:text-[11px] font-black uppercase">
                    <div className={`flex items-center gap-2 ${item.text}`}>
                      <div
                        className={`w-2 h-2 rounded-full ${item.color}`}
                      ></div>
                      {item.label}
                    </div>
                    <span className="text-slate-400">
                      {item.count} (
                      {stats.normalTotal > 0
                        ? Math.round((item.count / stats.normalTotal) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-1000`}
                      style={{
                        width: `${(item.count / (stats.normalTotal || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ДУНДАА ХУВААГДСАН 2 КАРТ - Утас дээр цуварна */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* 2. ХҮЙСЭЭР */}
          <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 border border-white flex flex-col items-center">
            <h3 className="text-slate-900 font-black text-xs md:text-sm uppercase mb-6 md:mb-10 self-start italic">
              Хүйсээр
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-10 w-full">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#EC4899"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * stats.femalePct) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 text-xl md:text-2xl">
                  {stats.female + stats.male}
                </div>
              </div>
              <div className="w-full space-y-4 md:space-y-6">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] md:text-[11px] font-black text-pink-500 uppercase">
                    <span>Эмэгтэй</span>
                    <span>{stats.femalePct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500"
                      style={{ width: `${stats.femalePct}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] md:text-[11px] font-black text-blue-500 uppercase">
                    <span>Эрэгтэй</span>
                    <span>{stats.malePct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${stats.malePct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. ХҮСЭЛТИЙН ТӨРӨЛ */}
          <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 border border-white flex flex-col items-center">
            <h3 className="text-slate-900 font-black text-xs md:text-sm uppercase mb-6 md:mb-10 self-start italic">
              Хүсэлтийн төрөл
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-10 w-full">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#6366F1"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#EF4444"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * stats.sosPct) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 text-xl md:text-2xl">
                  {stats.total}
                </div>
              </div>
              <div className="w-full space-y-4 md:space-y-6">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] md:text-[11px] font-black text-red-500 uppercase">
                    <span>🚨 SOS</span>
                    <span>{stats.sosPct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${stats.sosPct}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] md:text-[11px] font-black text-indigo-500 uppercase">
                    <span>📝 Ердийн</span>
                    <span>{stats.normalPct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${stats.normalPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
