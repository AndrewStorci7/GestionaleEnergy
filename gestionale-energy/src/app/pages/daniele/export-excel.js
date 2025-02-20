import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getServerRoute } from '@@/config';
import Cookies from 'js-cookie';

const ExportExcel = ({ combinedData }) => {
  const handleExport = async () => {
    // 1. Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Data");

    // 2. Add columns based on the user data fields
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

    // 3. Add rows from the combined data
    combinedData.forEach((user) => {
      worksheet.addRow({
        implant: user.implant,
        code: user.code,
        plastic: user.plastic,
        kg: user.kg,
        id: user.id
      });
    });

    // 4. Add styling (optional)
    worksheet.getRow(1).font = { bold: true }; // Make the header row bold

    // 5. Export to a file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "UserData.xlsx");
  };

  return (
    <div>
      <button onClick={handleExport}>Export Presser & Wheelman Data</button>
    </div>
  );
};



const UserComponent = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = await JSON.parse(Cookies.get('user-info'));
        const id_implant = cookies.id_implant;
        const url = getServerRoute("bale");
        
        const resp = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ id_implant }),
        });

        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await resp.json();

        if (data.code === 0) {
          const presserData = data.presser || [];
          const wheelmanData = data.wheelman || [];
          setCombinedData([...presserData, ...wheelmanData]); // Combine both data sets
        } else {
          setEmpty(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>User Data</h1>
      {combinedData.length > 0 ? (
        <ExportExcel combinedData={combinedData} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};


export default UserComponent;
