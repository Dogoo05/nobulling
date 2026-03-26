const handleSubmit = async () => {
  if (!questions.every((q) => answers[q.id])) {
    return alert("Бүх асуултыг бөглөнө үү!");
  }

  setLoading(true);

  try {
    const userStr = localStorage.getItem("user");
    const parsedUser = userStr
      ? JSON.parse(userStr)
      : { username: "Anonymous" };

    // АНХААР: Энд байгаа "/api/answers" гэдэг замыг өөрийн файлын нэртэй тааруул!
    const response = await fetch("/api/answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: parsedUser.username,
        answers: answers, // { 1: "Бага сургууль", 2: "Сургууль" ... }
        imageUrl: "", // Хэрэв зураг байхгүй бол хоосон явуулна
      }),
    });

    const result = await response.json();

    if (result.success) {
      setSuccess(true);
    } else {
      console.error("Сервер алдаа:", result);
      alert("Илгээхэд алдаа гарлаа: " + (result.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Холболтын алдаа:", error);
    alert("Сервертэй холбогдож чадсангүй.");
  } finally {
    setLoading(false);
  }
};
