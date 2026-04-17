import React from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ onSend, loading }) => {
  const [value, setValue] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !loading) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <div style={{
      padding: '2rem 1.5rem',
      background: 'linear-gradient(to top, var(--bg-deep) 60%, transparent)',
      position: 'relative'
    }}>
      <form 
        onSubmit={handleSubmit}
        className="glass-heavy"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0.75rem 1rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Message AI..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            lineHeight: '1.5',
            paddingRight: '3rem',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />
        
        <button 
          type="submit"
          disabled={!value.trim() || loading}
          style={{
            position: 'absolute',
            right: '0.75rem',
            bottom: '0.75rem',
            background: value.trim() && !loading ? 'var(--accent-gradient)' : 'transparent',
            color: value.trim() && !loading ? 'white' : 'var(--text-muted)',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: value.trim() && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            zIndex: 5
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </form>
      <p style={{ 
        textAlign: 'center', 
        fontSize: '0.75rem', 
        color: 'var(--text-muted)', 
        marginTop: '0.75rem' 
      }}>
        AI may display inaccurate info, so double-check its responses.
      </p>
    </div>
  );
};

export default ChatInput;
