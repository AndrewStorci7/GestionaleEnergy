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
      <select onChange={(e) => setUserType(e.target.value)} value={userType}>
        <option value="presser">Presser</option>
        <option value="wheelman">Wheelman</option>
        <option value="admin">Admin</option>
        <option value="both">Both</option>
      </select>

      <UserComponent type={userType} />
    </div>
    );
}

