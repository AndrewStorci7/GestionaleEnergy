'use client';
import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { fetchReportData } from '@@/config';
import Alert from "../alert/alert";

/**
 * Handle download of the report
 * @param {Function} hookfetch Hook to call 
 * @param {String} reportInfo Type of the info:
 * * `impianto-a`
 * @param {Date} dateForReport 
 */
export const handleDownload = async (
  // hookfetch = fetchReportData,
  data,
  reportInfo,
  dateForReport
) => {

  // if (typeof hookfetch !== 'function') {
  //   console.error("No function hook passed to the function");
  // }

  console.log(reportInfo, dateForReport);

  const dateString = dateForReport // .toLocaleDateString('it-IT').split('/').join('');
  const dateStringNotSplitted = dateForReport // .toLocaleDateString('it-IT');
  // const data = await hookfetch(reportInfo, dateForReport);

  if (!data) {
    console.error("No data");
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
  // setCell('F1', dateStringNotSplitted, { vertical: 'middle', horizontal: 'center' }, { bold: true, name: 'Arial' });
  
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
  data.forEach((report, index) => {
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
        if (reportInfo === 'impianto-ab') {
          prova_array[productCode].totale_balle_3 += item.totale_balle;
          prova_array[productCode].totale_peso_3 += item.totale_peso;
        } else if (reportInfo === 'impianto-a' || reportInfo === 'impianto-b') {
          prova_array[productCode].totale_balle_1 += item.totale_balle;
          prova_array[productCode].totale_peso_1 += item.totale_peso;
        }
      } else if (index === 1) {
        prova_array[productCode].totale_balle_2 += item.totale_balle;
        prova_array[productCode].totale_peso_2 += item.totale_peso;
      } else {
        if (reportInfo === 'impianto-ab') {
          prova_array[productCode].totale_balle_1 += item.totale_balle;
          prova_array[productCode].totale_peso_1 += item.totale_peso;
        } else if (reportInfo === 'impianto-a' || reportInfo === 'impianto-b') {
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
  data.forEach((report) => {
    report.forEach((item, rowIndex) => {
      const rowNum = rowIndex + 5; 
      worksheet.getCell(`J${rowNum}`).value = { formula: `SUM(E${rowNum},G${rowNum},I${rowNum})` };
      worksheet.getCell(`K${rowNum}`).value = { formula: `SUM(D${rowNum},F${rowNum},H${rowNum})` };
    });
  });

  const letter = reportInfo.includes('impianto-a') ? 'A' :
                  reportInfo.includes('impianto-b') ? 'B' :
                  reportInfo.includes('impianto-ab') ? 'A/B' : null;

  for ( let i = 5; i <= 28; ++i ) {
    worksheet.getCell(`A${i}`).value = letter;
    worksheet.getCell(`A${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
  }

  worksheet.mergeCells('A1:G1');
  worksheet.getCell('A1').value = `IMPIANTO ${letter} - REPORT GIORNALIERO PER TURNI DEL ${dateStringNotSplitted}`;
  worksheet.getCell('A1').font = { bold: true, name: 'Arial', size: 14 }
  worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB8CCE4' } };
  
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

  worksheet.getCell(`D${worksheet.rowCount}`).value = { formula: `SUM(D5:D28)` };
  worksheet.getCell(`E${worksheet.rowCount}`).value = { formula: `SUM(E5:E28)` };
  worksheet.getCell(`F${worksheet.rowCount}`).value = { formula: `SUM(F5:F28)` };
  worksheet.getCell(`G${worksheet.rowCount}`).value = { formula: `SUM(G5:G28)` };
  worksheet.getCell(`H${worksheet.rowCount}`).value = { formula: `SUM(H5:H28)` };
  worksheet.getCell(`I${worksheet.rowCount}`).value = { formula: `SUM(I5:I28)` };

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value !== 0) {
        cell.font = { name: 'Calibri', bold: true }; // Applica il grassetto se il valore è diverso da 0
      }
    });
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `REPORT_${reportInfo}_${dateString}.xlsx`);
  });
};

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string} reportFor    Il tipo di report/esportazione 
 * Valori possibili : [
 *    'impianto-a',
 *    'impianto-a-tempi',
 *    'impianto-b', 
 *    'impianto-b-tempi,
 *    'impianto-ab',
 *    'impianto-ab-tempi',
 * ]
 */
const ExportReport = ({ 
  date = null,
  reportFor,
  className,
  children,
  ...props
}) => {

  const [dateForReport, setDateForReport] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scope, setScope] = useState('');

  useEffect(() => {
    setDateForReport(date);
  }, [date])

  const closeAlert = () => {
    setShowAlert(prev => !prev);
    // if (val) baleObj.setIdBale(null);
  };

  const handleAlert = async (msg, scope = "error") => {
    setScope(scope);
    setErrorMessage(msg);
    setShowAlert(prev => !prev);
  };

  const hookDownload = async () => {
    if (date === null || date === undefined) {
      handleAlert("Devi selezionare una data");
    } else {
      const data = await fetchReportData(reportFor, dateForReport); 
  
      await handleDownload(
        data,
        reportFor,
        dateForReport
      )
    }
  }

  return (
    <>
      <button
        className={`${className} ${props.disabled ? "opacity-60 cursor-not-allowed" : "transition-all hover:bg-sky-700 hover:text-white"}`} 
        onClick={hookDownload}
        {...props}
      >
        {children}
      </button>
      {showAlert && 
        <Alert
          handleClose={closeAlert}
          alertFor={scope}
          msg={errorMessage}
          // baleObj={baleObj}
        />
      }
    </>
  );

};

export default ExportReport;