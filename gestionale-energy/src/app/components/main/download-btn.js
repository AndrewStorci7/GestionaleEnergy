'use client';
import React from 'react';

const DownloadReport = ({ downloadFor, children }) => {
  const handleDownload = () => {
    console.log(downloadFor);
    const fileName = `${downloadFor}_report.xlsx`; //XLSX
    const fileUrl = `/api/reports/${fileName}`; 

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">
      {children}
    </button>
  );
};

export default DownloadReport;
