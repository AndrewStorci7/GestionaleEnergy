'use client'

import TableHeader from "./table-header";
import TableContent from "./table-content";
import DownloadReport from "../admin/btn-report"
import SelectInput from "../search/select";
import BtnWheelman from "../btn-wheelman";
import ExportReport from "../admin/export-report";
import BtnPresser from "../btn-presser";

import { useWebSocket } from "../ws/use-web-socket";

import { useEffect, useState } from "react";

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
export default function Table({ type, implant, idUser }) {

    // const { ws, message } = useWebSocket();

    // global message from the socket
    const [_message, setMessage] = useState("");

    const [selectedType, setSelectedType] = useState("general");
    const [addWasClicked, setState] = useState(false)
    const [ids, setResp] = useState([])
    const [msgEmpty, setMsg] = useState("")
    const [isEmpty, setEmpty] = useState(false)
    const [isSelected, setSelected] = useState(null)
    const [btnPressed, setBtnPressed] = useState(null); // Track which button was pressed

    const closeInsertNewBaleComponent = () => {
        setState(prev => !prev);
    }

    const addHandle = (resp) => {
        closeInsertNewBaleComponent();
        setResp(resp);
    }

    const noData = (msg) =>  {
        setEmpty(prev => !prev);
        setMsg(msg);
    }

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const handleSelect = (select) => {
        setSelected(select);
        // console.log("IS SELECTED: " + isSelected)
    }

    const handleDownloadClick = (reportType) => {
        setBtnPressed(reportType); // Set the type of the report to trigger download in ExportReport
    }

    /// Common style
    const _CMNSTYLE_DIV_EMPTY = "fixed top-0 left-0 h-screen w-screen"
    const _CMNSTYLE_EMPTY = "text-2xl w-screen h-screen flex justify-center items-center"
    const _CMNSTYLE_TITLE = "text-3xl font-bold";
    const _CMNSTYLE_DIV = "grid grid-cols-2 gap-2 pt-[30px] relative mt-[20px] h-[60vh] overflow-y-scroll"; // inset-0 shadow-inner 
    const _CMNSTYLE_TABLE = "table-auto border-collapse border border-slate-400 w-full rounded-tl-[10px] text-left mt-[10px] h-fit"; 
    const _CMNSTYLE_LABEL = "absolute top-[-10px] font-bold text-2xl px-[15px] rounded-[5px] mt-[10px]";
    const _CMNSTYLE_SECONDARY = "bg-thirdary left-[50%] ml-[4px] opacity-50";
    const _CMN_ONLY_VIEW = <span className="text-extrabold"><u>solo visualizzazione</u></span>

    // useEffect(() => {
    //     setMessage(message)
    // }, [ws, message])

    switch (type) {
        case "admin": {
            return(
                <>
                    <h1 className={_CMNSTYLE_TITLE}>Pagina Amministratore Sviluppatore</h1>
                    <p>In fase di sviluppo</p>
                </>
            );
        }
        case "presser": {
            return(
                <>
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-primary `}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            <TableContent 
                                type={"presser"} 
                                handleSelect={(e) => handleSelect(e)}
                                selectedBaleId={isSelected}
                                add={{ state: addWasClicked, setAdd: closeInsertNewBaleComponent }} 
                                ids={ids} 
                                noData={noData} 
                                primary 
                            />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"} add={{ state: addWasClicked, setAdd: closeInsertNewBaleComponent}}  />
                        </table>
                    </div>

                    <BtnPresser 
                        implant={implant}
                        idUser={idUser}
                        clickAddHandle={addHandle}
                        idSelect={isSelected}
                    />

                    {/* {(!addWasClicked) ? (
                        <div className={`${(isEmpty || addWasClicked) ? "visible" : "invisible"} ${_CMNSTYLE_DIV_EMPTY}`}>
                            <h1 className={`${_CMNSTYLE_EMPTY}`}>
                                {msgEmpty}
                            </h1>
                        </div>
                    ) : null } */}
                </>
            );
        }
        case "wheelman": {
            return(
                <>
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table"  className={`${_CMNSTYLE_LABEL} text-white bg-secondary`} >Carrellista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"} primary />
                            <TableContent 
                                type={"wheelman"} 
                                add={{ state: addWasClicked, setAdd: closeInsertNewBaleComponent}} 
                                ids={ids} 
                                noData={noData} 
                                handleSelect={(e) => handleSelect(e)}
                                selectedBaleId={isSelected}
                                primary 
                            />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>
                            Pressista
                            {_CMN_ONLY_VIEW} 
                        </label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} />
                            <TableContent type={"presser"} add={{ state: addWasClicked, setAdd: closeInsertNewBaleComponent}}  />
                        </table>
                    </div>

                    <BtnWheelman 
                        implant={implant}
                        idUser={idUser}
                        // clickAddHandle={addHandle}
                        idSelect={isSelected}
                    />

                    {/* {(!addWasClicked) ? (
                        <div className={`${(isEmpty || addWasClicked) ? "visible" : "invisible"} ${_CMNSTYLE_DIV_EMPTY}`}>
                            <h1 className={`${_CMNSTYLE_EMPTY}`}>
                                {msgEmpty}
                            </h1>
                        </div>
                    ) : null } */}
                </>
            );
        }
        case 'both': {
            return (
                <>
                    <div className="grid grid-cols-3 gap-2 pt-[30px] relative mt-[20px]">
                        <button
                            onClick={() => handleTypeChange("presser")}
                            className={`bg-primary rounded-md text-2xl font-semibold text-white ${selectedType === "presser" ? "opacity-100" : "opacity-50"}`}
                        >
                            Pressista
                        </button>
                        <button
                            onClick={() => handleTypeChange("wheelman")}
                            className={`bg-secondary rounded-md text-2xl font-semibold text-white ${selectedType === "wheelman" ? "opacity-100" : "opacity-50"}`}
                        >
                            Carrellista
                        </button>
                        <button
                            onClick={() => handleTypeChange("general")}
                            className={`bg-thirdary_1 rounded-md text-2xl font-semibold text-white ${selectedType === "general" ? "opacity-100" : "opacity-50"}`}
                        >
                            Amministrazione
                        </button>
                    </div>

                    {/* Table Content */}
                    {selectedType === "presser" && (
                        <div className={`shadow-lg  h-[60vh] overflow-y-scroll`}>
                            <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                                <TableHeader type={"presser"} />
                                <TableContent type={"presser"}/>
                            </table>
                        </div>
                    )}

                    {selectedType === "wheelman" && (
                        <div className={`shadow-lg  h-[60vh] overflow-y-scroll`}>
                            <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                                <TableHeader type={"wheelman"}/>
                                <TableContent type={"wheelman"}/>
                            </table>
                        </div>
                    )}
                    
                    {selectedType === "general" && (
                        <div className={`grid grid-cols-2 gap-2 relative  h-[60vh]`}>
                        <div className="grid-cols-1 bg-blue-100 mt-[10px] border-2 border-slate-400 ">
                        <h1 className="text-center font-bold bg-blue-500 text-xl">REPORT PREDEFINITI</h1>
                        <div className="grid grid-cols-2 gap-1 mt-20">
                            <DownloadReport />
                            {/* <button onClick={() => handleDownloadClick('file1')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. IMPIANTO A</button>
                            <button onClick={() => handleDownloadClick('file2')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. TEMPI IMP A</button>
                            <button onClick={() => handleDownloadClick('file3')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. IMPIANTO B</button>
                            <button onClick={() => handleDownloadClick('file4')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. TEMPI IMP B</button>
                            <button onClick={() => handleDownloadClick('file5')}className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. IMPIANTO A e B</button>
                            <button onClick={() => handleDownloadClick('file6')} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-3 mb-3.5">GIOR. TEMPI IMP A e B</button> */}
                        </div>
                        {/* <ExportReport btnPressed={btnPressed} /> */}
                        </div>
                        <div className="grid-cols-1 bg-blue-100	 border-2 border-slate-400 mt-[10px]">
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
                        {/* <DownloadReport  downloadFor={"File_Scaricato"} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-5 ">SCARICA</DownloadReport> */}
                        </div>
                        </div>
                        
                    </div>
                    )}
                </>
            );
        }
    }
}