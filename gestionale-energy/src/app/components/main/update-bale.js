import React, { useEffect, useState, useMemo } from 'react'
import Cookies from 'js-cookie';
import Image from 'next/image';

import { updateStatusTotalbale, getServerRoute, refreshPage } from '@config';
import { fetchDataBale, handleStampa } from '@main/fetch';
import { useAlert } from '@main/alert/alertProvider';
import { useWebSocket } from '@main/ws/use-web-socket';
import SelectInput from '@main/search/select';

import PropTypes from 'prop-types'; // per ESLint

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
    handlerClose
}) {
    const { showAlert } = useAlert();
    const { ws, message } = useWebSocket();
    
    // Stati per i dati originali (per confronto)
    const [originalPresserData, setOriginalPresserData] = useState({
        plastic: null, 
        rei: null,
        cdbp: null,
        selected_b: null,
        notes: null
    });
    const [originalWheelmanData, setOriginalWheelmanData] = useState({
        cdbc: null, 
        reason: null,
        weight: null,
        dest_wh: null,
        notes: null
    });
    
    // Stati per i dati correnti
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
    const [isLoading, setIsLoading] = useState(false);

    // Verifica se ci sono state modifiche confrontando i dati originali con quelli correnti
    const hasChanges = useMemo(() => {
        if (type === 'presser') {
            return (
                presserData.plastic !== originalPresserData.plastic ||
                presserData.rei !== originalPresserData.rei ||
                presserData.cdbp !== originalPresserData.cdbp ||
                presserData.selected_b !== originalPresserData.selected_b ||
                presserData.notes !== originalPresserData.notes
            );
        } else {
            return (
                wheelmanData.cdbc !== originalWheelmanData.cdbc ||
                wheelmanData.reason !== originalWheelmanData.reason ||
                cacheWeight !== originalWheelmanData.weight ||
                wheelmanData.dest_wh !== originalWheelmanData.dest_wh ||
                wheelmanData.notes !== originalWheelmanData.notes
            );
        }
    }, [type, presserData, wheelmanData, cacheWeight, originalPresserData, originalWheelmanData]);

    // Verifica se i dati sono validi per procedere
    const canProceed = useMemo(() => {
        if (type === 'presser') {
            return presserData.plastic !== null && presserData.plastic !== undefined && presserData.plastic !== "";
        } else {
            return cacheWeight > 0 || hasChanges;
        }
    }, [type, presserData.plastic, cacheWeight]);

    // Verifica se può stampare (peso > 0 e non deve necessariamente aver confermato)
    const canPrint = useMemo(() => {
        return (type === 'wheelman' && cacheWeight > 0) || wheelmanData.cdbc == 2;
    }, [type, cacheWeight, hasChanges]);

    const handleData = (response) => {
        const data = response.data;
        // console.log("UpdateBale Dati dentro handleData: ", data);
        
        if (type === "presser") {
            const tmpData = { 
                plastic: data.plastic, 
                rei: data._idRei, 
                cdbp: data._idCpb, 
                selected_b: data._idSb, 
                notes: data.notes || "" 
            };
            setPresserData(tmpData);
            setOriginalPresserData({ ...tmpData }); // Salva i dati originali
        } else {
            const tmpData = { 
                cdbc: data._idCwb, 
                reason: data._idRnt, 
                weight: data.weight || 0, 
                dest_wh: data._idWd, 
                notes: data.notes || "" 
            };
            setWheelmanData(tmpData);
            setOriginalWheelmanData({ ...tmpData }); // Salva i dati originali
            setCacheWeight(data.weight || 0);
        }
    }

    useEffect(() => {
        fetchDataBale(type, objBale, handleData);
    }, [type, objBale, message]);

    /**
     * Funzione per salvare i dati della balla
     * @param {boolean} skipRefresh - Se true, non ricarica la pagina (utile per stampa)
     */
    const saveBaleData = async (skipRefresh = false) => {
        try {
            setIsLoading(true);
            const cookie = JSON.parse(Cookies.get('user-info'));
            let body = null;
            
            if (type === 'presser') {
                body = {
                    id_presser: parseInt(cookie.id_user),
                    id_plastic: presserData.plastic,
                    id_rei: presserData.rei ? parseInt(presserData.rei) : null,
                    id_cpb: presserData.cdbp ? parseInt(presserData.cdbp) : null,
                    id_sb: presserData.selected_b ? parseInt(presserData.selected_b) : null,
                    note: presserData.notes || null,
                    where: parseInt(objBale.idBale),
                };
            } else {
                body = {
                    id_wheelman: parseInt(cookie.id_user),
                    id_cwb: wheelmanData.cdbc ? parseInt(wheelmanData.cdbc) : null,
                    id_rnt: wheelmanData.reason ? parseInt(wheelmanData.reason) : null,
                    id_wd: wheelmanData.dest_wh ? parseInt(wheelmanData.dest_wh) : null,
                    note: wheelmanData.notes || null,
                    weight: parseFloat(cacheWeight),
                    where: parseInt(objBale.idBale),
                };
            }

            // Aggiorna i dati della balla
            await fetch(getServerRoute("update-bale"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body, type }),
            });

            // Aggiorna i dati originali per evitare false modifiche
            if (type === 'presser') {
                setOriginalPresserData({ ...presserData });
            } else {
                setOriginalWheelmanData({ ...wheelmanData, weight: cacheWeight });
            }

            if (!skipRefresh) {
                const body2 = { status: -1, where: objBale.idUnique };
                await updateStatusTotalbale(body2);
                refreshPage(ws);
            }

            return true;
        } catch (error) {
            console.error("Errore nel salvare i dati:", error);
            showAlert({
                title: "Errore",
                message: "Errore nel salvare i dati della balla",
                type: "error"
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Click function per conferma
     */
    const handleConfirm = async () => {
        const success = await saveBaleData(false);
        if (success) {
            handlerClose();
        }
    };

    /**
     * Handle Click function per stampa
     * Se ci sono modifiche non salvate, le salva prima di stampare
     */
    const handlePrint = async () => {
        try {
            if (hasChanges) {
                const success = await saveBaleData(true);
                if (!success) {
                    return;
                }
            }

            await handleStampa(objBale, showAlert, handlerClose, cacheWeight > 0);
        } catch (error) {
            console.error("Errore nella stampa:", error);
            showAlert({
                title: "Errore",
                message: "Errore durante la stampa dell'etichetta",
                type: "error"
            });
        }
    };

    return (
        <>
            <div className='grid grid-cols-5'>
                <div className='relative px-[5px]'>
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>
                        {(type === 'presser') ? "Codice Plastica" : "Cond. Balla Carrel."}
                    </label>
                    <SelectInput 
                        searchFor={(type === 'presser') ? "plastic" : "cdbc"}
                        value={(type === 'presser') ? presserData.plastic : wheelmanData.cdbc}
                        onChange={(e) => { 
                            if (type === 'presser') {
                                setPresserData(prev => ({ ...prev, plastic: e.target.value })); 
                            } else {
                                setWheelmanData(prev => ({ ...prev, cdbc: e.target.value }));
                            }
                        }} 
                        fixedW 
                    />
                </div>
                <div className='relative px-[5px]'>
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>
                        {(type === 'presser') ? "Utiliz. REI" : "Motivaz."}
                    </label>
                    <SelectInput 
                        disabled={type === 'wheelman' && wheelmanData.cdbc == 1}
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
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>
                        {(type === 'presser') ? "Cond. Balla Press." : "Magaz. Destinazione"}
                    </label>
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
                        id="note-input"
                        value={(type === 'presser') ? presserData.notes : wheelmanData.notes}
                        onChange={(e) => {
                            if (type === 'presser') {
                                setPresserData(prev => ({ ...prev, notes: e.target.value }));
                            } else {
                                setWheelmanData(prev => ({ ...prev, notes: e.target.value }));
                            }
                        }}
                        placeholder="Inserisci note"
                    />
                </div>
            </div>
            
            {/* Indicatore di modifiche */}
            {hasChanges && (
                <div className='text-orange-600 font-semibold text-center mt-2'>
                    ⚠️ Ci sono modifiche non salvate
                </div>
            )}
            
            <div className='flex flex-row-reverse m-[10px] mt-[20px]'>
                {type === 'wheelman' && (
                    <button 
                        className={`border px-[10px] py-[5px] rounded-xl mr-4 text-white font-semibold
                            ${canPrint ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-no-drop'}`}
                        onClick={handlePrint}
                        disabled={!canPrint || isLoading}
                        title={!canPrint ? "Inserisci un peso valido per stampare" : "Stampa etichetta"}
                    >
                        <div className="flex items-center p-1">
                            <Image 
                                src={"/filled/stampa-bianco-filled.png"}
                                width={25}
                                height={25}
                                alt="Stampa icona"
                                className="mr-2"
                            />
                            {isLoading ? 'Stampando...' : 'Stampa etich.'}
                        </div>
                    </button>
                )}
                <button 
                    className={`border px-[10px] py-[5px] rounded-xl mx-4 bg-blue-500 text-white font-semibold
                        ${(!canProceed || !hasChanges) ? 'disabled:opacity-45 cursor-no-drop' : 'hover:bg-blue-600'}`}
                    onClick={handleConfirm}
                    disabled={!canProceed || !hasChanges || isLoading}
                >
                    {isLoading ? 'Salvando...' : 'Conferma'}
                </button>
                <button 
                    className='border px-[10px] py-[5px] rounded-xl bg-gray-500 text-white font-semibold mx-4 hover:bg-gray-600'
                    onClick={handlerClose}
                    disabled={isLoading}
                >
                    Annulla
                </button>
            </div>
        </>
    )
}

UpdateValuesBale.propTypes = {
    type: PropTypes.string.isRequired,
    objBale: PropTypes.object.isRequired,
    handlerClose: PropTypes.func.isRequired
};