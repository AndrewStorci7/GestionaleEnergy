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

  return (
    <>
      <ExportReport 
        reportFor={'impianto-a'} 
        className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5"
      >    
        GIOR. IMPIANTO A
      </ExportReport>
      <ExportReport 
        reportFor={'impianto-a-tempi'} 
        className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5"
      >
        GIOR. TEMPI IMP A
      </ExportReport>
      <ExportReport
        reportFor={'impianto-b'} 
        className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5"
      >
        GIOR. IMPIANTO B
      </ExportReport>
      <ExportReport 
        reportFor={'impianto-b-tempi'} 
        className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5"
      >
        GIOR. TEMPI IMP B
      </ExportReport>
      <ExportReport 
        reportFor={'impianto-ab'} 
        className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5"
      >
        GIOR. IMPIANTO A e B
      </ExportReport>
      <ExportReport 
        reportFor={'impianto-ab-tempi'} 
        className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5"
      >
        GIOR. TEMPI IMP A e B
      </ExportReport>
    </>
  );
};
