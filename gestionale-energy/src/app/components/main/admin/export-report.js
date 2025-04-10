'use client';
import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getServerRoute } from '@@/config';

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
  
  const [reportData, setReportData] = useState([]);
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setReportData([]);
        
        // Definisci gli impianti da considerare in base al pulsante premuto
        const implant = (btnPressed === 'impianto-a') ? [1] : 
                        (btnPressed === 'impianto-b') ? [2] : 
                        (btnPressed === 'impianto-ab') ? [1, 2] : 0;
      
        const url = getServerRoute("report-daily");
      
        if (implant === 0) {
          console.log("Impianto type is invalid.");
          return;
        }
      
        let allData = [];
  
        for (const i in implant) {
          console.log("Fetching data for Impianto:", implant[i]);
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ implant: implant[i] })
          });
  
          const data = await resp.json();
          console.log("Server Response:", data);
  
          if (data.code === 0) {
            allData.push(data.data);
          } else {
            setEmpty(true);
          }
        }
  
        if (allData.length > 0) {
          // Combina i dati degli impianti A e B se btnPressed è 'impianto-ab'
          if (btnPressed === 'impianto-ab') {
            const mergedData = [...allData[0], ...allData[1]];  // Unisce i dati dei due impianti
            setReportData(mergedData);
          } else {
            setReportData(allData[0]);  // Impianto singolo
          }
        }
  
      } catch (error) {
        console.error("Error Fetching Data:", error);
        setEmpty(true);
      }
    };
  
    if (btnPressed) {
      fetchReportData();
    }
  }, [btnPressed]);
  
  

  const handleDownload = (reportType) => {
    if (!reportData || reportData.length === 0) {
      console.log("No report data available for download.");
      return; // Return early if no data
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('IMPIANTO');

    worksheet.columns = [
      { header: "IMPIANTO", key: "", width: 10 },
      { header: "CODICE", key: "desc", width: 10 },
      { header: "PRODOTTO", key: "code", width: 15 },
      { header: "", key: "totale_peso_turno_1", width: 15 },
      { header: "", key: "totale_balle_turno_1", width: 15 },
      { header: "", key: "totale_peso_turno_2", width: 15 },
      { header: "", key: "totale_balle_turno_2", width: 15 },
      { header: "", key: "totale_peso_turno_3", width: 15 },
      { header: "", key: "totale_balle_turno_3", width: 15 },
      { header: "", key: "", width: 15 },
      { header: "", key: "", width: 15 },
      
    ];

    worksheet.getCell('A1').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

  const setCell = (cell, value, alignment = { vertical: 'middle', horizontal: 'center' }, font = null) => {
      worksheet.getCell(cell).value = value;
      worksheet.getCell(cell).alignment = alignment;
      if (font) worksheet.getCell(cell).font = font;
  };
  
  // Setting the cell 'F1' with date and font style
  setCell('F1', new Date(), { vertical: 'middle', horizontal: 'center' }, { bold: true, name: 'Arial' });
  
  // Setting values and alignments for header rows
  setCell('A4', 'IMPIANTO');
  setCell('B4', 'COD.');
  setCell('C4', 'PRODOTTO');
  setCell('D3', '1° TURNO');
  worksheet.mergeCells('D3:E3');
  setCell('D4', 'KG');
  setCell('E4', 'N° BALLE');
  
  setCell('F3', '2° TURNO');
  worksheet.mergeCells('F3:G3');
  setCell('F4', 'KG');
  setCell('G4', 'N° BALLE');
  
  setCell('H3', '3° TURNO');
  worksheet.mergeCells('H3:I3');
  setCell('H4', 'KG');
  setCell('I4', 'N° BALLE');
  
  setCell('J4', 'TOT.TURNO');
  setCell('K4', 'TOT.CHILI');

  const prova_array = {}; // All'interno i dati sono disposti correttamente

  // Unisci i dati da entrambi gli impianti
  reportData.forEach((report, index) => {
    report.forEach((item) => {
      const productCode = item.code;
  
      if (!prova_array[productCode]) {
        prova_array[productCode] = {
          codice: item.desc,
          totale_balle_1: 0,
          totale_peso_1: 0,
          totale_balle_2: 0,
          totale_peso_2: 0,
          totale_balle_3: 0,
          totale_peso_3: 0
        };
      }
  
      if (index === 0) {
        if (btnPressed === 'impianto-ab'){
          prova_array[productCode].totale_balle_3 += item.totale_balle;
          prova_array[productCode].totale_peso_3 += item.totale_peso;
        }
        else if (btnPressed === 'impianto-a' || btnPressed === 'impianto-b'){
        prova_array[productCode].totale_balle_1 += item.totale_balle;
        prova_array[productCode].totale_peso_1 += item.totale_peso;
        }
        
      } else if (index === 1) {
        prova_array[productCode].totale_balle_2 += item.totale_balle;
        prova_array[productCode].totale_peso_2 += item.totale_peso;
      } else {
        if (btnPressed === 'impianto-ab'){
          prova_array[productCode].totale_balle_1 += item.totale_balle;
          prova_array[productCode].totale_peso_1 += item.totale_peso;
        }
        else if (btnPressed === 'impianto-a' || btnPressed === 'impianto-b'){
          prova_array[productCode].totale_balle_3 += item.totale_balle;
          prova_array[productCode].totale_peso_3 += item.totale_peso;
        }
      } 
    });
  });

  
    
    var row = null;
    Object.keys(prova_array).forEach((index) => {
      console.log(prova_array[index], typeof prova_array[index].totale_peso_1, prova_array[index].totale_peso_1);
      row = worksheet.addRow({  
        desc: prova_array[index].codice,
        code: index,
        totale_peso_turno_1: Number(prova_array[index].totale_peso_1),
        totale_balle_turno_1: Number(prova_array[index].totale_balle_1),
        totale_peso_turno_2: Number(prova_array[index].totale_peso_2),  
        totale_balle_turno_2: Number(prova_array[index].totale_balle_2),  
        totale_peso_turno_3: Number(prova_array[index].totale_peso_3),  
        totale_balle_turno_3: Number(prova_array[index].totale_balle_3),
      });
    });

    // Totale Balle / Chili
    reportData.forEach((report) => {
      report.forEach((item, rowIndex) => {
        const rowNum = rowIndex + 5; 
        worksheet.getCell(`J${rowNum}`).value = { formula: `SUM(E${rowNum},G${rowNum},I${rowNum})` };
        worksheet.getCell(`K${rowNum}`).value = { formula: `SUM(D${rowNum},F${rowNum},H${rowNum})` };
      });
    });

    switch (reportType) {
      case 'impianto-a': // GIOR. IMPIANTO A
        for (let i = 5; i <= 28; i++) {
          worksheet.getCell(`A${i}`).value = 'A'; // Set the cell value to 'A' as a string
          worksheet.getCell(`A${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
          worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
        }
        break;
    
      case 'impianto-a-tempi': // GIOR. TEMPI IMP A
        for (let i = 5; i <= 28; i++) {
          worksheet.getCell(`A${i}`).value = 'A'; // Set the cell value to 'A' as a string
          worksheet.getCell(`A${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
          worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
        }
        break;
        
      case 'impianto-b': // GIOR. IMPIANTO B
      for (let i = 5; i <= 28; i++) {
        worksheet.getCell(`A${i}`).value = 'B'; // Set the cell value to 'A' as a string
        worksheet.getCell(`A${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
        break;
    
      case 'impianto-b-tempi': // GIOR. TEMPI IMP B
      for (let i = 5; i <= 28; i++) {
        worksheet.getCell(`A${i}`).value = 'B'; // Set the cell value to 'A' as a string
        worksheet.getCell(`A${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
        break;

      case 'impianto-ab': // GIOR. IMPIANTO A/B

      
      for (let i = 5; i <= 28; i++) {
        worksheet.getCell(`A${i}`).value = 'A/B'; // Set the cell value to 'A/B' as a string
        worksheet.getCell(`A${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
        break;

      case 'impianto-ab-tempi': // GIOR. TEMPI IMP A/B
      for (let i = 5; i <= 28; i++) {
        worksheet.getCell(`A${i}`).value = 'A/B'; // Set the cell value to 'A/B' as a string
        worksheet.getCell(`A${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
        break;

      default:
        console.error('Unknown report type:', reportType);
        return;
    }

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
    worksheet.getColumn('A').font = { bold: true, name: 'Calibri' };
    worksheet.getColumn('B').font = { bold: true, name: 'Calibri' };
    worksheet.getColumn('C').font = { bold: true, name: 'Calibri' };

    const applyBorders = (range) => {
      for (let row = range.start; row <= range.end; row++) {
        worksheet.getCell(`${range.col}${row}`).border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        };
      }
    };
    
    applyBorders({col: 'A', start: 4, end: 28});
    applyBorders({col: 'B', start: 4, end: 28});
    applyBorders({col: 'C', start: 4, end: 31});
    applyBorders({col: 'D', start: 3, end: 31});
    applyBorders({col: 'E', start: 4, end: 31});
    applyBorders({col: 'F', start: 3, end: 31});
    applyBorders({col: 'G', start: 4, end: 31});
    applyBorders({col: 'H', start: 3, end: 31});
    applyBorders({col: 'I', start: 4, end: 31});
    applyBorders({col: 'J', start: 4, end: 28});
    applyBorders({col: 'K', start: 4, end: 28});

    const calculateTotals = () => {
      worksheet.getCell(`D${worksheet.rowCount}`).value = { formula: `SUM(D5:D28)` };
      worksheet.getCell(`E${worksheet.rowCount}`).value = { formula: `SUM(E5:E28)` };
      worksheet.getCell(`F${worksheet.rowCount}`).value = { formula: `SUM(F5:F28)` };
      worksheet.getCell(`G${worksheet.rowCount}`).value = { formula: `SUM(G5:G28)` };
      worksheet.getCell(`H${worksheet.rowCount}`).value = { formula: `SUM(H5:H28)` };
      worksheet.getCell(`I${worksheet.rowCount}`).value = { formula: `SUM(I5:I28)` };
    };

    calculateTotals();

    const applyBoldToNonZeroValues = (worksheet) => {
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (cell.value !== 0) {
            cell.font = { name: 'Calibri', bold: true }; // Applica il grassetto se il valore è diverso da 0
          }
        });
      });
    };
    applyBoldToNonZeroValues(worksheet);

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${reportType}.xlsx`);
    });
  };

  useEffect(() => {
    if (reportData && btnPressed) {
      handleDownload(btnPressed);
    }
  }, [reportData]);
};

export default ExportReport;