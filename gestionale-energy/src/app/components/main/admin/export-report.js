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
  return srvurl + '/plastic'; // Assuming '/plastic' endpoint returns the plastic types
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

  useEffect(() => {
    const fetchPlasticData = async () => {
      try {
        const resp = await fetch(getUrlPlastic());
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await resp.json();
        if (data.code === 0) {
          setPlasticData(data.data || []); // Assuming 'data' contains the list of plastics
        } else {
          setEmpty(true);
        }
      } catch (error) {
        console.error("Error fetching plastic data:", error);
      }
    };

    fetchPlasticData();
  }, [btnPressed]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = JSON.parse(Cookies.get('user-info') || '{}');
        const id_implant = cookies.id_implant;
        const url = getUrl();

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_implant }),
        });

        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await resp.json();
        if (data.code === 0) {
          const presserData = data.presser || [];
          const wheelmanData = data.wheelman || [];
          setCombinedData([...presserData, ...wheelmanData]);
        } else {
          setEmpty(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  const handleDownload = (reportType) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    
    worksheet.columns = [
      { header: "", key: "implant", width: 15 },
      { header: "", key: "code", width: 15 },
      { header: "", key: "plastic", width: 15 },
      { header: "", key: "weight", width: 15 },
      { header: "", key: "id", width: 15 },
      { header: "", key: "turn1", width: 15},
      { header: "", key: "turn2", width: 15},
      { header: "", key: "turn3", width: 15}
    ];

    worksheet.getCell('B1').value = new Date();
    worksheet.getCell('A4').value = 'IMPIANTO';
    worksheet.getCell('B4').value = 'CODICE';
    worksheet.getCell('C4').value = 'PRODOTTO';
    worksheet.getCell('D4').value = 'KG';
    worksheet.getCell('E4').value = 'ID';
    worksheet.getCell('F4').value = 'KG';
    worksheet.getCell('G4').value = 'ID';
    worksheet.getCell('H4').value = 'KG';
    worksheet.getCell('I4').value = 'ID';
    worksheet.getCell('D3').value = 'TURNO 1';
    worksheet.getCell('F3').value = 'TURNO 2';
    worksheet.getCell('H3').value = 'TURNO 3';

    plasticData.forEach((plastic) => {
      worksheet.addRow({
        plastic_type: plastic.plastic_type,
      });
    });

    combinedData.forEach((user) => {
      worksheet.addRow({
        
      });
    });

    switch (reportType) {
      case 'impianto-a': // GIOR. IMPIANTO A
        worksheet.getCell('A1').value = 'IMPIANTO A';
        break;

      case 'impianto-a-tempi': // GIOR. TEMPI IMP A
        worksheet.addRow(['Implant', 'A']);
        worksheet.addRow([1, 'Time data for Implant A']);
        break;

      case 'impianto-b': // GIOR. IMPIANTO B
        worksheet.getCell('A1').value = 'IMPIANTO B';
        break;

      case 'impianto-b-tempi': // GIOR. TEMPI IMP B
        worksheet.addRow(['Implant', 'B']);
        worksheet.addRow([1, 'Time data for Implant B']);
        break;

      case 'impianto-ab': // GIOR. IMPIANTO A e B
        worksheet.getCell('A1').value = 'IMPIANTO A e B';
        break;

      case 'impianto-ab-tempi': // GIOR. TEMPI IMP A e B
        worksheet.addRow(['Implant', 'A and B']);
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
