import { Bot, MessageSquare, Send, Trash2, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../context/useDashboardStore';
import { askDashboardAI } from '../services/aiService';
import { toast } from 'react-toastify';

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const containerRef = useRef(null);

  const { issPositions, currentSpeed, peopleInSpace, newsArticles, chatMessages, addChatMessage, clearChat, isAskingAI, setAskingAI } =
    useDashboardStore();

  const context = useMemo(() => {
    const latest = issPositions.at(-1);
    return {
      iss: latest,
      speed: currentSpeed,
      astronauts: peopleInSpace,
      news: newsArticles.slice(0, 12).map((a) => ({ title: a.title, source: a.source, category: a.category })),
    };
  }, [issPositions, currentSpeed, peopleInSpace, newsArticles]);

  const submit = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || isAskingAI) return;

    const userMessage = { id: crypto.randomUUID(), role: 'user', text: question, ts: Date.now() };
    addChatMessage(userMessage);
    setInput('');

    try {
      setAskingAI(true);
      const response = await askDashboardAI(question, context);
      addChatMessage({ id: crypto.randomUUID(), role: 'assistant', text: response, ts: Date.now() });
      toast.success('AI response received');
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    } catch {
      toast.error('AI request failed');
    } finally {
      setAskingAI(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass mb-3 w-[min(92vw,360px)] overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bot size={16} /> Dashboard AI
              </div>
              <div className="flex gap-2">
                <button onClick={clearChat} className="rounded p-1 hover:bg-white/10"><Trash2 size={14} /></button>
                <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-white/10"><X size={14} /></button>
              </div>
            </div>
            <div ref={containerRef} className="scroll-thin max-h-80 space-y-2 overflow-y-auto p-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`rounded-xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-cyan-500/20 ml-8' : 'bg-slate-500/20 mr-8'}`}>
                  <p>{msg.text}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{new Date(msg.ts).toLocaleTimeString()}</p>
                </div>
              ))}
              {isAskingAI ? <p className="text-xs text-slate-400">Assistant typing...</p> : null}
            </div>
            <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about ISS or dashboard news..." className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none" />
              <button type="submit" className="rounded-lg bg-cyan-500 px-3 text-slate-900"><Send size={15} /></button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button onClick={() => setOpen((v) => !v)} className="grid h-12 w-12 place-items-center rounded-full bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30">
        {open ? <X size={18} /> : <MessageSquare size={18} />}
      </button>
    </div>
  );
}
