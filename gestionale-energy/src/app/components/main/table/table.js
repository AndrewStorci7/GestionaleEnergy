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

    // WebSocket instance
    const { ws, message } = useWebSocket();
    /// Common style
    const _CMNSTYLE_DIV_EMPTY = "fixed top-0 left-0 h-screen w-screen";
    const _CMNSTYLE_EMPTY = "text-2xl w-screen h-screen flex justify-center items-center";
    const _CMNSTYLE_TITLE = "text-3xl font-bold";
    const _CMNSTYLE_DIV = "grid grid-cols-2 gap-2 pt-[30px] relative mt-[20px] h-[60vh] overflow-y-scroll"; // inset-0 shadow-inner 
    const _CMNSTYLE_TABLE = "table-auto border-collapse border border-slate-400 w-full rounded-tl-[10px] text-left mt-[10px] h-fit"; 
    const _CMNSTYLE_LABEL = "absolute top-[-10px] font-bold text-2xl px-[15px] rounded-[5px] mt-[10px]";
    const _CMNSTYLE_SECONDARY = "bg-thirdary left-[50%] ml-[4px] opacity-50";
    const _CMN_ONLY_VIEW = <span className="text-extrabold"> <u>solo visualizzazione</u></span>;

    const [selectedType, setSelectedType] = useState("general");
    const [addWasClicked, setAddClick] = useState(false); // gestisce il click del bottone "aggiungi"
    const [confirmedAdd, setConfirmedAdd] = useState(true); // gestisce il click della conferma dell'inserimento

    const [msgEmpty, setMsg] = useState("");
    const [isEmpty, setEmpty] = useState(false);
    const [isSelected, setSelected] = useState(null);
    const [idUnique, setIdUnique] = useState(null);
    // const [btnPressed, setBtnPressed] = useState(null); // Track which button was pressed
    
    // const handleUpdateClickConfirmed = () => {
    //     setConfirmedAdd(true);
    //     setAddClick(false);
    // }
    const handleAddPressed = () => {
        setConfirmedAdd(prev => !prev);
        setAddClick(prev => !prev);
        console.log(confirmedAdd);
    }
    
    // Oggetto per gestire l'id della balla selezionata
    const objIdBale = {
        idUnique: idUnique,
        idBale: isSelected,
        setIdBale: setSelected
    }
    // Oggetto per gestire l'aggiunta di una nuova balla
    const objAdd = { 
        state: addWasClicked, 
        setAdd: setAddClick,
        changeAddBtn: handleAddPressed,
    }
    

    const noData = (msg) =>  {
        setEmpty(false);
        setMsg(msg);
    }

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const handleSelect = (select, idUnique) => {
        setSelected(select);
        setIdUnique(idUnique);
    }

    // const handleDownloadClick = (reportType) => {
    //     setBtnPressed(reportType); // Set the type of the report to trigger download in ExportReport
    // }

    switch (type) {
        case "admin": {
            return (
                <>
                    <h1 className={_CMNSTYLE_TITLE}>Pagina Amminstratore Sviluppatore</h1>
                    <p>In fase di sviluppo</p>
                </>
            );
        }
        case "presser": {
            return (
                <>
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-primary `}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            
                            {/* BALLE IN LAVORAZIONE */}
                            <TableContent 
                                type={"presser"} 
                                handleSelect={(sel, idU) => handleSelect(sel, idU)}
                                selectedBaleId={isSelected}
                                add={objAdd}  
                                noData={(e) => noData(e)} 
                                primary 
                            />

                            {/* BALLE COMPLETATE */}
                            <TableContent 
                                type={"presser"} 
                                handleSelect={(sel, idU) => handleSelect(sel, idU)}
                                selectedBaleId={isSelected} 
                                useFor={"specific"}
                                noData={(e) => noData(e)} 
                                primary 
                            />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>

                            {/* BALLE IN LAVORAZIONE */}
                            <TableContent type={"wheelman"} add={objAdd} />
                            
                            {/* BALLE COMPLETATE */}
                            <TableContent type={"wheelman"} useFor={"specific"} />
                        </table>
                    </div>

                    <BtnPresser 
                        implant={implant}
                        idUser={idUser}
                        clickAddHandle={handleAddPressed}
                        handleConfirmAdd={confirmedAdd}
                        baleObj={objIdBale}
                    />

                    {(!addWasClicked) ? (
                        <div className={`${(isEmpty || addWasClicked) ? "visible" : "invisible"} ${_CMNSTYLE_DIV_EMPTY}`}>
                            <h1 className={`${_CMNSTYLE_EMPTY}`}>
                                {msgEmpty}
                            </h1>
                        </div>
                    ) : null }
                </>
            );
        }
        case "wheelman": {
            return (
                <>
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table"  className={`${_CMNSTYLE_LABEL} text-white bg-secondary`} >Carrellista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"} primary />
                            
                            {/* BALLE IN LAVORAZIONE */}
                            <TableContent 
                                type={"wheelman"} 
                                handleSelect={(sel, idU) => handleSelect(sel, idU)}
                                selectedBaleId={isSelected}
                                add={objAdd}
                                noData={(e) => noData(e)} 
                                useFor={"reverse"}
                                primary 
                            />

                            {/* BALLE COMPLETATE */}
                            <TableContent 
                                type={"wheelman"} 
                                handleSelect={(sel, idU) => handleSelect(sel, idU)}
                                selectedBaleId={isSelected}
                                useFor={"specific"}
                                noData={(e) => noData(e)} 
                                primary 
                            />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>
                            Pressista
                            {_CMN_ONLY_VIEW} 
                        </label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} />

                            {/* BALLE IN LAVORAZIONE */}
                            <TableContent type={"presser"} useFor={"reverse"} add={objAdd}  />

                            {/* BALLE COMPLETATE */}
                            <TableContent type={"presser"} useFor={"specific"} />
                        </table>
                    </div>

                    <BtnWheelman 
                        implant={implant}
                        idUser={idUser}
                        baleObj={objIdBale}
                    />

                    {(!addWasClicked) ? (
                        <div className={`${(isEmpty || addWasClicked) ? "visible" : "invisible"} ${_CMNSTYLE_DIV_EMPTY}`}>
                            <h1 className={`${_CMNSTYLE_EMPTY}`}>
                                {msgEmpty}
                            </h1>
                        </div>
                    ) : null }
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
                                <TableContent type={"presser"} />
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
                                </div>

                            </div>
                            <div className="grid-cols-1 bg-blue-100	 border-2 border-slate-400 mt-[10px]">
                                <h1 className="text-center font-bold bg-blue-500 text-xl">REPORT DA FILTRI</h1>
                                <div className="grid grid-cols-3 gap-1 mt-20">
                                    <p className="ml-3 mb-1.5">PERIODO</p>
                                    <input className=" mb-1.5" type="date"></input>
                                    <input className=" mb-1.5" type="date"></input>
                                    <p className="ml-3 mb-1.5">IMPIANTO</p>
                                    <SelectInput id="search-input-implants" searchFor={"implants"} isForSearch />
                                    <p></p>
                                    <p className="ml-3 mb-1.5">TIPO PLASTICA</p>
                                    <SelectInput id="search-input-plastic" searchFor={"plastic"} isForSearch />
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
                                </div>
                            </div>
                        </div>
                    )}
                </>
            );
        }
    }
}