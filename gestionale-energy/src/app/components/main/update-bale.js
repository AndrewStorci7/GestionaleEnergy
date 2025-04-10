import React, { useEffect, useState } from 'react'
import SelectInput from './search/select';
import { updateStatusTotalbale, getServerRoute } from '@@/config';
import Cookies from 'js-cookie';

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

    const [canProceed, setCanProceed] = useState(false);

    // Dati Pressista
    const [plastic, setPlastic] = useState(""); // Id plastica
    // const [plastic2, setPlastic2] = useState(""); // Codice plastica   
    const [rei, setRei] = useState(""); // Stato se balla reimballata
    const [cdbp, setCdbp] = useState(""); // Condizione balla pressista
    const [selected_b, setSelectedBale] = useState(""); // Balla selezionata

    // Dati carrellista
    const [cdbc, setCdbc] = useState(""); // Condizione balla carrellista
    const [reason, setReason] = useState(""); // Motivazione
    const [weight, setWeight] = useState(0); // Peso
    const [dest_wh, setDestWh] = useState(""); // magazzino destinazione

    const [note, setNote] = useState(""); // Note (sia carrellista che pressista)

    const fetchData = async () => {
        try {
            
            const url = getServerRoute(type === 'presser' ? 'presser' : 'wheelman');
            const resp = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: objBale.idBale })
            });

            const data = await resp.json();

            if (type === 'presser') {
                setPlastic(data.plastic);
                setRei(data._idRei);
                setCdbp(data._idCpb);
                setSelectedBale(data._idSb);
                setNote(data.notes);
                setCanProceed(data.plastic !== null || data.plastic !== undefined);
            } else {
                setCdbc(data._idCwb);
                setReason(data._idRnt);
                setWeight(data.weight);
                setDestWh(data._idWd);
                setNote(data.notes);
                setCanProceed(data.weight > 0);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [objBale]);

    /**
     * Handle Click function
     * 
     * @param {boolean} f 
     */
    const handleClick = async () => {
        try {
            const cookie = JSON.parse(Cookies.get('user-info'));
            var body = null, url = "";
            if (type === 'presser') {
                body = {
                    id_presser: cookie.id_user,
                    id_plastic: plastic,
                    id_rei: rei,
                    id_cpb: cdbp,
                    id_sb: selected_b,
                    note: note,
                    where: objBale.idBale,
                };
                url = getServerRoute("update-presser-bale");
            } else {
                body = {
                    id_wheelman: cookie.id_user,
                    id_cwb: cdbc,
                    id_rnt: reason,
                    id_wd: dest_wh,
                    note: note,
                    weight: weight,
                    where: objBale.idBale,
                };
                url = getServerRoute("update-wheelman-bale");
            }

            const status = (cdbc === 2) ? 1 : -1;

            const body2 = { status: status, where: objBale.idUnique };
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body })
            });
    
            // Aggiorna lo stato della balla totale
            await updateStatusTotalbale(body2);
            // Gestisco la conferma e ri-renderizzo la componente padre
            handlerClose();
    
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
                        value={(type === 'presser') ? plastic : cdbc}
                        onChange={(e) => { 
                            if (type === 'presser') {
                                setPlastic(e.target.value); 
                                setCanProceed(e.target.value !== "");
                            } else {
                                setCdbc(e.target.value);
                                setCanProceed(e.target.value == 2);
                            }
                        }} 
                        fixedW 
                    />
                </div>
                <div className='relative px-[5px]'>
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>{(type === 'presser') ? "Utiliz. REI" : "Motivaz."}</label>
                    <SelectInput 
                        disabled={cdbc == 1}
                        searchFor={(type === 'presser') ? "rei" : "reason"} 
                        value={(type === 'presser') ? rei : reason}
                        onChange={(e) => {
                            if (type === 'presser') setRei(e.target.value);
                            else setReason(e.target.value);
                        }} 
                        fixedW 
                    />
                </div>
                <div className='relative px-[5px]'>
                    <label className='text-black absolute top-[-30px] left-[5px] font-bold'>{(type === 'presser') ? "Cond. Balla Press." : "Magaz. Destinazione"}</label>
                    <SelectInput 
                        searchFor={(type === 'presser') ? "cdbp" : "dest-wh"} 
                        value={(type === 'presser') ? cdbp : dest_wh}
                        onChange={(e) => {
                            if (type === 'presser') setCdbp(e.target.value)
                            else setDestWh(e.target.value)
                        }}  
                        fixedW 
                    />
                </div>
                {(type === 'presser') ? (
                    <div className='relative px-[5px]'>
                        <label className='text-black absolute top-[-30px] left-[5px] font-bold'>Balla Selez.</label>
                        <SelectInput 
                            searchFor={"selected-b"} 
                            value={selected_b}
                            onChange={(e) => setSelectedBale(e.target.value)} 
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
                            value={weight}
                            onChange={(e) => { 
                                setWeight(e.target.value);
                                setCanProceed(e.target.value > 0 && e.target.value);
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
                        value={note || ""}
                        onChange={(e) => setNote(e.target.value)}
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
                    OK
                </button>
                <button 
                    className={'border px-[10px] py-[5px] rounded-xl bg-primary mr-4'}
                    onClick={() => handlerClose()}
                >
                    Annulla
                </button>
            </div>
        </>
    )
}
