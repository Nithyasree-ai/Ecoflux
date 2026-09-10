import React, { useState, useRef, useEffect } from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { SUGGESTED_PROMPTS } from '../data/copilotEngine';
import { Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Sun,
  BatteryCharging,
  Users,
  ArrowRight,
  User,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const AICopilotPage: React.FC = () => {
  const { copilotMessages, sendCopilotQuery, user } = useEcoFlux();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [copilotMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCopilotQuery(inputText.trim());
    setInputText('');
  };

  const handleChipClick = (prompt: string) => {
    sendCopilotQuery(prompt);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-cyan-400" />
            <span>EcoFlex Energy Copilot</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ask me anything about your campus energy. Specialized telemetry intelligence and actionable facility controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            ● COPILOT AGENT: ONLINE (8 FACILITIES CONNECTED)
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-4 rounded-2xl bg-[#091510] border border-emerald-500/15">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
          Suggested Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleChipClick(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 text-slate-300 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 text-xs font-medium transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Stream Box */}
      <div className="rounded-3xl bg-[#08130e]/95 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col h-[580px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {copilotMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs'
                      : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {isUser ? user?.fullName?.charAt(0) || 'U' : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble Content */}
                <div className={`space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-emerald-500 text-black font-medium rounded-tr-none shadow-[0_4px_15px_rgba(16,185,129,0.25)]'
                        : 'bg-[#0e221a] border border-emerald-500/20 text-slate-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Highlight Stats Embedded Inside Copilot Response */}
                  {msg.highlightStats && msg.highlightStats.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                      {msg.highlightStats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-black/40 border border-emerald-500/15 text-xs"
                        >
                          <span className="text-[10px] text-slate-400 block uppercase font-mono">{stat.label}</span>
                          <span
                            className="font-bold font-mono text-sm mt-0.5 block truncate"
                            style={{ color: stat.color || '#34d399' }}
                          >
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Recommendation Button */}
                  {msg.actionRecommendation && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs w-full">
                      <span className="font-semibold text-white truncate">
                        {msg.actionRecommendation.title}
                      </span>
                      {msg.actionRecommendation.route && (
                        <Link
                          to={msg.actionRecommendation.route}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shrink-0 flex items-center gap-1 transition-all"
                        >
                          <span>{msg.actionRecommendation.buttonText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 font-mono block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-emerald-500/15 bg-[#050b08]/80">
          <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
            <input
              type="text"
              placeholder="Ask about peak demand, battery health, solar surplus, or building anomalies..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-black/50 border border-emerald-500/25 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-40 disabled:hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
            >
              <Send className="w-4 h-4 fill-black" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
