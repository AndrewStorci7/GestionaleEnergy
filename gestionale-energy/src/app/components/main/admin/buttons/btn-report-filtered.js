'use client'
import React, { useState } from 'react'
import { formattedDateTime } from '@config'
import SelectInput from '@main/search/select'
import { reportCorepla } from '@/app/components/main/admin/export/export-report-corepla'

const BtnReportFiltered = (
    reportFor,
) => {
    // date di default:
    // siccome in generale questo report verra' richiesot da COREPLA, la data e l'orario di default saranno impostati a 6:00 e 22:00 del giorno prima
    var today06 = new Date();
    var today22 = new Date();
    today06.setHours(6, 0, 0, 0);
    today22.setHours(22, 0, 0, 0);
    today06 = formattedDateTime(today06);
    today22 = formattedDateTime(today22);

    const [startDate, setStartDate] = useState(today06);
    const [endDate, setEndDate] = useState(today22);

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    return (
        <>
            <p className="ml-3 mb-1.5 font-bold">PERIODO</p>
            <input 
                className="border-2 border-gray-300 p-1 mb-1.5 rounded-md" 
                type="datetime-local" 
                defaultValue={today06} 
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input 
                className="border-2 border-gray-300 p-1 mb-1.5 rounded-md" 
                type="datetime-local" 
                defaultValue={today22} 
                onChange={(e) => setEndDate(e.target.value)}
            />
            <p className="ml-3 mb-1.5 font-bold">IMPIANTO</p>
            <SelectInput id="search-input-implants" searchFor={"implants"} isForSearch required />
            <p></p>
            <p className="ml-3 mb-1.5 font-bold">TIPO PLASTICA</p>
            <SelectInput id="search-input-plastic" searchFor={"plastic"} isForSearch />
            <p></p>
            <p></p>
            <button 
                className="text-black font-semibold bg-sky-50 rounded-full text-sm px-2 py-2 text-center me-2 mt-3 mb-3.5 transition-all hover:bg-sky-700 hover:text-white"
                // onClick={() => reportCorepla('impianto-a', { startDate: })}
            >
                GENERA REPORT
            </button>
        </>
    )
}

export default BtnReportFiltered;