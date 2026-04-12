import { useState } from "react";
import ChatbotPanel from "./ChatbotPanel";
import { Bot } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* BOTÓN */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed bottom-6 right-6
            bg-gray-900 hover:bg-gray-800
            text-white
            p-4 rounded-full
            shadow-lg
            transition-all duration-300
            hover:scale-110 active:scale-95
          "
        >
          <Bot size={24} />
        </button>
      )}

      {/* FONDO OSCURO */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* PANEL */}
      <ChatbotPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default Chatbot;