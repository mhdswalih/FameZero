import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader } from 'lucide-react';
import { getCustomResponse } from './getCustomResponse';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotModalProps {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  apiKey: string;
}

const ChatBotModal = ({ isChatOpen, setIsChatOpen, apiKey }: ChatBotModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Custom keyword responses


  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // First check for custom keyword responses
      const customResponse = getCustomResponse(userMessage.text);

      let botReply = '';

      if (customResponse) {
        // Use custom response if keyword matched
        botReply = customResponse;
      } else {
        // Call Gemini API only if no keyword match
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: userMessage.text,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to get response from Gemini');
        }

        const data = await response.json();
        botReply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'Sorry, I could not understand that. Please try again.';
      }

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botReply,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{
            duration: 0.2,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="absolute bottom-20 right-0 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Chat Assistant</h3>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-orange-400 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Typing...</span>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBotModal;