import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";


const DashBoardLayout = () => {
  return (
    <div>

      <div className="bg-[#EFF2F9] h-screen flex-1 overflow-x-hidden w-full">
          <Outlet />
      </div>

    </div>
  )
}

export default DashBoardLayout