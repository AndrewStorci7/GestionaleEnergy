'use client';

import React, { useState } from 'react';
import ExportReport from '@/app/components/main/admin/export-report';
import Icon from '../get-icon';

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string}  downloadFor      
 * 
 * @param {any}     children    
 * 
 */
export default function BtnReport({ 
  downloadFor, 
  children 
}) {

  const COMMON_STYLE = "text-black font-semibold bg-sky-50 rounded-full text-sm px-2 py-2 text-center me-2 mb-3.5";

  return (
    <>
      <ExportReport 
        reportFor={'impianto-a'} 
        className={COMMON_STYLE}
      >    
        GIOR. IMPIANTO A
      </ExportReport>
      <ExportReport 
        reportFor={'impianto-a-tempi'} 
        className={COMMON_STYLE}
        disabled
      >
        GIOR. TEMPI IMP A
      </ExportReport>
      <ExportReport
        reportFor={'impianto-b'} 
        className={COMMON_STYLE}
      >
        GIOR. IMPIANTO B
      </ExportReport>
      <ExportReport 
        reportFor={'impianto-b-tempi'} 
        className={COMMON_STYLE}
        disabled
      >
        GIOR. TEMPI IMP B
      </ExportReport>
      <ExportReport 
        reportFor={'impianto-ab'} 
        className={COMMON_STYLE}
      >
        GIOR. IMPIANTO A e B
      </ExportReport>
      <ExportReport 
        reportFor={'impianto-ab-tempi'} 
        className={COMMON_STYLE}
        disabled
      >
        GIOR. TEMPI IMP A e B
      </ExportReport>
      <div className="inline-flex items-center font-thin text-sm opacity-50">
        <Icon type="info" className="!text-gray-400" />
        I report giornalieri fanno riferimento al giorno precedente
      </div>
    </>
  );
};
