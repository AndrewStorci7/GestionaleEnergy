import { getBgColor } from "@@/config";

/**
 * 
 * @param {string}  type    [ 'presser' | 'wheelman' | 'both' | 'admin' ]
 *                          Il tipo della pagina
 * @param {boolean} primary Serve per settare correttamente il colore dello sfondo   
 *  
 * @returns 
 */
export default function TableHeader({ type, primary = false }) {

    // const _COMMONSTYLE = "absolute top-[0px] font-bold text-2xl px-[15px] rounded-t-[5px]";
    // const _CMNSTYLE_TD = "border border-slate-400";
    const _CMNSTYLE_TD = "border-b dark:border-slate-600 font-medium p-3 pt-0 text-slate-400 dark:text-slate-200 text-left";
    const _MAX_HEIGHT = "h-[52px]";
    const bg_style = (primary) ? getBgColor(type, "theader") : 'bg-thirdary opacity-50';
    const text_color = (primary) ? 'text-white' : 'text-black';
    const fixPadding = "p-2"

    switch (type) {
        case 'presser': {
            return (
                <>
                    {/*<label htmlFor="gest-on-table2" className={`${_COMMONSTYLE} ${bg_style}`}>Pressista</label>*/}
                    <thead 
                    // className={`${bg_style} ${text_color} ${_MAX_HEIGHT}`}
                    className={_MAX_HEIGHT}
                    >
                        <tr>
                            {(primary) && <th className={_CMNSTYLE_TD + fixPadding + "pl-3"}>Sel.</th>}
                            {(primary) && <th className={_CMNSTYLE_TD + fixPadding}>N°</th>}
                            {(primary) && <th className={_CMNSTYLE_TD + fixPadding}>Stato</th>}
                            <th className={`${_CMNSTYLE_TD}`}>Plastica</th>
                            <th className={`${_CMNSTYLE_TD}`}>Codice</th>
                            <th className={`${_CMNSTYLE_TD}`}><p className="truncate">Utiliz. REI</p></th>
                            <th className={`${_CMNSTYLE_TD}`}><p className="truncate">Condiz. Balla Pressa</p></th>
                            <th className={`${_CMNSTYLE_TD}`}><p className="truncate">Balla Selez.</p></th>
                            <th className={`${_CMNSTYLE_TD}`}>Note</th>
                            {(primary) && <th className={`${_CMNSTYLE_TD} w-[40px]`}></th>}
                            <th className={`${_CMNSTYLE_TD}`}>Data</th>
                            <th className={`${_CMNSTYLE_TD}`}>Ora</th>
                        </tr>
                    </thead>
                </>
            );
        }
        case 'wheelman': {
            return (
                <>
                    {/*<label htmlFor="gest-on-table2" className={`${_COMMONSTYLE} ${bg_style}`}>Carrellista</label>*/}
                    <thead 
                    // className={`${bg_style} ${text_color} ${_MAX_HEIGHT}`}
                    className={_MAX_HEIGHT}
                    >
                        <tr>
                            {(primary) && <th className={_CMNSTYLE_TD + fixPadding + "pl-3"}>Sel.</th>}
                            {(primary) && <th className={_CMNSTYLE_TD + fixPadding}>N°</th>}
                            {(primary) && <th className={_CMNSTYLE_TD + fixPadding}>Stato</th>}
                            {(primary) && <th className={`${_CMNSTYLE_TD}`}>Plastica</th>}
                            <th className={`${_CMNSTYLE_TD}`}><p className="truncate">Condiz. Balla Carrel.</p></th>
                            <th className={`${_CMNSTYLE_TD}`}>Motivaz.</th>
                            <th className={`${_CMNSTYLE_TD}`}>Peso (Kg)</th>
                            <th className={`${_CMNSTYLE_TD}`}><p className="truncate">Magaz. Destinazione</p></th>
                            <th className={`${_CMNSTYLE_TD}`}>Note</th>
                            <th className={`${_CMNSTYLE_TD}`}><p className="truncate">Stato stampa</p></th>
                            {(primary) && <th className={`${_CMNSTYLE_TD} w-[40px]`}></th>}
                            <th className={`${_CMNSTYLE_TD}`}>Data</th>
                            <th className={`${_CMNSTYLE_TD}`}>Ora</th>
                            
                        </tr>
                    </thead>
                </>
            );
        }
    }
}