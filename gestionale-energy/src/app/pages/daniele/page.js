'use client';

import React, { useState } from "react";
import UserComponent from  "./export-excel"; 
import ExportExcel from "./export-excel"

export default function Home() {
    const [userType, setUserType] = useState("presser"); 
    return(
        <div>
      <h1>Test Page</h1>

      {/* Dropdown to select user type */}

      <UserComponent type={userType} />
    </div>
    );
}

