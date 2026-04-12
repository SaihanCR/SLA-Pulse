import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  Shield,
  Layers,
  Ticket,
  PlusCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const mainMenuItems = [
  {
    name: "Companies",
    path: "/companies",
    icon: Building2,
  },
  {
    name: "SLAs",
    path: "/slas",
    icon: Layers,
  },
  {
    name: "Users",
    path: "/users",
    icon: Users,
  },
  {
    name: "Roles",
    path: "/roles",
    icon: Shield,
  },
];

const ticketMenuItems = [
  {
    name: "View Tickets",
    path: "/tickets",
    icon: FolderKanban,
  },
  {
    name: "Create Ticket",
    path: "/tickets/create",
    icon: PlusCircle,
  },
];

const Sidebar = () => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [ticketsOpen, setTicketsOpen] = useState(false);

  const isTicketsSectionActive = location.pathname.startsWith("/tickets");

  useEffect(() => {
    if (isTicketsSectionActive) {
      setTicketsOpen(true);
    }
  }, [isTicketsSectionActive]);

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

        <span
          className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
            collapsed
              ? "w-0 opacity-0 overflow-hidden"
              : "w-auto opacity-100"
          }`}
        >
          {item.name}
        </span>
      </NavLink>
    );
  };

  return (
    <aside
      className={`relative flex min-h-screen flex-col border-r border-gray-800 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-200 shadow-2xl transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      {/* Glow decor */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 bg-violet-600/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-gray-800 px-4 py-5">
        <div
          className={`transition-all duration-300 ${
            collapsed ? "w-0 opacity-0 overflow-hidden" : "opacity-100"
          }`}
        >
          <h2 className="text-2xl font-bold tracking-wide text-white">
            SLA Pulse
          </h2>
          <p className="text-sm text-gray-400">Dashboard</p>
        </div>

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-700 bg-gray-800/80 text-gray-200 transition-all duration-300 hover:bg-gray-700 hover:text-white"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="relative flex flex-1 flex-col gap-2 px-3 py-4">
        {mainMenuItems.map(renderNavItem)}

        {/* Tickets parent */}
        <div className="mt-2">
          <button
            onClick={() => setTicketsOpen((prev) => !prev)}
            title={collapsed ? "Tickets" : ""}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-300 ${
              isTicketsSectionActive
                ? "bg-purple-600/15 text-white ring-1 ring-purple-500/30"
                : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
            }`}
          >
            <div className="shrink-0">
              <Ticket size={18} />
            </div>

            <span
              className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                collapsed
                  ? "w-0 opacity-0 overflow-hidden"
                  : "w-auto opacity-100"
              }`}
            >
              Tickets
            </span>

            {!collapsed && (
              <ChevronDown
                size={16}
                className={`ml-auto transition-transform duration-300 ${
                  ticketsOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              collapsed
                ? "max-h-0 opacity-0"
                : ticketsOpen
                ? "mt-2 max-h-40 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 flex flex-col gap-2 border-l border-gray-700 pl-4">
              {ticketMenuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="relative border-t border-gray-800 px-4 py-4">
        {!collapsed ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-3">
            <p className="text-xs text-gray-400">© 2026 SLA Pulse</p>
            <p className="mt-1 text-[11px] text-gray-500">
              Support workflow dashboard
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;