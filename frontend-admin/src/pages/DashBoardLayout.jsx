import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

import Sidebar from "../components/Sidebar";

const DashBoardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className='flex h-screen overflow-hidden'>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#EFF2F9]">
            {/* MOBILE HEADER */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-[#222222] text-white">
              <h1 className="font-bold">Uzzi Bitez</h1>
              <button onClick={toggleSidebar} className="text-2xl">
                {isSidebarOpen ? <FiX /> : <FiMenu />}
              </button>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default DashBoardLayout