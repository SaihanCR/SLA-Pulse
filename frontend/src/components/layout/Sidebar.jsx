import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  Layers,
  Ticket,
} from "lucide-react";

const menuItems = [
  {
    name: "Companies",
    path: "/companies",
    icon: <Building2 size={18} />,
  },
  {
    name: "SLAs",
    path: "/slas",
    icon: <Layers size={18} />,
  },
  {
    name: "Users",
    path: "/users",
    icon: <Users size={18} />,
  },
  {
    name: "Roles",
    path: "/roles",
    icon: <Shield size={18} />,
  },
  {
    name: "Tickets",
    path: "/tickets",
    icon: <Ticket size={18} />,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col p-4">
      
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          SLA Pulse
        </h2>
        <p className="text-sm text-gray-400">Dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-purple-600 text-white shadow-md"
                  : "hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          © 2026 SLA Pulse
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;