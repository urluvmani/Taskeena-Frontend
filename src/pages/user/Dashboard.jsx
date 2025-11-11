import React, { useEffect, useState } from "react";
import UserMenu from "../../components/More/userMenu";
import { Outlet, Link, useNavigate } from "react-router-dom";
import SEO from "../../components/More/SEO";
import { Menu, X } from "lucide-react"; // ✅ for open/close toggle
import { useAuth } from "../../components/context/authContext";

const Dashboard = () => {
  const {auth} = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false);
 const navigate =  useNavigate()

 useEffect(() => {
  if (!auth?.token) {
    navigate('/login')
  }
 }, [auth?.token])
 

  // ✅ Close sidebar when clicking outside
  const handleBackdropClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      {/* ✅ SEO META TAGS */}
      <SEO
        title="User Dashboard | Taskeena Beauty"
        description="Manage your profile, view orders, and explore Taskeena Beauty's premium skincare and wellness dashboard experience."
        keywords="user dashboard, Taskeena Beauty, skincare, wellness, orders, account, profile"
      />

      <div className="min-h-screen flex bg-gradient-to-br from-rose-50 via-white to-emerald-50 text-gray-800">
        {/* ✅ Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[20vw] min-w-[240px] bg-gradient-to-b from-emerald-600/90 to-rose-600/90 backdrop-blur-lg shadow-xl text-white p-6">
          <h2 className="text-2xl font-extrabold tracking-wide mb-6 text-center drop-shadow">
            Dashboard
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100 rounded-xl">
            <UserMenu />
          </div>
          <p className="text-xs text-center text-emerald-100 mt-6 opacity-70">
            Taskeena Beauty © {new Date().getFullYear()}
          </p>
        </aside>

        {/* ✅ Mobile Topbar */}
        <header className="lg:hidden fixed top-16 left-0 w-full h-20 bg-gradient-to-r from-emerald-600 to-rose-600 text-white  flex justify-between items-center px-5 py-3 shadow-md">
          <h1 className="text-lg font-semibold tracking-wide">
            Dashboard
          </h1>


          

            {/* ✅ Toggle between Menu & Cross icon */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-white/20 transition"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" /> // Cross icon
              ) : (
                <Menu className="w-6 h-6" /> // Menu icon
              )}
            </button>
          
        </header>

        {/* ✅ Overlay (click outside to close) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden transition-opacity duration-300"
            onClick={handleBackdropClick}
          ></div>
        )}

        {/* ✅ Mobile Sidebar (Slide-in) */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-rose-700 text-white shadow-2xl z-40 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-5 border-b border-white/20 flex justify-between items-center">
            <h2 className="text-lg font-bold">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-sm bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition"
            >
              ✕
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <UserMenu />
          </div>
        </div>

        {/* ✅ Main Content */}
        <main className="flex-1 w-full mt-20 md:mt-16 lg:mt-0 flex md:px-8  bg-white/60 backdrop-blur-md shadow-inner rounded-tl-3xl border-l border-emerald-100 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90  md:p-8 rounded-2xl shadow-md border border-emerald-100">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
