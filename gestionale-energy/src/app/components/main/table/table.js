'use client'

import TableWrapper from "./tableWrapper";
import DownloadReport from "../admin/btn-report"
import SelectInput from "../search/select";
import BtnWheelman from "../btn-wheelman";
import BtnPresser from "../btn-presser";
import Switch from "../admin/switch";

import { useWebSocket } from "../ws/use-web-socket";

import Image from "next/image";

import { useState } from "react";
import { refreshPage } from "@/app/config";

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
    const _CMNSTYLE_TABLE = "border-collapse table-auto w-full text-sm";

    const [selectedType, setSelectedType] = useState("general");
    const [addWasClicked, setAddClick] = useState(false); // gestisce il click del bottone "aggiungi"
    const [confirmedAdd, setConfirmedAdd] = useState(true); // gestisce il click della conferma dell'inserimento

    const [msgEmpty, setMsg] = useState("");
    const [isEmpty, setEmpty] = useState(false);
    const [isSelected, setSelected] = useState(null);
    const [idUnique, setIdUnique] = useState(null);

    const [handleToggleSwitch, setHandleToggleSwitch] = useState(false);

    const handleAddPressed = () => {
        setConfirmedAdd(prev => !prev);
        setAddClick(prev => !prev);
        console.log("STATO BOTTONE OK AGGIUNTA: " + confirmedAdd);
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
                    <div className="grid grid-cols-9 gap-2 mt-[10px] relative h-[60vh] overflow-y-scroll shadow-inner">
                        <TableWrapper 
                            className="col-span-5"
                            type={"presser"}
                            tableContent={{
                                handleSelect: (i, y) => handleSelect(i, y),
                                selectedBaleId: isSelected,
                                objAdd: objAdd,
                                noData: (e) => noData(e)
                            }}
                            primary />

                        <TableWrapper 
                            className="col-span-4" 
                            type={"wheelman"} 
                            tableContent={{ objAdd: objAdd }} />
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
                    <div className="grid grid-cols-9 gap-2 mt-[10px] relative h-[60vh] overflow-y-scroll shadow-inner">
                        <TableWrapper 
                            className="col-span-5"
                            type={"wheelman"}
                            tableContent={{
                                handleSelect: (i, y) => handleSelect(i, y),
                                selectedBaleId: isSelected,
                                objAdd: objAdd,
                                noData: (e) => noData(e)
                            }}
                            primary />

                        <TableWrapper 
                            className="col-span-4" 
                            type={"presser"} 
                            tableContent={{ objAdd: objAdd }} />
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
                    <div className="text-slate-600 bg-white shadow-sm w-fit p-2 pl-4 rounded-lg border border-zinc-100 relative mt-[10px]">
                        <h2 className="font-bold text-lg">Cambia interfaccia</h2>
                        <div className="flex gap-4">
                            <div className="w-fit flex justify-between items-center space-x-4">
                                <div className="flex items-center">
                                    <p className={!handleToggleSwitch ? "font-semibold" : ""}>Amministratore</p>
                                </div>
                                <div className="flex items-center">
                                    <Switch onToggle={setHandleToggleSwitch} />
                                </div>
                                <div className="flex items-center">
                                    <p className={handleToggleSwitch ? "font-semibold" : ""}>Produzione</p>
                                </div>
                            </div>
                            <div className="relative w-fit ml-5">
                                <button 
                                    className={`inline rounded-full bg-blue-500 px-1 py-1 ${!handleToggleSwitch && "disabled:bg-blue-200 cursor-no-drop"}`} 
                                    onClick={() => {
                                        if (handleToggleSwitch) refreshPage(ws);
                                    }}
                                >
                                    <div className={`flex items-center p-1 text-white ${!handleToggleSwitch && "disabled:bg-blue-200"}`}>
                                        <Image 
                                            src={"/outlined/sinc.png"}
                                            width={25}
                                            height={25}
                                            alt="Aggiungi icona"
                                            className={"mr-2"}
                                        />
                                        Ricarica manualmente
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {!handleToggleSwitch ? (
                        <div className="grid grid-cols-2 gap-2 relative h-[60vh] rounded-lg">
                            <div className="bg-blue-100 mt-[10px] border-[0.1px] border-slate-200 shadow-lg rounded-lg">
                                <h1 className="text-center bg-blue-300 font-bold text-xl py-[15px] rounded-t-lg">
                                    REPORT PREDEFINITI
                                </h1>
                                <div className="grid grid-cols-2 gap-1 mt-20 p-20">
                                    <DownloadReport />
                                </div>
                            </div>
                            <div className="bg-blue-100 mt-[10px] border-[0.1px] border-slate-200 shadow-lg rounded-lg">
                                <h1 className="text-center bg-blue-300 font-bold text-xl py-[15px] rounded-t-lg">
                                    REPORT DA FILTRI
                                </h1>
                                <div className="grid grid-cols-3 gap-1 mt-20 p-20">
                                    <p className="ml-3 mb-1.5 font-bold">
                                        PERIODO
                                    </p>
                                    <input className="border-2 border-gray-300 p-1 mb-1.5 rounded-md" type="date"></input>
                                    <input className="border-2 border-gray-300 p-1 mb-1.5 rounded-md" type="date"></input>
                                    <p className="ml-3 mb-1.5 font-bold">IMPIANTO</p>
                                    <SelectInput id="search-input-implants" searchFor={"implants"} isForSearch />
                                    <p></p>
                                    <p className="ml-3 mb-1.5 font-bold">TIPO PLASTICA</p>
                                    <SelectInput id="search-input-plastic" searchFor={"plastic"} isForSearch />
                                    {/*
                                    <p></p>
                                    <p className="ml-3 mb-1.5">PESO</p>
                                    <select name="peso" id="pesoid"> 
                                        <option value="esempio_a">-</option>
                                    </select>
                                    <p></p>
                                    <p className="ml-3 mb-1.5">TURNO</p>
                                    <select name="turno" id="turnoid">
                                        <option value="esempio_a">-</option>
                                    </select> */}
                                    <p></p>
                                    <p></p>
                                    <button className="text-black font-semibold bg-sky-50 rounded-full text-sm px-2 py-2 text-center me-2 mt-3 mb-3.5 transition-all hover:bg-sky-700 hover:text-white">
                                        VISUALIZZA
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-9 gap-2 mt-[10px] relative h-[58vh] overflow-y-scroll shadow-inner mb-[40px]">
                            <TableWrapper 
                                className="col-span-5"
                                type={"presser"}
                                tableContent={{
                                    handleSelect: (i, y) => handleSelect(i, y),
                                    selectedBaleId: isSelected,
                                    objAdd: objAdd,
                                    noData: (e) => noData(e)
                                }}
                                primary
                                admin
                            />
                            <TableWrapper className="col-span-4" type={"wheelman"} tableContent={{ objAdd: objAdd }} />
                        </div>
                    )}
                </>
            );
        }
    }
}