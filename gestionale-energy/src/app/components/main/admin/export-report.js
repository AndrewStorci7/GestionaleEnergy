'use client';
import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { fetchReportData } from '@@/config';
import { useAlert } from "../alert/alertProvider";

import PropTypes from "prop-types"; // per ESLint

// formula per arrotondare un numero
const createRoundingFormula = (sumFormula) => {
  return `IF(MOD(${sumFormula},10)>5,ROUNDUP(${sumFormula},-1),IF(MOD(${sumFormula},10)<=5,ROUNDDOWN(${sumFormula},-1),${sumFormula}))`;
};

/**
 * Handle download of the report
 * @param {Function} hookfetch Hook to call 
 * @param {String} reportInfo Type of the info:
 * * `impianto-a`
 * @param {Date} dateForReport 
 */
export const handleDownload = async (
  data,
  reportInfo,
  dateForReport
) => {

  const dateString = dateForReport // .toLocaleDateString('it-IT').split('/').join('');
  const dateStringNotSplitted = dateForReport // .toLocaleDateString('it-IT');
  var dimensione = 0; // Viene poi calcolata con `prova_array`
  const gapFineConteggioCelle = 11; // valore da aggiungere alla dimensione per il totale delle righe
  const gapInizioConteggioCelle = 4; // valore della cella di partenza per il totale delle righe
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
    { header: "MAGAZZINO", key: "magazzino", width: 15 },
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
  
  // Setting values and alignments for header rows
  setCell('A4', 'IMPIANTO');
  setCell('B4', 'COD.');
  setCell('C4', 'PRODOTTO');
  setCell('D4', 'MAGAZZINO');
  setCell('E3', '1° TURNO');
  worksheet.mergeCells('E3:F3');
  setCell('E4', 'KG');
  setCell('F4', 'N° BALLE');
  
  setCell('G3', '2° TURNO');
  worksheet.mergeCells('G3:H3');
  setCell('G4', 'KG');
  setCell('H4', 'N° BALLE');

  setCell('I3', '3° TURNO');
  worksheet.mergeCells('I3:J3');
  setCell('I4', 'KG');
  setCell('J4', 'N° BALLE');
  
  setCell('K3', 'GIORNO');
  worksheet.mergeCells('K3:L3');

  setCell('K4', 'TOT.GIORNO');
  setCell('L4', 'TOT.CHILI');

  const prova_array = {};

  var count = 0; // conta per i turni
  data.forEach((report, index) => {
    console.log(index, report);
    report.forEach((item) => {
      const productCode = item.code;
      const provvisorio = item.code.includes('MDR') ? 'Provvisorio' : 'Interno';
  
      if (index === 0 && !prova_array[productCode]) {
        prova_array[productCode] = {
          codice: item.desc,
          magazzino: provvisorio,
          totale_balle_1: 0,
          totale_peso_1: 0,
          totale_balle_2: 0,
          totale_peso_2: 0,
          totale_balle_3: 0,
          totale_peso_3: 0
        };
      }
  
      if (count === 0) {
        prova_array[productCode].totale_balle_1 += Number(item.totale_balle);
        prova_array[productCode].totale_peso_1 += Number(item.totale_peso);
      } else if (count === 1) {
        prova_array[productCode].totale_balle_2 += Number(item.totale_balle);
        prova_array[productCode].totale_peso_2 += Number(item.totale_peso);
      } else if (count === 2) {
        prova_array[productCode].totale_balle_3 += Number(item.totale_balle);
        prova_array[productCode].totale_peso_3 += Number(item.totale_peso);
      } 
    });
    count = (count + 1) % 3; // Incrementa il turno e resetta dopo il terzo
  });
  
  var row = null;
  // oggetto che conterrà gli indici delle celle che serviranno per i conteggi di FERRO, ALLUMINIO e MDR
  // serviranno per gestire il conteggio totale del giorno
  var specialIndex = { ferro: [], alluminio: [], mdr: [] };
  const indexTotalCount = new Set(); // Insieme degli indici da sommare nel conteggio totale del giorno

  Object.keys(prova_array).forEach((index) => {
    console.log(prova_array[index]);
    row = worksheet.addRow({  
      desc: prova_array[index].codice,
      code: index,
      magazzino: prova_array[index].magazzino,
      totale_peso_turno_1: Number(prova_array[index].totale_peso_1),
      totale_balle_turno_1: Number(prova_array[index].totale_balle_1),
      totale_peso_turno_2: Number(prova_array[index].totale_peso_2),  
      totale_balle_turno_2: Number(prova_array[index].totale_balle_2),  
      totale_peso_turno_3: Number(prova_array[index].totale_peso_3),  
      totale_balle_turno_3: Number(prova_array[index].totale_balle_3),
    });

    // ALLUMINIO SI TROVA SEMPRE IN PRIMA POSIZIONE
    if (prova_array[index].codice == 20050 && index.includes('ALLUM')) {
      specialIndex.alluminio.push(row.number);
    } else if (prova_array[index].codice == 20050 && index.includes('FERRO')) {
      specialIndex.ferro.push(row.number);
    } else if (index.includes('MDR')) {
      specialIndex.mdr.push(row.number);
    } else if (!index.includes('TL/ING') && !index.includes('CSS') && !index.includes('ING')) {
      indexTotalCount.add(row.number);
    }
  });

  dimensione = Object.keys(prova_array).length;

  // Totale Balle / Chili sulle colonne K e L che fanno il conteggio totale per ogni tipo
  data.forEach((report) => {
    report.forEach((item, rowIndex) => {
      const rowNum = rowIndex + 5; 
      worksheet.getCell(`K${rowNum}`).value = { formula: `SUM(F${rowNum},H${rowNum},J${rowNum})` };
      // MODIFICA: Applica l'arrotondamento personalizzato ai totali chili
      worksheet.getCell(`L${rowNum}`).value = { 
        formula: createRoundingFormula(`SUM(E${rowNum},G${rowNum},I${rowNum})`) 
      };
    });
  });

  const letter = reportInfo.includes('impianto-ab') ? 'A/B':
                  reportInfo.includes('impianto-a') ? 'A' :
                  reportInfo.includes('impianto-b') ? 'B' : null;

  for ( let i = 0; i < dimensione; ++i ) {
    worksheet.getCell(`A${i + 5}`).value = letter;
    worksheet.getCell(`A${i + 5}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`B${i + 5}`).alignment = { vertical: 'middle', horizontal: 'center' };
  }

  // TITOLO
  worksheet.mergeCells('A1:G1');
  worksheet.getCell('A1').value = `IMPIANTO ${letter} - REPORT GIORNALIERO PER TURNI DEL ${dateStringNotSplitted}`;
  worksheet.getCell('A1').font = { bold: true, name: 'Arial', size: 14 }
  worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB8CCE4' } };

  const dimFixed = dimensione + gapInizioConteggioCelle + 2
  worksheet.getCell(`C${dimFixed}`).value = 'TOT. FERRO';
  worksheet.getCell(`D${dimFixed}`).value = 'Interno';
  worksheet.getCell(`C${dimFixed + 1}`).value = 'TOT. ALLUM.';
  worksheet.getCell(`D${dimFixed + 1}`).value = 'Interno';
  worksheet.getCell(`C${dimFixed + 2}`).value = 'TOT. MDR';
  worksheet.getCell(`D${dimFixed + 2}`).value = 'Provvisorio';
  worksheet.getCell(`C${dimFixed + 3}`).value = 'TOT. GIORNO';
  worksheet.getCell(`D${dimFixed + 3}`).value = 'Interno';
  worksheet.getCell(`C${dimFixed + 5}`).value = 'TOTALE';

  // Conteggio balle ALLUMINIO, FERRO e MDR
  // 6 è il numero delle colonne che vengono utilizzate per i conteggi
  var charInizio = "E";
  for ( let y = 0; y < 6; ++y ) {
    var indiceInizioTotali = 0;
    Object.keys(specialIndex).forEach((key) => {
      // console.log(key, specialIndex[key]);
      var sum = 'SUM(';
      for ( let i = 0; i < specialIndex[key].length; ++i ) {
        sum += i === specialIndex[key].length - 1 ? `${charInizio}${specialIndex[key][i]})` : `${charInizio}${specialIndex[key][i]},`;
      }

      if (charInizio.charCodeAt(0) % 2 !== 0) {
        worksheet.getCell(`${charInizio}${dimFixed + indiceInizioTotali}`).value = { formula: createRoundingFormula(sum) };
      } else {
        worksheet.getCell(`${charInizio}${dimFixed + indiceInizioTotali}`).value = { formula: sum };
      }
      ++indiceInizioTotali;
    });
    charInizio = String.fromCharCode(charInizio.charCodeAt(0) + 1); // Incrementa la lettera per la colonna successiva
  }

  charInizio = "E";
  // Conteggio del taotale del giorno escludendo ALLUM, FERRO, CSS e TL/ING
  for ( let i = 0; i < 6; ++i ) {
    var sum = 'SUM(';
    for ( let j = 0; j < indexTotalCount.size; ++j ) {
      sum += j === indexTotalCount.size - 1 ? `${charInizio}${Array.from(indexTotalCount)[j]})` : `${charInizio}${Array.from(indexTotalCount)[j]},`;
    }

    if (charInizio.charCodeAt(0) % 2 !== 0) {
      worksheet.getCell(`${charInizio}${dimFixed + 3}`).value = { formula: createRoundingFormula(sum) };
    } else {
      worksheet.getCell(`${charInizio}${dimFixed + 3}`).value = { formula: sum };
    }
    charInizio = String.fromCharCode(charInizio.charCodeAt(0) + 1); // Incrementa la lettera per la colonna successiva
  }

  for ( let row = 0; row < dimensione + gapFineConteggioCelle; ++row ) {
    worksheet.getRow(row + 3).height = 20;
  }

  worksheet.getRow(3).font = { bold: true, name: 'Calibri' };
  worksheet.getRow(4).font = { bold: true, name: 'Calibri' };
  worksheet.getColumn('C').alignment = { vertical: 'middle' };
  worksheet.getColumn('A').font = { bold: true, name: 'Calibri' };
  worksheet.getColumn('B').font = { bold: true, name: 'Calibri' };
  worksheet.getColumn('C').font = { bold: true, name: 'Calibri' };
  worksheet.getColumn('D').font = { bold: true, name: 'Calibri' };

  const applyBorders = (range) => {
    for ( let row = range.start; row <= range.end; ++row ) {
      worksheet.getCell(`${range.col}${row}`).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }
  };
  
  applyBorders({ col: 'A', start: gapInizioConteggioCelle, end: dimensione + gapInizioConteggioCelle });
  applyBorders({ col: 'B', start: gapInizioConteggioCelle, end: dimensione + gapInizioConteggioCelle });
  applyBorders({ col: 'C', start: gapInizioConteggioCelle, end: dimensione + gapFineConteggioCelle });
  applyBorders({ col: 'D', start: gapInizioConteggioCelle, end: dimensione + gapFineConteggioCelle });
  applyBorders({ col: 'E', start: gapInizioConteggioCelle - 1, end: dimensione + gapFineConteggioCelle });
  applyBorders({ col: 'F', start: gapInizioConteggioCelle, end: dimensione + gapFineConteggioCelle });
  applyBorders({ col: 'G', start: gapInizioConteggioCelle - 1, end: dimensione + gapFineConteggioCelle });
  applyBorders({ col: 'H', start: gapInizioConteggioCelle, end: dimensione + gapFineConteggioCelle });
  applyBorders({ col: 'I', start: gapInizioConteggioCelle - 1, end: dimensione + gapFineConteggioCelle });
  applyBorders({ col: 'J', start: gapInizioConteggioCelle, end: dimensione + gapFineConteggioCelle });
  applyBorders({ col: 'K', start: gapInizioConteggioCelle, end: dimensione + gapInizioConteggioCelle });
  applyBorders({ col: 'L', start: gapInizioConteggioCelle, end: dimensione + gapInizioConteggioCelle });

  // Conteggio balle totali
  worksheet.getCell(`E${dimensione + gapFineConteggioCelle}`).value = { 
    formula: createRoundingFormula(`SUM(E5:E${dimensione + gapInizioConteggioCelle})`) 
  };
  worksheet.getCell(`F${dimensione + gapFineConteggioCelle}`).value = { formula: `SUM(F5:F${dimensione + gapInizioConteggioCelle})` };
  worksheet.getCell(`G${dimensione + gapFineConteggioCelle}`).value = { 
    formula: createRoundingFormula(`SUM(G5:G${dimensione + gapInizioConteggioCelle})`) 
  };
  worksheet.getCell(`H${dimensione + gapFineConteggioCelle}`).value = { formula: `SUM(H5:H${dimensione + gapInizioConteggioCelle})` };
  worksheet.getCell(`I${dimensione + gapFineConteggioCelle}`).value = { 
    formula: createRoundingFormula(`SUM(I5:I${dimensione + gapInizioConteggioCelle})`) 
  };
  worksheet.getCell(`J${dimensione + gapFineConteggioCelle}`).value = { formula: `SUM(J5:J${dimensione + gapInizioConteggioCelle})` };

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
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
  disabled = false,
  ...props
}) => {

  const { showAlert } = useAlert();

  const [dateForReport, setDateForReport] = useState(null);

  useEffect(() => {
    setDateForReport(date);
  }, [date])

  const hookDownload = async () => {
    if (!dateForReport) {
      showAlert({
        title: null,
        message: "Devi selezionare una data",
      })
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
    <button
      className={`${className} ${disabled ? "opacity-60 cursor-not-allowed" : "transition-all hover:bg-sky-700 hover:text-white"}`} 
      onClick={hookDownload}
      {...props}
    >
      {children}
    </button>
  );

};

ExportReport.propTypes = {
  date: PropTypes.string,
  reportFor: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

export default ExportReport;