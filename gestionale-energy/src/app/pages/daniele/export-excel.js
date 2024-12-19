import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';

const srvurl = getSrvUrl();

const getUrl = () => {
    return srvurl + '/bale'
};

const ExportExcel = ({ userData }) => {
  const handleExport = async () => {
    // 1. Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Data");

    // 2. Add columns based on the user data fields (you can adjust this based on the actual fields)
    worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Plastica", key: "plastic", width: 30 },
        { header: "REI", key: "rei", width: 10 },
        { header: "Condizione", key: "condition", width: 10 },
        { header: "Data Inserimento", key: "data_ins", width: 10 },
        { header: "Codice", key: "code", width: 10 },
    ];

    // 3. Add rows from the user data
    userData.forEach((user) => {
      worksheet.addRow({ id: user.id, plastic: user.plastic, codice: user.codice, rei: user.rei, condition: user.condition, data_ins: user.data_ins, code: user.code });
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
      <button onClick={handleExport}>Export to Excel</button>
    </div>
  );
};

const UserComponent = ({ type = "presser" }) => {
  const [userData, setUserData] = useState([]);
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = await JSON.parse(Cookies.get('user-info'));
        const id_implant = cookies.id_implant;
        const url = getUrl();
        
        const resp = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ id_implant }),
        });

        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await resp.json();
        console.log(data);

        if (data.code === 0) {
          if (type === "presser")
            setUserData(data.presser);
          else if (type === "wheelman")
            setUserData(data.wheelman);
          else
            setUserData([]);
        } else {
          setEmpty(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [type]);

  return (
    <div>
      <h1>User Data</h1>
      {userData.length > 0 ? (
        <ExportExcel userData={userData} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default UserComponent;
