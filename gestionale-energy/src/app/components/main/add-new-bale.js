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
export default function AddBale({ bale }) {

    const addNewBale = async () =>  {

        const test = {
            id_presser: 1,
            id_plastic: '\'IPS/C\'',
            id_rei: null,
            id_cpb: null,
            id_sb: null,
            note: 'Prova inserimento da AddBale',
        }

        console.log(JSON.stringify(test))

        const check = await fetch(srvurl + '/add-bale', {
            method: 'POST',
            body: JSON.stringify({ data: test}),
            headers: {'Content-Type': 'application/json' }
        })

        console.log(check)
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