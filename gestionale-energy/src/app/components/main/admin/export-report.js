'use client';

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';

const srvurl = getSrvUrl();

const getUrl = () => {
  return srvurl + '/bale';
};

const getUrlPlastic = () => {
  return srvurl + '/plastic';  // Assuming '/plastic' endpoint returns the plastic types
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
  
  const [plasticData, setPlasticData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [isEmpty, setEmpty] = useState(false);
  const [plasticType, setPlasticType] = useState(null); // State for plastic type
  

  
  useEffect(() => {
    const fetchPlasticData = async () => {
      try {
        const url = getUrlPlastic(plasticType);
        const resp = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await resp.json();
        if (data.code === 0) {
          const query = `
            SELECT 
              code, 
              COUNT(*) AS bale_count, 
              SUM(weight) AS total_weight 
            FROM 
              bales 
            GROUP BY 
              code;
          `;
          setPlasticData(data.data || []); // Assuming 'data' contains the list of plastics
        } else {
          setEmpty(true);
        }
      } catch (error) {
        console.error("Error fetching plastic data:", error);
        setEmpty(true);
      }
    };

    fetchPlasticData();
    
  }, [btnPressed]);


  const handleDownload = (reportType) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    
    worksheet.columns = [
      { header: "", key: "implants", width: 10 },
      { header: "", key: "desc", width: 10,  },
      { header: "", key: "code", width: 15 },
      { header: "", key: "weight", width: 15 },
      { header: "", key: "", width: 15 },
      { header: "", key: "turn1", width: 15},
      { header: "", key: "turn2", width: 15},
      { header: "", key: "turn3", width: 15}
    ];

    worksheet.getCell('A1').border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };

    worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E1').value = new Date();
    worksheet.getCell('E1').font = {bold: true, name: 'Arial'};
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
    worksheet.getCell('D3').value = 'TURNO 1';
    worksheet.mergeCells('D3:E3');
    worksheet.getCell('D3:E3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F3').value = 'TURNO 2';
    worksheet.mergeCells('F3:G3');
    worksheet.getCell('F3:G3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H3').value = 'TURNO 3';
    worksheet.mergeCells('H3:I3');
    worksheet.getCell('H3:I3').alignment = { vertical: 'middle', horizontal: 'center' };


    plasticData
      .filter(plastic => plastic.code !== 'none') // Filter out plastics with code 'none'
      .forEach((plastic) => {
        const row = worksheet.addRow({
          desc: plastic.desc,
          code: plastic.code,
        });

      
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
