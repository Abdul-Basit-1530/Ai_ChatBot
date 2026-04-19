import React from 'react';
import { Plus, MessageSquare, Settings, User, Trash2, LayoutDashboard, X } from 'lucide-react';

const Sidebar = ({ history = [], onSelectConversation, onNewChat, onDeleteConversation, activeId, onClose }) => {
  
  const categorizeHistory = () => {
    const today = [];
    const previous = [];
    const now = new Date();
    
    history.forEach(chat => {
      const chatDate = new Date(chat.updatedAt);
      const diffDays = Math.floor((now - chatDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) today.push(chat);
      else previous.push(chat);
    });
    
    return { today, previous };
  };

  const { today, previous } = categorizeHistory();

  return (
    <aside className="glass" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      gap: '1.5rem',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--accent-gradient)', 
            padding: '6px', 
            borderRadius: '8px',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' 
          }}>
            <LayoutDashboard size={20} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>Dashboard</span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'none' // Default hidden, shown via media query or inline check
          }}
          className="mobile-close-btn"
        >
          <X size={20} />
        </button>
      </div>

      <button 
        onClick={onNewChat}
        className="glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '0.85rem',
          borderRadius: '12px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.2s',
          border: '1px solid var(--border-active)',
          background: 'rgba(139, 92, 246, 0.1)',
          fontWeight: '600'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
      >
        <Plus size={20} />
        <span>New Conversation</span>
      </button>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '4px' }}>
        {today.length > 0 && (
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>Today</p>
            {today.map(chat => renderChatItem(chat, activeId, onSelectConversation, onDeleteConversation))}
          </div>
        )}

        {previous.length > 0 && (
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>Previous Sessions</p>
            {previous.map(chat => renderChatItem(chat, activeId, onSelectConversation, onDeleteConversation))}
          </div>
        )}

        {history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <MessageSquare size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>Your AI journey starts here.</p>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)' }}>
            <User size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Abdul Basit</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pro Account</span>
          </div>
          <Settings size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-close-btn { display: flex !important; }
        }
      `}</style>
    </aside>
  );
};

const renderChatItem = (chat, activeId, onSelectConversation, onDeleteConversation) => {
  const isActive = activeId === chat._id;
  return (
    <div 
      key={chat._id}
      onClick={() => onSelectConversation(chat._id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem',
        borderRadius: '10px',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        transition: 'all 0.2s',
        background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
        border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
        marginBottom: '4px'
      }}
      onMouseOver={(e) => {
        if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
      }}
      onMouseOut={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', flex: 1 }}>
        <MessageSquare size={14} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: isActive ? '600' : '400' }}>
          {chat.title}
        </span>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDeleteConversation(chat._id);
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          opacity: 0,
          transition: 'opacity 0.2s'
        }}
        className="delete-btn"
      >
        <Trash2 size={14} />
      </button>
      <style>{`
        div:hover .delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default Sidebar;
