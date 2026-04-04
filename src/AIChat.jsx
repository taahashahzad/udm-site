import { useState, useEffect, useRef } from "react";
import companyData from "./companyData.json";

// ─────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS:
// 1. Go to https://openrouter.ai and create a free account
// 2. Go to Keys → Create Key → copy your key
// 3. Create a file called .env in your project ROOT folder
//    (same level as package.json, NOT inside src/)
// 4. Add this line to .env:
//    VITE_OPENROUTER_KEY=your_key_here
// 5. Restart the dev server: npm run dev
// ─────────────────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_OPENROUTER_KEY;
const MODEL = "qwen/qwen3.6-plus:free"; // Free model on OpenRouter

// Build the system prompt from companyData.json automatically
const buildSystemPrompt = () => {
  const d = companyData;
  return `You are the AI assistant for ${d.company.name}, founded by ${d.company.founder} in ${d.company.established}.

ABOUT THE COMPANY:
${d.company.description}
Location: ${d.company.address}
Phone/WhatsApp: ${d.company.contact.phone}
Email: ${d.company.contact.email}

PROVEN RESULTS:
- ${d.results.revenue_growth}
- ${d.results.roi}
- ${d.results.impressions}
- ${d.results.leads}

SERVICES WE OFFER:
${d.services.map(s => `- ${s.name}: ${s.description}`).join("\n")}

PRICING PLANS:
${d.plans.map(p => `- ${p.name} (${p.price}): Best for ${p.best_for}. Includes: ${p.includes.join(", ")}`).join("\n")}

BUSINESS DOMAINS WE SERVE:
${d.domains_served.join(", ")}

HOW IT WORKS:
${d.process.map(p => `Step ${p.step} - ${p.title}: ${p.description}`).join("\n")}

PAYMENT OPTIONS:
Domestic: UPI - ${d.payment.domestic.upi} | Bank: ${d.payment.domestic.bank}, A/C: ${d.payment.domestic.account_number}, IFSC: ${d.payment.domestic.ifsc}
International: PayPal ${d.payment.international.paypal} | Payoneer ${d.payment.international.payoneer}

COMMON QUESTIONS & ANSWERS:
${d.faqs.map(f => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}

TERMS:
${Object.values(d.terms).join(" | ")}

YOUR BEHAVIOR RULES:
- Be warm, confident, and professional. Use short clear replies.
- Always stay on topic — only answer questions about this company and its services.
- If asked about pricing, mention the relevant plan and suggest contacting via WhatsApp for custom quotes.
- If someone wants to get started, guide them to WhatsApp (+91 9630715686) or email.
- Never make up information not in this document.
- You can use simple formatting like bullet points. Keep replies concise — 3 to 5 sentences max unless more detail is specifically asked for.
- Speak in a confident, energetic tone that matches a growth marketing agency.`;
};

const SYSTEM_PROMPT = buildSystemPrompt();

const chatStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Plus+Jakarta+Sans:wght@200;400;700;800&display=swap');

  .ai-chat-trigger {
    position: fixed; left: 16px; bottom: 16px; z-index: 1000;
    background: var(--blue, #00f2ff); color: black; padding: 13px 20px;
    border-radius: 50px; font-weight: 800; display: flex; align-items: center;
    gap: 8px; cursor: pointer; box-shadow: 0 0 20px var(--blue, #00f2ff);
    transition: 0.3s; border: none; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.8rem;
  }
  .ai-chat-trigger:hover { transform: scale(1.08); }
  .ai-chat-trigger-label { display: inline; }
  @media (max-width: 768px) {
    .ai-chat-trigger-label { display: none; }
    .ai-chat-trigger { padding: 14px; border-radius: 50%; }
  }

  .ai-chat-window {
    position: fixed; left: 16px; bottom: 90px; z-index: 2000;
    width: min(400px, calc(100vw - 32px));
    background: #050510; border: 1px solid #00f2ff;
    border-radius: 24px; overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 0 60px rgba(0,242,255,0.2);
    transform: scale(0.9) translateY(20px); opacity: 0;
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s;
    pointer-events: none;
  }
  .ai-chat-window.open {
    transform: scale(1) translateY(0); opacity: 1; pointer-events: all;
  }
  @media (max-width: 480px) {
    .ai-chat-window {
      left: 8px; right: 8px; bottom: 80px;
      width: auto;
      border-radius: 20px;
    }
  }

  .ai-chat-header {
    background: linear-gradient(135deg, rgba(0,242,255,0.12), rgba(0,0,0,0));
    padding: 16px 20px; display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid rgba(0,242,255,0.15);
  }
  .ai-chat-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: #00f2ff; display: flex; align-items: center;
    justify-content: center; font-size: 1.1rem; flex-shrink: 0;
    animation: pulse-glow 2.5s ease-in-out infinite;
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0px rgba(0,242,255,0.4); }
    50% { box-shadow: 0 0 16px rgba(0,242,255,0.7); }
  }
  .ai-chat-header-info { flex: 1; }
  .ai-chat-name { font-family: 'Syncopate', sans-serif; font-size: 0.75rem; color: #00f2ff; letter-spacing: 2px; }
  .ai-chat-status { font-size: 0.7rem; color: #39ff14; margin-top: 2px; display: flex; align-items: center; gap: 5px; }
  .ai-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #39ff14; animation: blink 1.5s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .ai-chat-close { background: none; border: none; color: #ff0055; cursor: pointer; font-size: 1.2rem; padding: 4px; line-height: 1; transition: 0.2s; }
  .ai-chat-close:hover { transform: rotate(90deg); }

  .ai-chat-messages {
    flex: 1; overflow-y: auto; padding: 16px; display: flex;
    flex-direction: column; gap: 12px; max-height: 360px; min-height: 200px;
    scrollbar-width: thin; scrollbar-color: rgba(0,242,255,0.2) transparent;
  }
  .ai-chat-messages::-webkit-scrollbar { width: 4px; }
  .ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(0,242,255,0.2); border-radius: 4px; }

  .ai-msg { max-width: 85%; display: flex; flex-direction: column; gap: 4px; animation: msg-in 0.3s ease; }
  @keyframes msg-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .ai-msg.user { align-self: flex-end; align-items: flex-end; }
  .ai-msg.bot  { align-self: flex-start; align-items: flex-start; }

  .ai-msg-bubble {
    padding: 10px 14px; border-radius: 16px; font-size: 0.875rem;
    line-height: 1.6; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ai-msg.user .ai-msg-bubble { background: #00f2ff; color: #000; border-bottom-right-radius: 4px; font-weight: 600; }
  .ai-msg.bot  .ai-msg-bubble { background: rgba(255,255,255,0.06); color: #ddd; border: 1px solid rgba(255,255,255,0.08); border-bottom-left-radius: 4px; }

  .ai-msg-time { font-size: 0.65rem; color: #444; padding: 0 4px; }

  /* Typing indicator */
  .ai-typing-bubble { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; border-radius: 16px; border-bottom-left-radius: 4px; display: flex; gap: 5px; align-items: center; }
  .ai-typing-dot { width: 7px; height: 7px; border-radius: 50%; background: #00f2ff; animation: typing 1.2s infinite; }
  .ai-typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .ai-typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-6px);opacity:1} }

  /* Quick replies */
  .ai-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 8px; }
  .ai-quick-btn {
    background: transparent; border: 1px solid rgba(0,242,255,0.3); color: #00f2ff;
    padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; cursor: pointer;
    transition: 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap;
  }
  .ai-quick-btn:hover { background: rgba(0,242,255,0.1); border-color: #00f2ff; }

  /* Input bar */
  .ai-chat-input-bar {
    padding: 12px 16px; border-top: 1px solid rgba(0,242,255,0.1);
    display: flex; gap: 8px; align-items: flex-end;
    background: rgba(0,0,0,0.3);
  }
  .ai-chat-input {
    flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(0,242,255,0.2);
    border-radius: 14px; color: white; padding: 10px 14px; font-size: 0.875rem;
    outline: none; resize: none; font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.5; max-height: 100px; min-height: 42px;
    transition: border-color 0.2s;
    scrollbar-width: none;
  }
  .ai-chat-input:focus { border-color: #00f2ff; }
  .ai-chat-input::placeholder { color: #444; }
  .ai-chat-input::-webkit-scrollbar { display: none; }
  .ai-send-btn {
    width: 40px; height: 40px; border-radius: 50%; background: #00f2ff; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: 0.2s; font-size: 1rem;
  }
  .ai-send-btn:hover { transform: scale(1.1); }
  .ai-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .ai-error-msg { color: #ff0055; font-size: 0.8rem; text-align: center; padding: 4px 16px; }
`;

const QUICK_REPLIES = [
  "What services do you offer?",
  "How much does it cost?",
  "How soon will I see results?",
  "How do I get started?",
  "Do you work outside Indore?",
];

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const WELCOME_MESSAGE = {
  id: 1,
  role: "bot",
  text: `👋 Hi! I'm the UDM AI Assistant.\n\nI can tell you everything about our services, pricing, results, and how we can grow your business. What would you like to know?`,
  time: formatTime(),
};

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQuick, setShowQuick] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const msgId = useRef(2);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 400);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    setError("");
    setShowQuick(false);

    // Add user message
    const userMsg = { id: msgId.current++, role: "user", text: userText, time: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build conversation history for the API
    const history = messages
      .filter(m => m.id !== 1) // skip welcome message from history
      .map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));

    try {
      if (!API_KEY) throw new Error("NO_KEY");

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "UDM AI Assistant",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: userText },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const botText = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't get a response. Please try again.";

      setMessages(prev => [...prev, {
        id: msgId.current++,
        role: "bot",
        text: botText,
        time: formatTime(),
      }]);

    } catch (err) {
      if (err.message === "NO_KEY") {
        setError("⚠️ API key not set. Add VITE_OPENROUTER_KEY to your .env file.");
      } else {
        setError(`Error: ${err.message}. Check your API key or try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{chatStyles}</style>

      {/* Chat Window */}
      <div className={`ai-chat-window${open ? " open" : ""}`}>
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-avatar">🤖</div>
          <div className="ai-chat-header-info">
            <div className="ai-chat-name">UDM AI AGENT</div>
            <div className="ai-chat-status">
              <span className="ai-status-dot" /> Online — Ask me anything
            </div>
          </div>
          <button className="ai-chat-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Messages */}
        <div className="ai-chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-msg ${msg.role}`}>
              <div className="ai-msg-bubble" style={{ whiteSpace: "pre-wrap" }}>
                {msg.text}
              </div>
              <span className="ai-msg-time">{msg.time}</span>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="ai-msg bot">
              <div className="ai-typing-bubble">
                <div className="ai-typing-dot" />
                <div className="ai-typing-dot" />
                <div className="ai-typing-dot" />
              </div>
            </div>
          )}

          {error && <div className="ai-error-msg">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick reply buttons (shown initially) */}
        {showQuick && (
          <div className="ai-quick-replies">
            {QUICK_REPLIES.map(q => (
              <button key={q} className="ai-quick-btn" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="ai-chat-input-bar">
          <textarea
            ref={inputRef}
            className="ai-chat-input"
            placeholder="Ask about services, pricing, results..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="ai-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Trigger button */}
      <button className="ai-chat-trigger" onClick={() => setOpen(o => !o)}>
        🤖 <span className="ai-chat-trigger-label">AI ASSISTANT</span>
      </button>
    </>
  );
}
