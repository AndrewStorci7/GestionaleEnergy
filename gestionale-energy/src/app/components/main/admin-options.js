'use client';

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string}  reportType    Il tipo di report/esportazione ['file1','file2','file3','file4','file5','file6']
 * 
 * @returns 
 */

const srvurl = getSrvUrl();

const getUrl = () => {
  return srvurl + '/bale';
};

const AdminPanel = ({ btnPressed }) => {
  const [combinedData, setCombinedData] = useState([]);
  const [isEmpty, setEmpty] = useState(false);

  
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
      { header: "Impianto", key: "implant", width: 15 },
      { header: "Codice", key: "code", width: 15 },
      { header: "Prodotto", key: "plastic", width: 15 },
      { header: "Kg", key: "kg", width: 15 },
      { header: "ID", key: "id", width: 15 }
    ];

    worksheet.getCell('B1').value = new Date();
    worksheet.getCell('A4').value = 'IMPIANTO';
    worksheet.getCell('B4').value = 'CODICE';
    worksheet.getCell('C4').value = 'PRODOTTO';
    worksheet.getCell('D4').value = 'KG';
    worksheet.getCell('E4').value = 'ID';

    combinedData.forEach((user) => {
      worksheet.addRow({
        implant: user.implant,
        code: user.code,
        plastic: user.plastic,
        kg: user.kg,
        id: user.id
      });
    });

    switch (reportType) {
      case 'file1': // GIOR. IMPIANTO A
        worksheet.addRow(['Implant', 'A']);
        worksheet.addRow([1, 'Data for Implant A']);
        break;

      case 'file2': // GIOR. TEMPI IMP A
        worksheet.addRow(['Implant', 'A']);
        worksheet.addRow([1, 'Time data for Implant A']);
        break;

      case 'file3': // GIOR. IMPIANTO B
        worksheet.addRow(['Implant', 'B']);
        worksheet.addRow([1, 'Data for Implant B']);
        break;

      case 'file4': // GIOR. TEMPI IMP B
        worksheet.addRow(['Implant', 'B']);
        worksheet.addRow([1, 'Time data for Implant B']);
        break;

      case 'file5': // GIOR. IMPIANTO A e B
        worksheet.addRow(['Implant', 'A and B']);
        worksheet.addRow([1, 'Data for both Implants']);
        break;

      case 'file6': // GIOR. TEMPI IMP A e B
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

export default AdminPanel;
