// import { useEffect, useState } from "react";

// export default function Manager() {
//   const [answers, setAnswers] = useState([]);

//   useEffect(() => {
//     const fetchAnswers = async () => {
//       try {
//         const res = await fetch("/api/answers");
//         const data = await res.json();
//         if (data.success) setAnswers(data.data.reverse());
//       } catch (err) {
//         console.log(err);
//         alert("Алдаа гарлаа");
//       }
//     };

//     fetchAnswers();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#fef3c7] p-10">
//       <h1 className="text-3xl font-bold text-[#2D4999] mb-6">👁‍🗨 Бүх хариулт</h1>

//       {answers.length === 0 && <p>Одоогоор өгөгдөл байхгүй байна</p>}

//       <div className="flex flex-col gap-4">
//         {answers.map((item) => (
//           <div key={item.id} className="bg-white p-4 rounded-xl shadow-md">
//             <p className="text-sm text-gray-500 mb-2">
//               ID: {item.id} | {item.username}
//             </p>
//             {Object.entries(item.answers).map(([qId, ans]) => (
//               <div key={qId}>
//                 {qId}. {ans}
//               </div>
//             ))}
//             {item.imageUrl && (
//               <img
//                 src={item.imageUrl}
//                 alt="Uploaded"
//                 className="w-32 h-32 object-cover rounded-lg mt-2"
//               />
//             )}
//             <p className="text-xs text-gray-400 mt-2">
//               {new Date(item.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
