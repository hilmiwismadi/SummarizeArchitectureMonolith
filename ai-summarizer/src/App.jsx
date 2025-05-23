import { useState, useEffect } from "react";
import Header from "./components/Header";
import Summarizer from "./components/Summarizer";
import History from "./components/History";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324:free");
  const [loading, setLoading] = useState(false);

  // Ambil riwayat dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("summaryHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const handleSummarize = async () => {
    if (inputText.trim() === "") return;

    setSummary("");
    setLoading(true);
    // Kirim teks ke API untuk diringkas
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: `Summarize the following text without any addition answer. Answer in the language the user speaks:\n${inputText}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      setSummary(data.choices[0].message.content);
      const newHistory = [...history, data.choices[0].message.content];
      setHistory(newHistory);
      localStorage.setItem("summaryHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Gagal mengambil data ringkasan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setSummary("");
  };

  const handleDelete = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("summaryHistory", JSON.stringify(newHistory));
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <Header title="AI Summarizer" />
      <main className="max-w-3xl mx-auto p-4">
        <Summarizer
          inputText={inputText}
          setInputText={setInputText}
          summary={summary}
          handleSummarize={handleSummarize}
          handleReset={handleReset}
          model={model}
          setModel={setModel}
          loading={loading}
        />
        <History history={history} handleDelete={handleDelete} />
      </main>
    </div>
  );
};

export default App;
