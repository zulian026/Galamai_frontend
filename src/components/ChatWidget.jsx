import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Selamat datang di BBPOM Padang. Saya adalah asisten virtual GALAMAI. Ada yang bisa saya bantu terkait informasi obat, makanan, atau layanan kami?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing indicator
  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Terima kasih atas pertanyaannya! Tim kami akan segera membantu Anda.",
        "Untuk informasi lebih detail, Anda bisa mengunjungi layanan GALAMAI kami.",
        "Apakah ada hal lain yang ingin Anda ketahui tentang layanan BBPOM?",
        "Saya akan menghubungkan Anda dengan petugas yang tepat untuk membantu masalah ini.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: randomResponse,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      simulateTyping();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Notification Badge */}
      {!isOpen && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          1
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div className="relative group">
          {/* Ripple effect */}
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 bg-green-400 rounded-full animate-ping opacity-30 animation-delay-200"></div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out transform hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 group-hover:shadow-green-500/25"
            aria-label="Open chat"
          >
            <MessageCircle size={28} className="drop-shadow-lg" />

            {/* Shine effect */}
            
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
            Ada yang bisa dibantu?
            <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 rotate-45 transform -mt-1"></div>
          </div>
        </div>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div
          className={`w-80 sm:w-96 bg-white shadow-2xl rounded-3xl flex flex-col transform transition-all duration-500 ease-out border border-gray-200 overflow-hidden ${
            isMinimized ? "h-16" : "h-[500px]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-header via-blue-600 to-header text-white p-4 flex justify-between items-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-green-400/20 animate-pulse"></div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  GALAMAI Assistant
                </h2>
                <div className="flex items-center gap-2 text-green-200 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Online - Siap membantu
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-green-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                aria-label="Minimize chat"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-red-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] ${
                        msg.sender === "user" ? "order-2" : ""
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm relative ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-header to-blue-600 text-white ml-auto"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>

                        {/* Message tail */}
                        <div
                          className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                            msg.sender === "user"
                              ? "right-0 translate-x-1/2 bg-header"
                              : "left-0 -translate-x-1/2 bg-white border-l border-b border-gray-200"
                          }`}
                        ></div>
                      </div>
                      <p
                        className={`text-xs text-gray-500 mt-1 ${
                          msg.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 animate-fadeIn">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-2 flex-wrap">
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                    Cek Status Obat
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                    Info Makanan
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                    Layanan
                  </button>
                </div>
              </div>

              {/* Input Box */}
              <div className="p-4 border-t bg-white flex items-center gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan Anda..."
                    rows={1}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-header focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none pr-12"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <div className="text-xs">Enter</div>
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-header to-blue-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                >
                  <Send
                    size={18}
                    className="transform group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
