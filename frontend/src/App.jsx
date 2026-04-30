import { useState, useRef, useEffect } from "react";
import { askAI, getHistory, getConversation, deleteConversation } from "./services/aiService";
import Sidebar from "./components/Sidebar";
import Message from "./components/Message";
import ChatInput from "./components/ChatInput";
import { Sparkles, Bot, Menu, PanelLeftClose, PanelLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed for better mobile safety
  
  useEffect(() => {
    // Only auto-open on larger desktops
    if (window.innerWidth > 1024) setIsSidebarOpen(true);
  }, []);
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
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
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
    const userMessage = { 
      role: "user", 
      content, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await askAI(content, activeId);
      const aiMessage = { 
        role: "ai", 
        content: result.reply, 
        animate: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
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
    <div style={{ display: "flex", width: "100%", height: "100vh", position: "relative" }}>
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`} style={{
        // Desktop expansion is handled here, mobile positioning is handled in index.css
        width: isSidebarOpen ? 'var(--sidebar-width)' : (window.innerWidth <= 768 ? '85%' : '0'),
        maxWidth: window.innerWidth <= 768 ? '300px' : 'none',
        overflow: 'hidden'
      }}>
        <Sidebar
          history={history}
          activeId={activeId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div 
        className={`mobile-overlay ${isSidebarOpen && window.innerWidth <= 768 ? 'visible' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <main className="main-content">
        <header className="glass" style={{
          height: "var(--header-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          zIndex: 5
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.2s"
              }}
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSidebarOpen ? "open" : "closed"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              borderRadius: "6px",
              background: "rgba(139, 92, 246, 0.1)",
              boxShadow: "0 0 12px rgba(139, 92, 246, 0.2)"
            }}>
              <Sparkles size={20} color="var(--accent-primary)" />
            </div>
            <h2 className="logo-text" style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--text-primary)" }}>ThinkFlow</h2>
          </div>
        </div>
        <div className="header-status" style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>
          {activeId || messages.length > 0 ? "Active Session" : "New Chat"}
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
                Ask me anything 
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <Message 
                key={index} 
                role={msg.role} 
                content={msg.content} 
                animate={msg.animate}
                timestamp={msg.timestamp}
              />
            ))
          )}

          {loading && (
            <div style={{ padding: "1.5rem", display: "flex", gap: "1rem", opacity: 0.8 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--accent-gradient)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
              }}>
                <Bot size={18} />
              </div>
              <div style={{ 
                background: 'var(--bg-surface)', 
                padding: '0.75rem 1rem', 
                borderRadius: '12px',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: 'fit-content',
                marginTop: '4px'
              }}>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
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

