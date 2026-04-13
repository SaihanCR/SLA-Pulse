import { Outlet } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";

const Layout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 overflow-x-auto bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
          <div className="min-h-screen p-6 md:p-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;