import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r bg-green-400 text-white p-4 rounded-full shadow-xl hover:bg-green-500 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          aria-label="Open chat"
        >
          <MessageCircle size={30} />
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[400px] bg-white shadow-2xl rounded-2xl flex flex-col transform transition-all duration-300 ease-in-out scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-lg font-semibold tracking-tight">Live Chat</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            <div className="flex items-start gap-2 max-w-[80%]">
              <img
                src="https://via.placeholder.com/32"
                alt="Admin avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-xl shadow-sm text-sm">
                Halo! Ada yang bisa saya bantu?
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 border-t bg-white flex items-center gap-3">
            <input
              type="text"
              placeholder="Tulis pesan..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
            />
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm text-sm font-medium">
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
