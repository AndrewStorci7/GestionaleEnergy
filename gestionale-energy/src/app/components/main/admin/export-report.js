'use client';

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';

const srvurl = getSrvUrl();

const getUrlReport = () => {
  return srvurl + '/report';
};

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string} btnPressed    Il tipo di report/esportazione 
 * Valori possibili : [
 *    'impianto-a',
 *    'impianto-a-tempi',
 *    'impianto-b', 
 *    'impianto-b-tempi,
 *    'impianto-ab',
 *    'impianto-ab-tempi',
 * ]
 */
const ExportReport = ({ btnPressed }) => {
  
  const [reportData, setReportData] = useState(null);
  const [isEmpty, setEmpty] = useState(false);
  
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        console.log('prova inside ExportReport');
        const implant = (btnPressed == 'impianto-a') ? 2 : (btnPressed == 'impianto-b') ? 1 : 0;
        const url = getUrlReport();
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ implant })
        });

        const data = await resp.json();
        console.log(data);

       {/* if (data.code === 0) {
          setReportData(data.data|| null); // Set report data or null
          setEmpty(false); // Reset empty state
        } else {
          setEmpty(true); // Set empty state if no data is returned
        }*/}
      } catch (error) {
        console.error("Error Fetching Data:", error);
        setEmpty(true); // Set empty state on error
      }
    };

    fetchReportData();
    
  }, [btnPressed]);

  const handleDownload = (reportType) => {

    if (!reportData || reportData.length === 0) {
      console.log("No report data available for download.");
      return; // Return early if no data
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Define columns
    worksheet.columns = [
      { header: "IMPIANTO", key: "code", width: 10 },
      { header: "CODICE", key: "totale_peso", width: 15 },
      { header: "PRODOTTO", key: "totale_balle", width: 15 },
    ];

    worksheet.getCell('A1').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Customizing headers and alignment
    worksheet.getCell('E1').value = new Date();
    worksheet.getCell('E1').font = { bold: true, name: 'Arial' };
    worksheet.getCell('A4').value = 'IMPIANTO';
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B4').value = 'CODICE';
    worksheet.getCell('C4').value = 'PRODOTTO';
    worksheet.getCell('D4').value = 'KG';
    worksheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E4').value = 'ID';
    worksheet.getCell('E4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F4').value = 'KG';
    worksheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G4').value = 'ID';
    worksheet.getCell('G4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H4').value = 'KG';
    worksheet.getCell('H4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I4').value = 'ID';
    worksheet.getCell('I4').alignment = { vertical: 'middle', horizontal: 'center' };
    console.log("Report Data:", reportData);
    // Fill rows with report data
    reportData.forEach((report, index) => {
        
        const row = worksheet.addRow({
          
            code: report.code, 
            totale_peso: report.totale_peso, 
            totale_balle: report.totale_balle, 

        });
      
     
      
      worksheet.getCell(`A${row.number}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(`B${row.number}`).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    

    switch (reportType) {
      case 'impianto-a': // GIOR. IMPIANTO A
        worksheet.getCell('A1').value = 'IMPIANTO A - REPORT GIORNALIERO PER TURNI DEL';
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').font = {  bold: true, name: 'Arial' }
        break;

      case 'impianto-a-tempi': // GIOR. TEMPI IMP A
        worksheet.addRow(['Implant', 'A']);
        worksheet.addRow([1, 'Time data for Implant A']);
        break;

      case 'impianto-b': // GIOR. IMPIANTO B
      worksheet.getCell('A1').value = 'IMPIANTO B - REPORT GIORNALIERO PER TURNI DEL';
      worksheet.mergeCells('A1:D1');
      worksheet.getCell('A1').font = {  bold: true, name: 'Arial' }
        break;

      case 'impianto-b-tempi': // GIOR. TEMPI IMP B
        worksheet.addRow(['Implant', 'B']);
        worksheet.addRow([1, 'Time data for Implant B']);
        break;

      case 'impianto-ab': // GIOR. IMPIANTO A e B
        worksheet.getCell('A1').value = 'IMPIANTO A e B - REPORT GIORNALIERO PER TURNI DEL';
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').font = {  bold: true, name: 'Arial' }
        break;

      case 'impianto-ab-tempi': // GIOR. TEMPI IMP A e B
        worksheet.addRow(['Implant', 'A and B']);
        worksheet.mergeCells('A1:D1');
        worksheet.addRow([1, 'Time data for both Implants']);
        break;

      default:
        console.error('Unknown report type:', reportType);
        return;
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${reportType}.xlsx`);
    });
  };

  useEffect(() => {
    if (btnPressed) {
      handleDownload(btnPressed);
    }
  }, [btnPressed]);
};

export default ExportReport;