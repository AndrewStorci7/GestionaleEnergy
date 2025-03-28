import { useEffect, useState } from "react";
import SelectInput from "./select";

/**
 * Search/filter Component
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {string} type
 * 
 * @returns SearchInput
 */
export default function SearchInput({ type }) {

    const _CMNSTYLE_LABEL = "block font-bold  "
    const _CMNSTYLE_DIV = "grid content-center font-bold "
    const _CMNSTYLE_BTN = "bg-thirdary rounded-md w-fit px-[10px]"
    const _CMNSTYLE_DIV_MAIN = "justify-items-start w-full bg-white rounded-md border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl"

    const [bg_color, setBgColor] = useState("");
    const [searchFor, setSearchFor] = useState([]);
    const [label_title, setLabelTitle] = useState([]);

    const setData = (type) => {
        switch (type) {
            case "presser": {
                setBgColor("bg-primary_3")
                setSearchFor(["rei", "selected-b"])
                setLabelTitle(["Utilizzo REI", "Balla selezionata"])
                break;
            }
            case "wheelman": {
                setBgColor("bg-secondary_3")
                setSearchFor(["cdbc", "dest-wh"])
                setLabelTitle(["Cond. balla carrellista", "Magaz. Destinazione"])
                break;
            }
            default: { /// TEST start
                setBgColor("bg-primary_3")
                setSearchFor(["rei", "selected-b"])
                setLabelTitle(["Utilizzo REI", "Balla selezionata"])
                break;
            } /// TEST end
        }
    }

    useEffect(() => {
        setData(type)
    }, [type])

    return(
        <div className={`${_CMNSTYLE_DIV_MAIN} ${bg_color}`}>
            <div className="grid grid-cols-1 p-4 content-center">
                {/* Filtra per */}
                <div className={`${_CMNSTYLE_DIV}`}>
                    <h1 className="text-xl">Filtra per</h1>
                </div>
                {/* The dropdowns in the same row */}
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div>
                        <label 
                            className={`${_CMNSTYLE_LABEL}`}
                            htmlFor="search-input-status">Lavorazione</label>
                        <SelectInput id="search-input-status" searchFor={"status"} isForSearch />
                    </div>
                    <div>
                        <label 
                            className={`${_CMNSTYLE_LABEL}`}
                            htmlFor="search-input-plastic">Plastica</label>
                        <SelectInput  id="search-input-plastic" searchFor={"plastic"} isForSearch />
                    </div>
                    <div>
                        <label 
                            className={`${_CMNSTYLE_LABEL}`}
                            htmlFor={`search-input-${searchFor[0]}`} >{label_title[0]}</label>
                        <SelectInput id={`search-input-${searchFor[0]}`} searchFor={searchFor[0]} isForSearch />
                    </div>
                    <div>
                        <label 
                            className={`${_CMNSTYLE_LABEL}`}
                            htmlFor={`search-input-${searchFor[1]}`} >{label_title[1]}</label>
                        <SelectInput id={`search-input-${searchFor[1]}`} searchFor={searchFor[1]} isForSearch />
                    </div>
                    {/* Buttons container */}
                    <div className="flex items-center gap-4 justify-start col-span-2">
                        <button className="rounded-full bg-cyan-500 p-2 flex items-center pr-4">
                            <img 
                                src="/ricerca1.png" 
                                alt="Ricerca"
                                className="w-6 h-6 mr-3" 
                            />
                            <p className="text-white font-bold">Cerca</p>
                        </button>
                        <button className="rounded-full bg-cyan-950 p-2 flex items-center pr-4">
                            <img 
                                src="/rimuovi1.png" 
                                alt="Rimuovi"
                                className="w-6 h-6 mr-3" 
                            />
                            <p className="text-white font-bold">Annulla</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
