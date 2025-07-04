import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import Image from 'next/image';

import { updateStatusTotalbale, getServerRoute, refreshPage } from '@@/config';
import { fetchDataBale, handleStampa } from '@main/fetch';
import { useAlert } from '@main/alert/alertProvider';
import { useWebSocket } from '@main/ws/use-web-socket';
import SelectInput from './search/select';

/**
 * @author Andrea Storci from Oppimittinetworking.com
 * 
 * @param {string}   type           Tipo della balla da modificare: [ 'presser' | 'wheelman' ]
 * @param {int}      objBale        Id numerico della balla da modificare 
 * @param {Function} handlerClose   Funzione che gestisce il flusso dopo aver cliccato il bottone di Annulla o Conferma 
 */
export default function UpdateValuesBale({ 
    type, 
    objBale, 
    handlerClose,
    ...props
}) {
    const { showAlert, hideAlert } = useAlert();
    const { ws, message } = useWebSocket();
    const [canProceed, setCanProceed] = useState(false);
    const [presserData, setPresserData] = useState({
        plastic: null, 
        rei: null,
        cdbp: null,
        selected_b: null,
        notes: null
    });
    const [wheelmanData, setWheelmanData] = useState({
        cdbc: null, 
        reason: null,
        weight: null,
        dest_wh: null,
        notes: null
    });
    const [cacheWeight, setCacheWeight] = useState(0);

    const handleData = (response) => {
        const data = response.data;
        console.log("UpdateBale Dati dentro handleData: ", data);
        if (type === "presser") {
            const tmpData = { plastic: data.plastic, rei: data._idRei, cdbp: data._idCpb, selected_b: data._idSb, notes: data.notes };
            setPresserData(tmpData);
            setCanProceed(data.plastic !== null || data.plastic !== undefined);
        } else {
            setWheelmanData({ cdbc: data._idCwb, reason: data._idRnt, weight: data.weight, dest_wh: data._idWd, notes: data.notes });
            setCanProceed(data.weight > 0);
        }
    }

    useEffect(() => {
        fetchDataBale(type, objBale, handleData);
    }, [message]);

    /**
     * Handle Click function
     * 
     * @param {boolean} f 
     */
    const handleClick = async () => {
        try {
            const cookie = JSON.parse(Cookies.get('user-info'));
            var body = null, typeFixed;
            setWheelmanData(prev => ({ ...prev, weight: cacheWeight })); // Assicuro che il peso sia un numero
            if (type === 'presser') {
                typeFixed = 'presser';
                body = {
                    id_presser: cookie.id_user,
                    id_plastic: presserData.plastic,
                    id_rei: presserData.rei,
                    id_cpb: presserData.cdbp,
                    id_sb: presserData.selected_b,
                    note: presserData.notes,
                    where: objBale.idUnique,
                };
            } else {
                typeFixed = 'wheelman';
                body = {
                    id_wheelman: cookie.id_user,
                    id_cwb: wheelmanData.cdbc,
                    id_rnt: wheelmanData.reason,
                    id_wd: wheelmanData.dest_wh,
                    note: wheelmanData.notes,
                    weight: cacheWeight,
                    where: objBale.idUnique,
                };
            }

            const status = (wheelmanData.cdbc === 2) ? 1 : -1;
            const body2 = { status: status, where: objBale.idUnique };

            await fetch(getServerRoute("update-bale"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body, type }),
            });
    
            // Aggiorna lo stato della balla totale
            await updateStatusTotalbale(body2);
            if (status === 1) {
                hideAlert();
            }
            setCanProceed(false);
            refreshPage(ws);
    
        } catch (error) {
            console.error("Errore", error);
        }
    }

    return (
        <>
            <div className='grid grid-cols-5'>
                <div className='relative px-[5px]'>
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>{(type === 'presser') ? "Codice Plastica" : "Cond. Balla Carrel."}</label>
                    <SelectInput 
                        searchFor={(type === 'presser') ? "plastic" : "cdbc"}
                        value={(type === 'presser') ? presserData.plastic : wheelmanData.cdbc}
                        onChange={(e) => { 
                            if (type === 'presser') {
                                setPresserData(prev => ({ ...prev, plastic: e.target.value })); 
                                setCanProceed(e.target.value !== "");
                            } else {
                                setWheelmanData(prev => ({ ...prev, cdbc: e.target.value }));
                                setCanProceed(e.target.value == 2);
                            }
                        }} 
                        fixedW 
                    />
                </div>
                <div className='relative px-[5px]'>
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>{(type === 'presser') ? "Utiliz. REI" : "Motivaz."}</label>
                    <SelectInput 
                        disabled={wheelmanData.cdbc == 1}
                        searchFor={(type === 'presser') ? "rei" : "reason"} 
                        value={(type === 'presser') ? presserData.rei : wheelmanData.reason}
                        onChange={(e) => {
                            if (type === 'presser') {
                                setPresserData(prev => ({ ...prev, rei: e.target.value }));
                            } else {
                                setWheelmanData(prev => ({ ...prev, reason: e.target.value }));
                            }
                        }} 
                        fixedW 
                    />
                </div>
                <div className='relative px-[5px]'>
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>{(type === 'presser') ? "Cond. Balla Press." : "Magaz. Destinazione"}</label>
                    <SelectInput 
                        searchFor={(type === 'presser') ? "cdbp" : "dest-wh"} 
                        value={(type === 'presser') ? presserData.cdbp : wheelmanData.dest_wh}
                        onChange={(e) => {
                            if (type === 'presser') {
                                setPresserData(prev => ({ ...prev, cdbp: e.target.value }));
                            } else {
                                setWheelmanData(prev => ({ ...prev, dest_wh: e.target.value }));
                            }
                        }}  
                        fixedW 
                    />
                </div>
                {(type === 'presser') ? (
                    <div className='relative px-[5px]'>
                        <label className='text-black absolute top-[-30px] left-[5px] font-bold'>Balla Selez.</label>
                        <SelectInput 
                            searchFor={"selected-b"} 
                            value={presserData.selected_b}
                            onChange={(e) => setPresserData(prev => ({ ...prev, selected_b: e.target.value }))} 
                            fixedW 
                        />
                    </div>
                ) : (
                    <div className='relative px-[5px]'>
                        <label className='text-black absolute top-[-30px] left-[5px] font-bold'>Peso (kg)</label>
                        <input 
                            className='text-black w-full on-input'
                            type="number"
                            id="peso-carrellista"
                            value={cacheWeight || 0}
                            onChange={(e) => { 
                                const newWeight = parseFloat(e.target.value) || 0;
                                setCacheWeight(newWeight);
                                // setWheelmanData(prev => ({ ...prev, weight: newWeight }));
                                setCanProceed(newWeight > 0 && newWeight);
                            }}
                            placeholder="Inserisci peso"
                        />
                    </div>
                )}
                <div>{/* spazziatore */}</div>
                <div className='relative px-[5px] col-span-2 mt-9'>
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>Note</label>
                    <input 
                        className='text-black w-full on-input'
                        type="text"
                        id="note-carrellista"
                        value={(type === 'presser' && presserData.notes) ? presserData.notes : wheelmanData.notes ? wheelmanData.notes : ""}
                        onChange={(e) => {
                            if (type === 'presser') {
                                setPresserData(prev => ({ ...prev, notes: e.target.value }));
                            } else {
                                setWheelmanData(prev => ({ ...prev, notes: e.target.value }));
                            }
                        }}
                        placeholder="Inserisci note"
                        // defaultValue={note}
                    />
                </div>
            </div>
            <div className='flex flex-row-reverse m-[10px] mt-[20px]'>
                <button 
                    className={`border px-[10px] py-[5px] rounded-xl ml-4 bg-blue-500 ${!canProceed && 'disabled:opacity-45 cursor-no-drop'}`}
                    onClick={() => handleClick()}
                    disabled={!canProceed}
                >
                    Conferma
                </button>
                <button 
                    className={'border px-[10px] py-[5px] rounded-xl bg-primary mx-4'}
                    onClick={() => handlerClose()}
                >
                    Annulla
                </button>
                {type === 'wheelman' && (
                    <button className={'border px-[10px] py-[5px] rounded-xl bg-green-500 mr-4'}
                    onClick={() => handleStampa(objBale, showAlert, handlerClose, wheelmanData.weight > 0)}
                    // onClick={() => {}}
                    >
                        <div className="flex items-center p-1">
                            <Image 
                                src={"/filled/stampa-bianco-filled.png"}
                                width={25}
                                height={25}
                                alt="Aggiungi icona"
                                className="mr-2"
                            />
                            Stampa etich.
                        </div>
                    </button>
                )}
            </div>
        </>
    )
}
