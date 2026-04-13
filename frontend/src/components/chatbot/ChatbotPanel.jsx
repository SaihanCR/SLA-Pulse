import { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatbotPanel = ({ onClose, isOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Saludo dinámico
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Mensaje inicial
  useEffect(() => {
    setMessages([
      {
        role: "bot",
        text: `${getGreeting()} 👋\nSoy Ing. Pulsito, tu asistente de SLA Pulse. ¿En qué puedo ayudarte hoy?`,
      },
    ]);
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;
    setInput("");

    const userMessage = { role: "user", text: currentInput };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/ai/chat", {
        message: currentInput,
        provider: "openrouter",
      });

      console.log("RESPUESTA BACK COMPLETA:", res);
      console.log("DATA:", res.data);

      // 🔥 FIX IMPORTANTE AQUÍ
      const rawText =
        res.data?.response ||
        res.data?.data ||
        res.data?.message ||
        (typeof res.data === "string" ? res.data : "");

      const botText =
        rawText
          .replace(/\n{2,}/g, "\n")
          .trim() ||
        "No pude generar una respuesta, intenta nuevamente.";

      const botMessage = {
        role: "bot",
        text: botText,
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("ERROR FRONT:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Error al conectar con la IA",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-96 h-full bg-white shadow-2xl flex flex-col
      transform transition-transform duration-300 ease-in-out z-50
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex flex-col">
          <span className="font-semibold">Ing. Pulsito</span>
          <span className="text-xs opacity-80">
            Especialista en SLA y tickets
          </span>
        </div>

        <button
          onClick={onClose}
          className="hover:scale-110 transition text-gray-300 hover:text-white"
        >
          ✖
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm whitespace-pre-line break-words
              ${
                msg.role === "user"
                  ? "bg-gray-900 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loader */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-3 py-2 rounded-2xl text-sm animate-pulse">
              Escribiendo...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2 bg-white">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-gray-900 text-white px-4 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatbotPanel;