'use client';

import React, { useState } from 'react';
import ExportReport from '@/app/components/main/admin/export-report';

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string}  downloadFor      
 * 
 * @param {any}     children    
 * 
 */
export default function BtnReport({ downloadFor, children }) {

  const [btnPressed, setBtnPressed] = useState(null); // Track which button was presse

  const handleDownloadClick = (reportType) => {
    setBtnPressed(reportType); // Set the type of the report to trigger download in ExportReport
  }

  // const handleDownload = () => {
  //   console.log(downloadFor);
  //   const fileName = `${downloadFor}_report.xlsx`; //XLSX
  //   const fileUrl = `/api/reports/${fileName}`; 

  //   const link = document.createElement('a');
  //   link.href = fileUrl;
  //   link.download = fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <>
      <button onClick={() => handleDownloadClick('impianto-a')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. IMPIANTO A</button>
      <button onClick={() => handleDownloadClick('impianto-a-tempi')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. TEMPI IMP A</button>
      <button onClick={() => handleDownloadClick('impianto-b')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. IMPIANTO B</button>
      <button onClick={() => handleDownloadClick('impianto-b-tempi')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. TEMPI IMP B</button>
      <button onClick={() => handleDownloadClick('impianto-ab')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. IMPIANTO A e B</button>
      <button onClick={() => handleDownloadClick('impianto-ab-tempi')} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. TEMPI IMP A e B</button>
      {/* <button onClick={handleDownload} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">
        {children}
      </button> */}
      <ExportReport btnPressed={btnPressed} />
    </>
  );
};
