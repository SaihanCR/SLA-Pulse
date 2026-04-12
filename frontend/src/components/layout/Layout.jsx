import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import ChatbotPanel from "../chatbot/ChatbotPanel";
import { Bot } from "lucide-react";

const Layout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h1 className="text-xl font-bold mb-6">SLA Pulse</h1>

        <nav className="flex flex-col gap-3">
          <Link to="/companies" className="hover:text-purple-400">
            Companies
          </Link>

          <Link to="/slas" className="hover:text-purple-400">
            SLAs
          </Link>

          <Link to="/users" className="hover:text-purple-400">
            Users
          </Link>

          <Link to="/roles" className="hover:text-purple-400">
            Roles
          </Link>

          <Link to="/tickets" className="hover:text-purple-400">
            Tickets
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Botón flotante */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <Bot size={24} />
        </button>
      )}

      {/* Fondo oscuro */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {/* Panel */}
      <ChatbotPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default Layout;