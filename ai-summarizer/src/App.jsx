import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Header from "./components/Header";
import Summarizer from "./components/Summarizer";
import History from "./components/History";
import Register from "./pages/Register";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const MainApp = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324:free");
  const [loading, setLoading] = useState(false);

  const { user, logout, API_BASE_URL } = useAuth();

  // Fetch user's summary history from backend
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/summaries`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const summaries = await response.json();
        setHistory(summaries);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

 const handleSummarize = async () => {
  if (inputText.trim() === "") return;

  console.log("🚀 Starting summarize process...");
  console.log("📝 Input text:", inputText.substring(0, 100) + "...");
  console.log("🤖 Model:", model);
  console.log("🔑 API Key available:", !!import.meta.env.VITE_OPENROUTER_API_KEY);

  setSummary("");
  setLoading(true);

  try {
    // Panggil AI OpenRouter untuk generate summary
    console.log("📡 Calling OpenRouter API...");
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: "user",
          content: `Summarize the following text without any addition answer. Answer in the language the user speaks:\n${inputText}`,
        },
      ],
    };
    
    console.log("📦 Request body:", requestBody);

    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Text Summarizer App",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("✅ AI Response status:", aiResponse.status);
    console.log("🔍 AI Response headers:", Object.fromEntries(aiResponse.headers.entries()));

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("❌ AI API Error:", aiResponse.status, aiResponse.statusText);
      console.error("❌ Error details:", errorText);
      throw new Error(`AI API Error: ${aiResponse.status} ${aiResponse.statusText} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log("📨 Full AI Response:", aiData);
    
    // Validasi response AI
    if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
      console.error("❌ Invalid AI response structure:", aiData);
      throw new Error('Invalid AI response format');
    }
    
    const aiSummary = aiData.choices[0].message.content;
    console.log("📝 AI Summary received:", aiSummary);

    // Simpan ke backend
    console.log("💾 Saving to backend...");
    const backendResponse = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        inputText,
        summaryText: aiSummary,
        modelUsed: model,
      }),
    });

    console.log("✅ Backend Response status:", backendResponse.status);

    if (!backendResponse.ok) {
      const backendErrorText = await backendResponse.text();
      console.error("❌ Backend Error:", backendResponse.status, backendResponse.statusText);
      console.error("❌ Backend Error details:", backendErrorText);
      throw new Error(`Backend Error: ${backendResponse.status} ${backendResponse.statusText}`);
    }

    const savedSummary = await backendResponse.json();
    console.log("💾 Backend Response:", savedSummary);
    
    // Set summary dari response backend atau AI
    const finalSummary = savedSummary.summaryText || aiSummary;
    console.log("🎯 Final summary to display:", finalSummary);
    setSummary(finalSummary);
    
    // Refresh history
    console.log("🔄 Refreshing history...");
    fetchHistory();
    
    console.log("✅ Summarize process completed successfully!");
    
  } catch (error) {
    console.error("❌ Summarize process failed:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Error handling yang lebih spesifik
    if (error.message.includes('AI API Error')) {
      alert("AI service is currently unavailable. Please try again later.");
    } else if (error.message.includes('Backend Error')) {
      alert("Failed to save summary to server. Please try again.");
    } else if (error.message.includes('Invalid AI response')) {
      alert("Received invalid response from AI. Please try again.");
    } else {
      alert("Failed to create summary. Please check your connection and try again.");
    }
  } finally {
    setLoading(false);
  }
};

  const handleReset = () => {
    setInputText("");
    setSummary("");
  };

  const handleDelete = async (summaryId) => {
    // For now, we'll just refresh the history since delete endpoint wasn't implemented
    // You can add a delete endpoint to your backend later
    console.log("Delete functionality not implemented yet for summary:", summaryId);
    // fetchHistory(); // Refresh after delete
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <Header 
        title="AI Summarizer" 
        user={user} 
        onLogout={handleLogout}
      />
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
        <History 
          history={history} 
          handleDelete={handleDelete}
          onRefresh={fetchHistory}
        />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;