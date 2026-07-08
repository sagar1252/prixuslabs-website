import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: string[];
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are Prix, the official AI assistant for Prixuslabs. 
Your goal is to be highly professional, helpful, and never desperate.

CRITICAL RULES:
1. ALWAYS keep your responses under 2 short sentences. Be extremely concise.
2. Provide 2-4 predefined options for the user to choose from to guide the conversation.
3. You MUST format these options at the very end of your message EXACTLY like this: [OPTION: Option 1] [OPTION: Option 2]
4. First, politely ask what the user needs. (e.g. [OPTION: I need a new website] [OPTION: I need AI automation])
5. Answer their questions clearly based on our services (web development, AI bots, CRM, business automation).
6. When the user expresses they are ready to schedule an appointment, contact us, or fill out a form, DO NOT output any [OPTION] tags. Instead, output this exact string: [ACTION: OPEN_CONTACT_FORM]
7. If you use the ACTION tag, just say a polite closing statement like "I will open the contact form for you right now!" followed by [ACTION: OPEN_CONTACT_FORM]`;

const parseMessage = (text: string) => {
  const options: string[] = [];
  let action: string | null = null;
  
  // Extract Options
  const optionRegex = /\[OPTION:\s*(.*?)\]/g;
  let match;
  while ((match = optionRegex.exec(text)) !== null) {
    options.push(match[1].trim());
  }
  
  // Extract Action
  const actionRegex = /\[ACTION:\s*(.*?)\]/g;
  const actionMatch = actionRegex.exec(text);
  if (actionMatch) {
    action = actionMatch[1].trim();
  }

  let cleanText = text
    .replace(/\[OPTION:\s*(.*?)\]/g, '')
    .replace(/\[ACTION:\s*(.*?)\]/g, '')
    .trim();
    
  return { cleanText, options, action };
};

export default function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Prix, the Prixuslabs AI assistant. How can I help you today?",
      sender: 'bot',
      options: ["I need a new website", "I want an AI bot", "I need business automation"]
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatRef = useRef<any>(null);

  useEffect(() => {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3.1-flash-lite",
        systemInstruction: SYSTEM_PROMPT
      });
      chatRef.current = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Hi! I'm Prix, the Prixuslabs AI assistant. How can I help you today? [OPTION: I need a new website] [OPTION: I want an AI bot] [OPTION: I need business automation]" }],
          },
        ],
      });
    } catch (e) {
      console.error("Failed to initialize Gemini:", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const userText = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!userText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!API_KEY) {
        throw new Error("API Key is missing");
      }
      const result = await chatRef.current.sendMessage(userText);
      const rawResponse = result.response.text();
      
      const { cleanText, options, action } = parseMessage(rawResponse);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: cleanText,
        sender: 'bot',
        options: options.length > 0 ? options : undefined
      };
      setMessages((prev) => [...prev, botMessage]);
      
      // Execute any UI actions returned by the AI
      if (action === 'OPEN_CONTACT_FORM') {
        setTimeout(() => {
          setIsOpen(false);
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 1500); // Wait a brief moment before scrolling and closing
      }

    } catch (error) {
      console.error("Error communicating with Gemini:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please call us directly at 9022989386 to schedule an appointment!",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[320px] sm:w-[380px] h-[450px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          >
            {/* Header */}
            <div className="bg-[#18011F]/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#B600A8]/20 border border-[#B600A8]/50 flex items-center justify-center p-1">
                  <img src="/graident-ai-robot-vectorart.png" alt="Prix" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-wide">Prix</h3>
                  <p className="text-white/60 text-xs">AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div key={msg.id} className="flex flex-col gap-2">
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white rounded-br-none self-end'
                        : 'bg-[#18011F]/80 text-[#D7E2EA] border border-white/10 rounded-bl-none self-start whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  {/* Render Options if they exist and it's the last message */}
                  {msg.options && index === messages.length - 1 && !isLoading && (
                    <div className="flex flex-wrap gap-2 mt-1 self-start">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="bg-white/5 hover:bg-[#B600A8]/20 border border-white/10 hover:border-[#B600A8]/50 text-white text-xs px-3 py-1.5 rounded-full transition-all duration-200 text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-[#18011F]/80 text-white/50 border border-white/10 rounded-bl-none self-start">
                  typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-[#B600A8] transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-24 h-24 sm:w-32 sm:h-32 relative group focus:outline-none drop-shadow-2xl"
      >
        <img 
          src="/graident-ai-robot-vectorart.png" 
          alt="Prix AI Bot" 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
        {/* Notification dot */}
        {!isOpen && (
          <span className="absolute top-2 right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
