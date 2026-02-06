import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import {
  HiHome,
  HiTicket,
  HiPlus,
  HiLogout,
  HiMenuAlt2,
  HiFolderAdd
} from "react-icons/hi";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Projects", path: "/dashboard", icon: HiHome },
    { name: "Kanban Board", path: "/dashboard/board", icon: HiTicket },
    { name: "Create Ticket", path: "/dashboard/create-ticket", icon: HiPlus },
    { name: "Create Project", path: "/dashboard/create-project", icon: HiFolderAdd },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-indigo-800 text-white">
        <div className="flex items-center justify-center h-16 bg-indigo-900 text-xl font-bold">
          BugTracker
        </div>
        <div className="flex-1 flex flex-col p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 text-gray-200 rounded-lg hover:bg-indigo-700 transition-colors ${location.pathname === item.path ? "bg-indigo-700" : ""
                }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-indigo-700">
          <div className="mb-2 text-sm text-indigo-200">
            Logged in as: {user?.username}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-300 hover:text-red-100 transition-colors"
          >
            <HiLogout className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Mobile only menu button + standard header info) */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 md:justify-end">
          <button
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <HiMenuAlt2 className="w-6 h-6" />
          </button>
          <div className="text-gray-600 font-medium">
            Welcome, {user?.username}
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800 text-white">
              <div className="flex items-center justify-center h-16 bg-indigo-900 text-xl font-bold">
                BugTracker
              </div>
              <div className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-4 py-2 text-gray-200 rounded-lg hover:bg-indigo-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 mt-4 text-red-300 hover:text-red-100"
                >
                  <HiLogout className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
