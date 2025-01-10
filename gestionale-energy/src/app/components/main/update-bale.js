import React, { useEffect, useState } from 'react'
import SelectInput from './search/select';
import { getSrvUrl } from '@@/config';

const srvurl = getSrvUrl()

/**
 * @author Andrea Storci from Oppimittinetworking.com
 * 
 * @param {string}  type    Tipo della balla da modificare: [ 'presser' | 'wheelman' ]
 * @param {int}     idBale  Id numerico della balla da modificare 
 */
export default function UpdateValuesBale({ type, idBale, handlerConfirm }) {

    // Dati Pressista
    const [plastic, setPlastic] = useState(""); // Id plastica
    const [plastic2, setPlastic2] = useState(""); // Codice plastica   
    const [rei, setRei] = useState(""); // Stato se balla reimballata
    const [cdbp, setCdbp] = useState(""); // Condizione balla pressista
    const [selected_b, setSelectedBale] = useState(""); // Balla selezionata

    // Dati carrellista
    const [cdbc, setCdbc] = useState(""); // Condizione balla carrellista
    const [reason, setReason] = useState(""); // Motivazione
    const [weight, setWeight] = useState(0); // Peso
    const [dest_wh, setDestWh] = useState(""); // magazzino destinazione

    const [note, setNote] = useState(""); // Note (sia carrellista che pressista)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await fetch(srvurl + "/presser", {
                    method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: idBale })
                })

                const data = await resp.json()

                console.log(data[0])

                setPlastic(data[0].plastic)
                setRei(data[0]._idRei)
                setCdbp(data[0]._idCpb)
                setSelectedBale(data[0]._idSb)
                setNote(data[0].notes)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [idBale])

    /**
     * Handle Click function
     * 
     * @param {boolean} f 
     */
    const handleClick = (f) => {
        try {
            const cookie = JSON.parse(Cookies.get('user-info'));
            let url = "";
            let body = {};
            if (f) {
                url = srvurl + "/upresserbale";
                body = {
                    id_presser: cookie.id_user,
                    id_plastic: plastic,
                    id_rei: rei,
                    id_cpb: cdbp,
                    id_sb: selected_b,
                    note: note,
                    where: idBale,
                }
            } else { 
                url = srvurl + "/uwheelmanbale";
                body = {
                    id_wheelman: cookie.id_user,
                    id_cwb: cdbc,
                    id_rnt: reason,
                    id_wd: dest_wh,
                    note: note,
                    printed: false, // Da modificare
                    weight: weight,
                    where: idBale,
                }
            }

            const resp = fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ body })
            })

            if (!resp.ok) {
                <Alert msg={error} />
            } else {
                handlerConfirm
            }

        } catch (error) {
            <Alert msg={error} />
        }
    }

    return (
        <>
            <div className='grid grid-cols-5'>
                <SelectInput 
                    searchFor={(type === 'presser') ? "plastic" : "cdbc"}
                    value={(type === 'presser') ? plastic : cdbc}
                    onChange={(e) => { 
                        if (type === 'presser') {
                            let code = e.target.selectedOptions[0].getAttribute("data-code");
                            setPlastic(e.target.value); 
                            setPlastic2(code);
                        } else {
                            setCdbc(e.target.value)
                        }
                    }} 
                    fixedW 
                />
                <SelectInput 
                    searchFor={(type === 'presser') ? "rei" : "reason"} 
                    value={(type === 'presser') ? rei : reason}
                    onChange={(e) => {
                        if (type === 'presser')
                            setRei(e.target.value)
                        else setReason(e.target.value)
                    }} 
                    fixedW 
                />
                <SelectInput 
                    searchFor={(type === 'presser') ? "cdbp" : "dest-wh"} 
                    value={(type === 'presser') ? cdbp : dest_wh}
                    onChange={(e) => {
                        if (type === 'presser')
                            setCdbp(e.target.value)
                        else setDestWh(e.target.value)
                    }}  
                    fixedW 
                />
                {(type === 'presser') ? (
                    <SelectInput 
                        searchFor={"selected-b"} 
                        value={selected_b}
                        onChange={(e) => setSelectedBale(e.target.value)} 
                        fixedW 
                    />
                ) : (
                    <input 
                        type="number"
                        id="peso-carrellista"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Inserisci peso"
                    />
                )}
                <input 
                    className='text-black'
                    type="text"
                    id="note-carrellista"
                    value={note || ""}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Inserisci note"
                    // defaultValue={note}
                />
            </div>
            <div className=''>
                <button >
                    Annulla
                </button>
                <button 
                className='on-btn-confirm'
                onClick={() => { 
                    handleClick(type === 'presser');
                    handleConfirmed();
                }}
                >
                    OK
                </button>
            </div>
        </>
    )
}
