'use client';
import React from 'react';

const DownloadReport = ({ downloadFor }) => {
  const handleDownload = () => {
    const fileName = `${downloadFor}_report.pdf`;
    const fileUrl = `/api/reports/${fileName}`; 

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload} className="download-report-btn">
      Scarica Report per {downloadFor}
    </button>
  );
};