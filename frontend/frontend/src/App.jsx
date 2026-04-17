import { useState, useRef, useEffect } from "react";
import { askAI, getHistory, getConversation, deleteConversation } from "./services/aiService";
import Sidebar from "./components/Sidebar";
import Message from "./components/Message";
import ChatInput from "./components/ChatInput";
import { Sparkles } from "lucide-react";

function App() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveId(null);
  };

  const handleSelectConversation = async (id) => {
    try {
      setLoading(true);
      const data = await getConversation(id);
      setActiveId(id);
      setMessages(data.messages);
    } catch (error) {
      console.error("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    const success = await deleteConversation(id);
    if (success) {
      if (activeId === id) handleNewChat();
      fetchHistory();
    }
  };

  const handleSend = async (content) => {
    const userMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await askAI(content, activeId);
      const aiMessage = { role: "ai", content: result.reply, animate: true };
      setMessages((prev) => [...prev, aiMessage]);

      setActiveId(result.conversationId);
      fetchHistory();
    } catch (error) {
      const errorMessage = { role: "ai", content: "Sorry, Internal Server Error. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <Sidebar
        history={history}
        activeId={activeId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "var(--bg-deep)"
      }}>
        <header className="glass" style={{
          height: "var(--header-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          zIndex: 5
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--text-primary)" }}>Mind AI</h2>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {activeId ? "Active Session" : "New Chat"}
          </div>
        </header>

        <div style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "2rem"
        }}>
          {messages.length === 0 ? (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              padding: "2rem"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: "var(--accent-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)"
              }}>
                <Sparkles size={40} color="white" />
              </div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "700", textAlign: "center", marginBottom: "0.5rem" }}>
                How can I help you today?
              </h1>
              <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "450px" }}>
                Ask me anything – your conversations are now automatically saved to MongoDB for later access.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <Message 
                key={index} 
                role={msg.role} 
                content={msg.content} 
                animate={msg.animate}
              />
            ))
          )}

          {loading && (
            <div style={{ padding: "1.5rem", display: "flex", gap: "1rem", opacity: 0.7 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--accent-gradient)',
                color: 'white'
              }}>
                <div className="animate-pulse" style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={handleSend} loading={loading} />
      </main>
    </div>
  );
}

export default App;

