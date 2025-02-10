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

    const _CMNSTYLE_LABEL = "block font-bold"
    const _CMNSTYLE_DIV = "grid content-center font-bold"
    const _CMNSTYLE_BTN = "bg-thirdary rounded-md w-fit px-[10px]"
    const _CMNSTYLE_DIV_MAIN = "w-full bg-primary_3 rounded-md"

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
        console.log("Tipo from props: ", type)
        setData(type)
        console.log(bg_color, label_title[0], searchFor[0])
    }, [type])

    return(
        <div className={`${_CMNSTYLE_DIV_MAIN} ${bg_color}`}>
            <div className="grid grid-cols-6 p-[5px] content-center">
                {/* Filtra per */}
                <div className={`${_CMNSTYLE_DIV}`}>
                    <h1 className="text-xl">Filtra per</h1>
                </div>
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
                    <SelectInput id="search-input-plastic" searchFor={"plastic"} isForSearch />
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
                <div className={`${_CMNSTYLE_DIV}`}>
                    <button className={`${_CMNSTYLE_BTN} text-xl`}>
                        Cerca
                    </button>
                </div>
            </div>
        </div>
    );
}