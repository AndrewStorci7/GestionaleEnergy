/**
 * Custom component for adding, updating or erase a bale 
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {ref} bale
 * 
 * @returns 
 */
export default function AddPallet({ bale }) {

    return(
        <div className="w-1/2 font-bold">
            <div className="flex flex-row-reverse">
                <button className="m-[10px] rounded-md bg-green-600 p-[5px]">
                    Aggiungi
                </button>
                <button className="m-[10px] rounded-md bg-blue-600 p-[5px]">
                    Modifica
                </button>
                <button className="m-[10px] rounded-md bg-red-600 p-[5px]">
                    Elimina
                </button>
            </div>
        </div>
    );
}