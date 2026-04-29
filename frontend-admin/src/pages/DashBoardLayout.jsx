import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

const DashBoardLayout = () => {
  return (
    <div className='flex h-screen'>
        <Sidebar />

        <div className="bg-[#EFF2F9] h-screen flex-1 overflow-x-hidden w-full md:w-[85vw]">
            <Outlet />
        </div>

    </div>
  )
}

export default DashBoardLayout