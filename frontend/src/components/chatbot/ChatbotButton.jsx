import { Bot } from "lucide-react";

const ChatbotButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
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
      <Bot size={24} color="white" />
    </button>
  );
};

export default ChatbotButton;