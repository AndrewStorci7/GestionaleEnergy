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

const ExportReport = ({ btnPressed }) => {
  const [implantData, setImplantData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const implant = (btnPressed == 'impianto-a') ? 2 : (btnPressed == 'impianto-b') ? 1 : 0;
        const url = getUrlReport();
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ implant })
        });

        const data = await resp.json();
        if (data.code === 0) {
          setReportData(data.data || null);
          setEmpty(false);
        } else {
          setEmpty(true);
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
        setEmpty(true);
      }
    };

    fetchReportData();
  }, [btnPressed]);

  const handleDownload = (reportType) => {
    if (!reportData || reportData.length === 0) {
      console.log("No report data available for download.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Define columns, including those for turns (now shifted)
    worksheet.columns = [
      { header: "IMPIANTO", key: "impianto", width: 10 },
      { header: "CODICE", key: "desc", width: 10 },
      { header: "PRODOTTO", key: "code", width: 15 },
      { header: "KG", key: "totale_peso", width: 15 },
      { header: "BALE", key: "totale_balle", width: 15 },
      { header: "Turno 1", key: "turn1", width: 15 },
      { header: "Turno 2", key: "turn2", width: 15 },
      { header: "Turno 3", key: "turn3", width: 15 }
    ];

    // Setting header and customizations
    worksheet.getCell('A1').value = new Date();
    worksheet.getCell('A1').font = { bold: true, name: 'Arial' };

    worksheet.getCell('A4').value = 'IMPIANTO';
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B4').value = 'CODICE';
    worksheet.getCell('C4').value = 'PRODOTTO';
    worksheet.getCell('D4').value = 'KG';
    worksheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E4').value = 'BALE';
    worksheet.getCell('E4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F4').value = 'Turno 1';
    worksheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G4').value = 'Turno 2';
    worksheet.getCell('G4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H4').value = 'Turno 3';
    worksheet.getCell('H4').alignment = { vertical: 'middle', horizontal: 'center' };

    // Fill rows with report data, distributing across turns based on index
    reportData.forEach((report, index) => {
      if (typeof report === 'object' && report !== null) {
        report.forEach((item, itemIndex) => {
          // Determine which "turn" this item should belong to based on its index
          let turn1 = '';
          let turn2 = '';
          let turn3 = '';
          
          if (itemIndex % 3 === 0) {
            turn1 = item.totale_peso; // Assign to Turn 1
          } else if (itemIndex % 3 === 1) {
            turn2 = item.totale_peso; // Assign to Turn 2
          } else if (itemIndex % 3 === 2) {
            turn3 = item.totale_peso; // Assign to Turn 3
          }

          const row = worksheet.addRow({
            impianto: item.impianto, // Will be 'A' or 'B' depending on the report
            desc: item.desc,
            code: item.code,
            totale_peso: item.totale_peso,
            totale_balle: item.totale_balle,
            turn1: turn1,
            turn2: turn2,
            turn3: turn3
          });

          // Moving data to specific cells based on row
          switch (reportType) {
            case 'impianto-a': 
            case 'impianto-a-tempi':
              worksheet.getCell(`A${row.number}`).value = 'A';
              worksheet.getCell(`F${row.number}`).value = turn1; // Turn 1 data
              worksheet.getCell(`G${row.number}`).value = turn2; // Turn 2 data
              worksheet.getCell(`H${row.number}`).value = turn3; // Turn 3 data
              break;
            case 'impianto-b':
            case 'impianto-b-tempi':
              worksheet.getCell(`A${row.number}`).value = 'B';
              worksheet.getCell(`F${row.number}`).value = turn1; // Turn 1 data
              worksheet.getCell(`G${row.number}`).value = turn2; // Turn 2 data
              worksheet.getCell(`H${row.number}`).value = turn3; // Turn 3 data
              break;
            case 'impianto-ab':
            case 'impianto-ab-tempi':
              worksheet.getCell(`A${row.number}`).value = 'AB';
              worksheet.getCell(`F${row.number}`).value = turn1; // Turn 1 data
              worksheet.getCell(`G${row.number}`).value = turn2; // Turn 2 data
              worksheet.getCell(`H${row.number}`).value = turn3; // Turn 3 data
              break;
            default:
              console.error('Unknown report type:', reportType);
              return;
          }
          worksheet.getCell(`A${row.number}`).alignment = { vertical: 'middle', horizontal: 'center' };
          worksheet.getCell(`B${row.number}`).alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }
    });

    switch (reportType) {
      case 'impianto-a':
        worksheet.getCell('A1').value = 'IMPIANTO A - REPORT GIORNALIERO PER TURNI DEL';
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').font = { bold: true, name: 'Arial' };
        break;
      case 'impianto-b':
        worksheet.getCell('A1').value = 'IMPIANTO B - REPORT GIORNALIERO PER TURNI DEL';
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').font = { bold: true, name: 'Arial' };
        break;
      case 'impianto-ab':
        worksheet.getCell('A1').value = 'IMPIANTO A e B - REPORT GIORNALIERO PER TURNI DEL';
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').font = { bold: true, name: 'Arial' };
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

  return <></>;
};

export default ExportReport;
