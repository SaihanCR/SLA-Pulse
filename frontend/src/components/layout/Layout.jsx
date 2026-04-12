import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
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

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;