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
  
  const [implantData, setImplantData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    
    // const setImplantDataFetch = async () => {
    //   switch (btnPressed) {
    //     case 'impianto-a':
    //       setImplantData({ id_implant: 2, letter: 'A' });
    //       break;
    //     case 'impianto-b':
    //       setImplantData({ id_implant: 1, letter: 'B' });
    //       break;
    //     default:
    //       setImplantData({ id_implant: 2, letter: 'A' });
    //       break;
    //   }
    // }
    // setImplantDataFetch();

    const fetchReportData = async () => {
      try {
        // console.log('prova inside ExportReport');
        const implant = (btnPressed == 'impianto-a') ? 2 : (btnPressed == 'impianto-b') ? 1 : 0;
        const url = getUrlReport();
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ implant })
        });

        const data = await resp.json();
        console.log(data);

        if (data.code === 0) {
          setReportData(data.data || null); // Set report data or null
          setEmpty(false); // Reset empty state
        } else {
          setEmpty(true); // Set empty state if no data is returned
        }
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
      { header: "IMPIANTO", key: "", width: 10 },
      { header: "CODICE", key: "desc", width: 10 },
      { header: "PRODOTTO", key: "code", width: 15 },
      { header: "", key: "totale_peso", width: 15 },
      { header: "", key: "", width: 15 },
      { header: "", key: "totale_peso", width: 15 },
      { header: "", key: "", width: 15 },
      { header: "", key: "totale_peso", width: 15 },
      { header: "", key: "", width: 15 },
      { header: "", key: "", width: 15 },
      /*{ header: "KG", key: "weight", width: 15 },
      { header: "", key: "turn1", width: 15 },
      { header: "", key: "turn2", width: 15 },
      { header: "", key: "turn3", width: 15 }*/
    ];

    worksheet.getCell('A1').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Customizing headers and alignment
    worksheet.getCell('F1').value = new Date();
    worksheet.getCell('F1').font = { bold: true, name: 'Arial' };
    worksheet.getCell('A4').value = 'IMPIANTO';
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B4').value = 'COD.';
    worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C4').value = 'PRODOTTO';
    worksheet.getCell('C4').alignment = { vertical: 'middle'};
    worksheet.getCell('D3').value = '1° TURNO';
    worksheet.mergeCells('D3:E3');
    worksheet.getCell('D3:E3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D4').value = 'KG';
    worksheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E4').value = 'N° BALLE';
    worksheet.getCell('E4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F3').value = '2° TURNO';
    worksheet.mergeCells('F3:G3');
    worksheet.getCell('F3:G3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F4').value = 'KG';
    worksheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G4').value = 'N° BALLE';
    worksheet.getCell('G4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H3').value = '3° TURNO';
    worksheet.mergeCells('H3:I3');
    worksheet.getCell('H3:I3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H4').value = 'KG';
    worksheet.getCell('H4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I4').value = 'N° BALLE';
    worksheet.getCell('I4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J4').value = 'TOT.TURNO';
    worksheet.getCell('J4').alignment = { vertical: 'middle', horizontal: 'center' };

    console.log("reportData:", reportData);

    const seenCodes = new Set();

    reportData.forEach((report, index) => {
      console.log(`Report at index ${index}:`, report);
      
      if (typeof report === 'object' && report !== null) {
        console.log(`Items in report ${index}:`, report);
        report.forEach((item, itemIndex) => {
          console.log(`Item ${itemIndex}:`, item, item.code);

          if (seenCodes.has(item.code)) {
            return;  
          }
          const row = worksheet.addRow({
              desc: item.desc,
              code: item.code,
              totale_peso: item.totale_peso,
              totale_balle: item.totale_balle,
          });

          seenCodes.add(item.code);

          switch (reportType) {
            case 'impianto-a': // GIOR. IMPIANTO A
              worksheet.getCell(`A${row.number}`).value = 'A';
              break;
            case 'impianto-a-tempi': // GIOR. TEMPI IMP A
              worksheet.getCell(`A${row.number}`).value = 'A';
              break;
            case 'impianto-b': // GIOR. IMPIANTO B
              worksheet.getCell(`A${row.number}`).value = 'B';  
              break;
            case 'impianto-b-tempi': // GIOR. TEMPI IMP B
              worksheet.getCell(`A${row.number}`).value = 'B';  
              break;
            case 'impianto-ab': // GIOR. IMPIANTO A e B
              worksheet.getCell(`A${row.number}`).value = 'AB';
              break;
            case 'impianto-ab-tempi': // GIOR. TEMPI IMP A e B
              worksheet.getCell(`A${row.number}`).value = 'AB';
              break;
            default:
              console.error('Unknown report type:', reportType);
              return;
          }

          worksheet.getCell(`A${row.number}`).alignment = { vertical: 'middle', horizontal: 'center' };
          worksheet.getCell(`B${row.number}`).alignment = { vertical: 'middle', horizontal: 'center' };
        });
      } else {
        console.error(`No items found or items is not an array in report ${index}`);
      }

    });

    switch (reportType) {
      case 'impianto-a': // GIOR. IMPIANTO A
        worksheet.getCell('A1').value = 'IMPIANTO A - REPORT GIORNALIERO PER TURNI DEL';
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').font = {  bold: true, name: 'Arial' }
        break;

      case 'impianto-a-tempi': // GIOR. TEMPI IMP A
        worksheet.addRow(['Implant', 'A']);
        worksheet.addRow([1, 'Time data for Implant A']);
        break;

      case 'impianto-b': // GIOR. IMPIANTO B
      worksheet.getCell('A1').value = 'IMPIANTO B - REPORT GIORNALIERO PER TURNI DEL';
      worksheet.mergeCells('A1:E1');
      worksheet.getCell('A1').font = {  bold: true, name: 'Arial' }
        break;

      case 'impianto-b-tempi': // GIOR. TEMPI IMP B
        worksheet.addRow(['Implant', 'B']);
        worksheet.addRow([1, 'Time data for Implant B']);
        break;

      case 'impianto-ab': // GIOR. IMPIANTO A e B
        worksheet.getCell('A1').value = 'IMPIANTO A e B - REPORT GIORNALIERO PER TURNI DEL';
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').font = {  bold: true, name: 'Arial' }
        break;

      case 'impianto-ab-tempi': // GIOR. TEMPI IMP A e B
        worksheet.addRow(['Implant', 'A and B']);
        worksheet.mergeCells('A1:E1');
        worksheet.addRow([1, 'Time data for both Implants']);
        break;

      default:
        console.error('Unknown report type:', reportType);
        return;
    }
    
    worksheet.getCell('C31').value = 'TOTALE';

    for (let row = 3; row <= 31; row++){
      worksheet.getRow(row).height = 20;
    }

    worksheet.getRow(3).font = { bold: true, name: 'Calibri' };
    worksheet.getRow(4).font = { bold: true, name: 'Calibri' };
    worksheet.getColumn('C').alignment = { vertical: 'middle' };
    worksheet.getCell('A3:A30').font = { bold: true, name: 'Calibri' };
    worksheet.getColumn('B').font = { bold: true, name: 'Calibri' };
    worksheet.getColumn('C').font = { bold: true, name: 'Calibri' };

    for (let row = 4; row <= 29; row++) {
      worksheet.getCell(`A${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 29; row++) {
      worksheet.getCell(`B${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 31; row++) {
      worksheet.getCell(`C${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 31; row++) {
      worksheet.getCell(`D${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 31; row++) {
      worksheet.getCell(`E${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 31; row++) {
      worksheet.getCell(`F${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 31; row++) {
      worksheet.getCell(`G${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 31; row++) {
      worksheet.getCell(`H${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 31; row++) {
      worksheet.getCell(`I${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    for (let row = 4; row <= 31; row++) {
      worksheet.getCell(`J${row}:J${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }

    worksheet.getCell('D3').border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    };

    worksheet.getCell('F3').border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    };

    worksheet.getCell('H3').border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    };
  
  

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