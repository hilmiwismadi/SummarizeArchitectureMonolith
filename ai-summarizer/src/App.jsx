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

    setSummary("");
    setLoading(true);

    try {
      // For testing without AI, let's create a simple summary
      const testSummary = `Test summary for: "${inputText.substring(0, 50)}${inputText.length > 50 ? '...' : ''}"`;
      
      // Save to backend
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          inputText,
          summaryText: testSummary,
          modelUsed: model,
        }),
      });

      if (response.ok) {
        const newSummary = await response.json();
        setSummary(newSummary.summaryText);
        
        // Refresh history
        fetchHistory();
      } else {
        throw new Error('Failed to save summary');
      }
    } catch (error) {
      console.error("Failed to create summary:", error);
      alert("Failed to create summary. Please try again.");
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