"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ai-analyst.module.css";

interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  {
    icon: "🎯",
    title: "Sure 3 Odds Slip",
    desc: "High-confidence 3.0x ticket with low-risk picks",
    prompt: "Give me a sure 3 odds slip from upcoming verified matches",
  },
  {
    icon: "🔥",
    title: "Safe Double Chance",
    desc: "Low-variance 1X / X2 selections across leagues",
    prompt: "Find safe Double Chance / Under 3.5 selections for a multi-match ticket",
  },
  {
    icon: "⚽",
    title: "Today's Key Fixtures",
    desc: "Kickoffs, venues, and tactical matchups",
    prompt: "What are the top football fixtures today and their kickoff times?",
  },
  {
    icon: "📊",
    title: "Highest Win Probabilities",
    desc: "Games with strong statistical dominance",
    prompt: "Which matches have the highest win probability today?",
  },
];

export function AiAnalystClient({
  initialUserTimezone = "UTC",
}: Readonly<{
  initialUserTimezone?: string;
}>) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userTimezone, setUserTimezone] = useState<string>(initialUserTimezone);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-detect client timezone
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) {
        setUserTimezone(detected);
      }
    } catch {
      // fallback
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? inputValue).trim();
    if (!query || isTyping) return;

    const userMsgId = `user_${Date.now()}`;
    const newMsg: UIMessage = {
      id: userMsgId,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const payload = {
        messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        userTimezone,
      };

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "AI Analyst encountered an issue generating a response.");
      }

      const botMsg: UIMessage = {
        id: `bot_${Date.now()}`,
        role: "assistant",
        content: data.message.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: UIMessage = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content: `⚠️ **Analyst Note:** ${err instanceof Error ? err.message : "Service connection interrupted. Please try again."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className={styles.chatWrapper}>
      {/* Top Header */}
      <header className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.avatarCircle} aria-hidden="true">
            🧠
          </div>
          <div className={styles.headerInfo}>
            <h2 className={styles.botTitle}>PlayToday AI Tactical Analyst</h2>
            <div className={styles.botStatusRow}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.statusText}>
                Live Sports Database • Timezone: {userTimezone}
              </span>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button className={styles.clearBtn} onClick={handleClear} type="button">
            <span>Clear</span>
          </button>
        )}
      </header>

      {/* Messages Scroll Area */}
      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.welcomeBox}>
            <div className={styles.welcomeIcon}>⚽</div>
            <h3 className={styles.welcomeTitle}>What can I help you analyze today?</h3>
            <p className={styles.welcomeDesc}>
              Ask about match schedules, tactical predictions, win probabilities, or request a custom odds ticket with verified bookmaker quotes.
            </p>

            {/* Structured Suggestion Cards Grid */}
            <div className={styles.startersGrid}>
              {STARTER_PROMPTS.map((item, idx) => (
                <button
                  className={styles.starterCard}
                  disabled={isTyping}
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  type="button"
                >
                  <span className={styles.starterIcon}>{item.icon}</span>
                  <div className={styles.starterContent}>
                    <span className={styles.starterTitle}>{item.title}</span>
                    <span className={styles.starterDesc}>{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div className={styles.messageRow} data-role={msg.role} key={msg.id}>
              {msg.role === "assistant" && (
                <div className={styles.msgAvatar} aria-hidden="true">
                  🧠
                </div>
              )}
              <div className={styles.messageBubble}>
                <div
                  className={styles.messageText}
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(msg.content),
                  }}
                />
                <span className={styles.messageTime}>{msg.timestamp}</span>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className={styles.messageRow} data-role="assistant">
            <div className={styles.msgAvatar} aria-hidden="true">
              🧠
            </div>
            <div className={styles.typingRow}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Floating ChatGPT-Style Input Bar */}
      <div className={styles.inputContainer}>
        <form
          className={styles.inputCapsule}
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            aria-label="Chat query input"
            className={styles.inputField}
            disabled={isTyping}
            placeholder="Message PlayToday AI Analyst..."
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            aria-label="Send message"
            className={styles.sendBtn}
            disabled={isTyping || !inputValue.trim()}
            type="submit"
          >
            <svg
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="16"
            >
              <line x1="12" x2="12" y1="19" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </form>
        <p className={styles.disclaimerText}>
          PlayToday AI is grounded in real sports feeds. Check bookmaker rules and practice responsible play.
        </p>
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Headers
  formatted = formatted.replace(/^### (.*$)/gim, "<h4 style='margin:0.75rem 0 0.35rem; font-size:0.96rem; font-weight:800; color:var(--pt-stone-900);'>$1</h4>");
  formatted = formatted.replace(/^## (.*$)/gim, "<h3 style='margin:0.9rem 0 0.4rem; font-size:1.08rem; font-weight:800; color:var(--pt-stone-900);'>$1</h3>");
  formatted = formatted.replace(/^# (.*$)/gim, "<h2 style='margin:1.1rem 0 0.5rem; font-size:1.2rem; font-weight:800; color:var(--pt-stone-900);'>$1</h2>");
  // Bullet points
  formatted = formatted.replace(/^\s*[-*]\s+(.*$)/gim, "<li style='margin-left:1.25rem; margin-bottom:0.3rem;'>$1</li>");
  // Code block
  formatted = formatted.replace(/`([^`]+)`/g, "<code style='background:rgba(0,0,0,0.06); padding:0.15rem 0.35rem; border-radius:0.3rem; font-family:var(--font-geist-mono),monospace; font-size:0.85rem;'>$1</code>");

  // Markdown Tables Conversion into Responsive Horizontal Scroll Wrapper
  formatted = formatted.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (tableMatch) => {
    const lines = tableMatch.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return tableMatch;

    const headerLine = lines[0];
    const separatorLine = lines[1];

    if (!headerLine || !separatorLine || !separatorLine.includes("-")) {
      return tableMatch;
    }

    const headers = headerLine.split("|").slice(1, -1).map((h) => h.trim());
    const dataRows = lines.slice(2);

    let html = '<div class="ptTableScrollWrapper"><table class="ptResponsiveTable"><thead><tr>';
    for (const h of headers) {
      html += `<th>${h}</th>`;
    }
    html += "</tr></thead><tbody>";

    for (const row of dataRows) {
      const cells = row.split("|").slice(1, -1).map((c) => c.trim());
      if (cells.length > 0) {
        html += "<tr>";
        for (const cell of cells) {
          html += `<td>${cell}</td>`;
        }
        html += "</tr>";
      }
    }
    html += "</tbody></table></div>";
    return html;
  });

  return formatted;
}
