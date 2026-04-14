import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Layers,
  Ticket,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { logout, isAdmin } from "../../services/auth.service";

const adminMenuItems = [
  { name: "Companies", path: "/companies", icon: Building2 },
  { name: "SLAs",      path: "/slas",      icon: Layers    },
  { name: "Users",     path: "/users",     icon: Users     },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const userIsAdmin = isAdmin();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.name}
        to={item.path}
        title={collapsed ? item.name : ""}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-900/30"
              : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
          }`
        }
      >
        <div className="shrink-0">
          <Icon size={18} />
        </div>
        <span className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
          collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
        }`}>
          {item.name}
        </span>
      </NavLink>
    );
  };

  return (
    <aside className={`relative flex min-h-screen flex-col border-r border-gray-800 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-200 shadow-2xl transition-all duration-300 ${
      collapsed ? "w-24" : "w-72"
    }`}>

      {/* Glow decor */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 bg-violet-600/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-gray-800 px-4 py-5">
        <div className={`transition-all duration-300 ${
          collapsed ? "w-0 opacity-0 overflow-hidden" : "opacity-100"
        }`}>
          <h2 className="text-2xl font-bold tracking-wide text-white">SLA Pulse</h2>
          <p className="text-sm text-gray-400">Dashboard</p>
        </div>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-700 bg-gray-800/80 text-gray-200 transition-all duration-300 hover:bg-gray-700 hover:text-white"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="relative flex flex-1 flex-col gap-2 px-3 py-4">

        {/* Dashboard — visible para todos */}
        {renderNavItem({ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard })}

        {/* Solo admin */}
        {userIsAdmin && adminMenuItems.map(renderNavItem)}

        {/* Tickets — visible para todos */}
        {renderNavItem({ name: "Tickets", path: "/tickets", icon: Ticket })}

      </nav>

      {/* Footer */}
      <div className="relative space-y-3 border-t border-gray-800 px-4 py-4">
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign out" : ""}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-gray-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="shrink-0">
            <LogOut size={18} />
          </div>
          <span className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
            collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
          }`}>
            Sign out
          </span>
        </button>

        {!collapsed ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-3">
            <p className="text-xs text-gray-400">© 2026 SLA Pulse</p>
            <p className="mt-1 text-[11px] text-gray-500">Support workflow dashboard</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;