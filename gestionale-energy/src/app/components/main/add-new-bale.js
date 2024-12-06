import { getSrvUrl } from '@@/config';

const srvurl = getSrvUrl()

/**
 * Custom component for adding, updating or erase a bale 
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {ref} bale
 * 
 * @returns 
 */
export default function AddBale({ implant, idUser, clickAddHandle }) {

    const addNewBale = async () =>  {

        const data = {
            id_presser: idUser,
            id_implant: implant
        }

        const check = await fetch(srvurl + '/add-bale', {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({ data }),
        })

        const resp = await check.json().data

        if (!check.ok) {
            // TODO insierire componente ErrorAlert
            console.log("Errore")
        } else {
            // console.log("OK")
            clickAddHandle(resp)
        }
        
    }

    return(
        <div className="w-1/2 font-bold">
            <div className="flex flex-row-reverse">
                <button className="m-[10px] rounded-md bg-gray-300 p-[5px]">
                    Elimina
                </button>
                <button className="m-[10px] rounded-md bg-gray-300 p-[5px] mr-[50px]">
                    Modifica
                </button>
                <button 
                className="m-[10px] rounded-md bg-gray-300 p-[5px]"
                onClick={addNewBale}
                >
                    Aggiungi
                </button>
            </div>
        </div>
    );
}