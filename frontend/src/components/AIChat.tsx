import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  time: string;
}

const AIChat: React.FC = () => {
  const { isAIChatOpen, setAIChatOpen } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm JuiceAI. How can I help you today?", sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let aiText = "I'm still learning! But I can tell you that all our juices are 100% fresh.";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('order')) aiText = "You can track your latest order in the 'Orders' section of your profile!";
      else if (lowerInput.includes('fruit') || lowerInput.includes('ingredient')) aiText = "We use over 30+ seasonal fruits, including organic Mangoes, Berries, and Citrus!";
      else if (lowerInput.includes('time') || lowerInput.includes('delivery')) aiText = "Most deliveries take between 45 to 60 minutes depending on your location.";
      else if (lowerInput.includes('hi') || lowerInput.includes('hello')) aiText = "Hello there! Ready for some fresh juice magic?";

      const aiMsg: Message = {
        id: Date.now() + 1,
        text: aiText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>

      {/* Chat Window */}
      <AnimatePresence>
        {isAIChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:right-8 md:bottom-8 w-full md:w-[380px] h-full md:h-[600px] bg-white md:rounded-[2.5rem] shadow-2xl flex flex-col z-[100] overflow-hidden border-t md:border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">JuiceAI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online Now</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setAIChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FFFBF9]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div>
                      <div className={`p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                        msg.sender === 'user' 
                        ? 'bg-primary-500 text-white rounded-tr-none shadow-lg shadow-primary-500/20' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[9px] mt-1 font-black text-slate-400 uppercase tracking-widest ${msg.sender === 'user' ? 'text-right' : ''}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-[1.5rem] rounded-tl-none shadow-sm flex gap-1">
                    <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-50">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask JuiceAI..."
                  className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-primary-500/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
