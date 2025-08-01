'use client';

import React, { useEffect, useState } from 'react';
import ExportReport from '@admin/export/export-report';
import Icon from '@main/get-icon';
import { reportFiltered } from '@admin/export/export-report-filtered';

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string}  downloadFor      
 * 
 * @param {any}     children    
 * 
 */
export default function BtnReport() {

  const [date, setDate] = useState(null); // data del report

  const COMMON_STYLE = "text-black font-semibold bg-sky-50 rounded-full text-sm px-2 py-2 text-center me-2 mb-3.5";

  useEffect(() => {
    console.log(date);
  }, [date]);

  return (
    <>
      <input aria-label="Date input" className="border-2 border-gray-300 p-1 mb-1.5 rounded-md" type="date" onChange={(e) => setDate(e.target.value)} /><br/>
      <ExportReport 
        date={date}
        reportFor={'impianto-a'} 
        className={COMMON_STYLE}
      >    
        GIOR. IMPIANTO A
      </ExportReport>
      <ExportReport 
        date={date}
        reportFor={'impianto-a-tempi'} 
        className={COMMON_STYLE}
        disabled
      >
        GIOR. TEMPI IMP A
      </ExportReport>
      <ExportReport
        date={date}
        reportFor={'impianto-b'} 
        className={COMMON_STYLE}
      >
        GIOR. IMPIANTO B
      </ExportReport>
      <ExportReport 
        date={date}
        reportFor={'impianto-b-tempi'} 
        className={COMMON_STYLE}
        disabled
      >
        GIOR. TEMPI IMP B
      </ExportReport>
      <ExportReport 
        date={date}
        reportFor={'impianto-ab'} 
        className={COMMON_STYLE}
      >
        GIOR. IMPIANTO A e B
      </ExportReport>
      <ExportReport 
        date={date}
        reportFor={'impianto-ab-tempi'} 
        className={COMMON_STYLE}
        disabled
      >
        GIOR. TEMPI IMP A e B
      </ExportReport>

      <button 
        onClick={() => {
          reportFiltered('impianto-a');
        }}
      >
        Esporta Report COREPLA
      </button>

      <div className="inline-flex items-center font-thin text-sm opacity-50">
        <Icon type="info" className="!text-gray-400" />
        I report giornalieri fanno riferimento alla data selezionata
      </div>
    </>
  );
};
