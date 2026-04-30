import React from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Message = ({ role, content, animate = false, timestamp }) => {
  const isAI = role === 'ai';
  const [copied, setCopied] = React.useState(false);
  const [displayedContent, setDisplayedContent] = React.useState(animate ? '' : content);
  const [isTyping, setIsTyping] = React.useState(animate);

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      // If it looks like an ISO string or a date object
      const date = new Date(ts);
      if (isNaN(date.getTime())) return ts; // Return as-is if fallback
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return ts;
    }
  };

  React.useEffect(() => {
    if (!animate) {
      setDisplayedContent(content);
      setIsTyping(false);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(content.slice(0, i));
      i++;
      if (i > content.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [content, animate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '1.25rem 1rem',
        backgroundColor: isAI ? 'var(--bg-surface)' : 'transparent',
        borderBottom: isAI ? '1px solid var(--border-glass)' : 'none',
        width: '100%',
        position: 'relative'
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: isAI ? 'var(--accent-gradient)' : 'var(--bg-glass)',
        color: 'white',
        boxShadow: isAI ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none'
      }}>
        {isAI ? <Bot size={18} /> : <User size={18} />}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: 'bold', 
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {isAI ? 'Assistant' : 'You'}
            </span>
            {timestamp && <span className="message-timestamp">{formatTime(timestamp)}</span>}
          </div>

          {isAI && (
            <button 
              onClick={() => handleCopy(content)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                touchAction: 'manipulation'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              <span className="logo-text">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>
        
        <div className="prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div style={{ position: 'relative', margin: '1rem 0' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '4px 12px',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-glass)',
                      borderBottom: 'none'
                    }}>
                      <span>{match[1].toUpperCase()}</span>
                      <button 
                        onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
                        style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '8px' }}
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                      customStyle={{
                        margin: 0,
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-glass)',
                        fontSize: '0.9rem'
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {displayedContent}
          </ReactMarkdown>
        </div>
      </div>

      {!isAI && (
        <button 
          onClick={() => handleCopy(content)}
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '12px 8px',
            borderRadius: '8px',
            transition: 'color 0.2s',
            marginTop: '1.25rem'
          }}
          title="Copy message"
        >
          {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
        </button>
      )}
    </motion.div>
  );
};

export default Message;
