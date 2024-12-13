'use client'

import TableHeader from "./table-header";
import CheckButton from "../select-button";
import Icon from "../get-icon";
import TableContent from "./table-content";
import DownloadReport from "../download-btn"
import SelectInput from "../search/select";

import { useState } from "react";

/**
 * Table
 * 
 * @param {string}  type    [ 'presser' | 'wheelman' | 'both' | 'admin' ] 
 * 
 * @param {boolean} add     True se il bottone aggiungi è stato cliccato
 *                          Per default è settato a false
 * 
 * @param {object}  dataNew Oggetto contenente gli ID delle due nuove balle aggiunte.
 *                          L'oggetto sarà diverso da null quando verrà cliccato il bottone aggiungi  
 * @returns 
 */
export default function Table({ type, add = false, emptyData, dataNew }) {
    
    /// Common style
    const _CMNSTYLE_TITLE = "text-3xl font-bold";
    const _CMNSTYLE_DIV = "grid grid-cols-2 gap-2 pt-[30px] relative mt-[20px] h-[60vh] overflow-y-scroll"; // inset-0 shadow-inner 
    const _CMNSTYLE_TABLE = "table-auto border-collapse border border-slate-400 w-full rounded-tl-[10px] text-left mt-[10px] h-fit"; 
    const _CMNSTYLE_LABEL = "absolute top-[-10px] font-bold text-2xl px-[15px] rounded-[5px] mt-[10px]";
    const _CMNSTYLE_SECONDARY = "bg-thirdary left-[50%] ml-[4px] opacity-50";
    const _CMN_ONLY_VIEW = <span className="text-extrabold"> <u>solo visualizzazione</u></span>

    switch (type) {
        case "admin": {
            return(
                <>
                    <h1 className={_CMNSTYLE_TITLE}>Pagina Amminstratore Sviluppatore</h1>
                    <p>In fase di sviluppo</p>
                    {/* <div className={_CMNSTYLE_DIV} style={{ boxShadow: 'inset 0 -8px 6px rgba(91, 75, 73, 0.2)' }}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={`${_CMNSTYLE_TABLE}` }>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} add={add} ids={dataNew} noData={noData} primary />
                        </table>

                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY} text-black`}>
                            Carrellista
                            {_CMN_ONLY_VIEW}
                        </label>
                        <table id="gest-on-table2" className={`${_CMNSTYLE_TABLE}`}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"} add={add} />
                        </table>

                        <p className={`${(isEmpty) ? "visible" : "invisible"}`}>
                            {}
                        </p>
                    </div> */}
                </>
            );
        }
        case "presser": {
            return(
                <>
                    {/* <h1 className={_CMNSTYLE_TITLE}>Pagina Pressista</h1> */} 
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-primary `}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} add={add} ids={dataNew} noData={emptyData} primary />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"} add={add} />
                        </table>
                    </div>

                    {/* <div className={`${(isEmpty || !add) ? "visible" : "invisible"} ${_CMNSTYLE_DIV_EMPTY}`}>
                        <h1 className={`${_CMNSTYLE_EMPTY}`}>
                            {msgEmpty}
                        </h1>
                    </div> */}
                </>
            );
        }
        case "wheelman": {
            return(
                <>
                    {/* <h1 className={_CMNSTYLE_TITLE}>Pagina Carrellista</h1> */}
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table"  className={`${_CMNSTYLE_LABEL} text-white bg-secondary`} >Carrellista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"} primary />
                            <TableContent type={"wheelman"} add={add} ids={dataNew} noData={noData} primary />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>
                            Pressista
                            {_CMN_ONLY_VIEW} 
                        </label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} />
                            <TableContent type={"presser"} add={add} />
                        </table>
                    </div>
                </>
            );
        }
        case 'both': {
            return(
                <>
                    {/* <h1 className={_CMNSTYLE_TITLE}>Pagina Amministratore Interno</h1> */}
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                       {/* <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"}/>
                            <TableContent type={"presser"}/>
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"}/>
                        </table>
                       */}
                       <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} bg-thirdary_1 `}>Amministrazione</label>
                       <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>Carrellista</label>
                       <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} bg-primary`}>Pressista</label>
                       <div className="grid-cols-1 bg-blue-100	mt-5 border-2 border-slate-400">
                         <h1 className="text-center font-bold bg-blue-500 text-xl">REPORT PREDEFINITI</h1>
                         <div className="grid grid-cols-2 gap-1 mt-20">
                           <DownloadReport downloadFor={"file1"}>GIOR. IMPIANTO A</DownloadReport>
                           <DownloadReport downloadFor={"file2"}>GIOR. TEMPI IMP A</DownloadReport>
                           <DownloadReport downloadFor={"file3"}> GIOR. IMPIANTO B</DownloadReport>
                           <DownloadReport downloadFor={"file4"}>GIOR. TEMPI IMP B</DownloadReport>
                           <DownloadReport downloadFor={"file5"}>GIOR. IMPIANTO A e B</DownloadReport>
                           <DownloadReport downloadFor={"file6"}>GIOR. TEMPI IMP A e B</DownloadReport>
                         </div>
                        </div>
                       <div className="grid-cols-1 bg-blue-100	 border-2 border-slate-400 mt-5">
                         <h1 className="text-center font-bold bg-blue-500 text-xl">REPORT DA FILTRI</h1>
                         <div className="grid grid-cols-3 gap-1 mt-20">
                          <p className="ml-3 mb-1.5">PERIODO</p>
                          <input className=" mb-1.5" type="date"></input>
                          <input className=" mb-1.5" type="date"></input>
                          <p className="ml-3 mb-1.5">IMPIANTO</p>
                          <SelectInput id="search-input-implants" searchFor={"implants"} />
                          <p></p>
                          <p className="ml-3 mb-1.5">TIPO PLASTICA</p>
                          <SelectInput id="search-input-plastic" searchFor={"plastic"} />
                          <p></p>
                          <p className="ml-3 mb-1.5">PESO</p>
                          <select name="peso" id="pesoid"> 
                            <option value="esempio_a">-</option>
                          </select>
                        <p></p>
                        <p className="ml-3 mb-1.5">TURNO</p>
                        <select name="turno" id="turnoid">
                            <option value="esempio_a">-</option>
                        </select>
                        <p></p>
                       <p></p>
                        <button  className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">VISUALIZZA</button>
                        <DownloadReport  downloadFor={"File_Scaricato"} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-5 ">SCARICA</DownloadReport>
                       </div>
                       </div>
                    </div>
                </>
            );
        }
    }
}