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
    const _CMNSTYLE_TD = "border border-slate-400";
    const _MAX_HEIGHT = "h-[50px]";
    const bg_style = (primary) ? getBgColor(type, "theader") : 'bg-thirdary opacity-50';
    const text_color = (primary) ? 'text-white' : 'text-black';

    switch (type) {
        case 'presser': {
            return (
                <>
                    {/*<label htmlFor="gest-on-table2" className={`${_COMMONSTYLE} ${bg_style}`}>Pressista</label>*/}
                    <thead className={`${bg_style} ${text_color} ${_MAX_HEIGHT}`}>
                        <tr>
                            {(primary) && <th className={`${_CMNSTYLE_TD}`}>Sel.</th>}
                            {(primary) && <th className={`${_CMNSTYLE_TD}`}>N°</th>}
                            {(primary) && <th className={`${_CMNSTYLE_TD}`}>Stato</th>}
                            <th className={`${_CMNSTYLE_TD}`}>Plastica</th>
                            <th className={`${_CMNSTYLE_TD}`}>Codice</th>
                            <th className={`${_CMNSTYLE_TD}`}>Utiliz. REI</th>
                            <th className={`${_CMNSTYLE_TD}`}>Condiz. Balla Pressa</th>
                            <th className={`${_CMNSTYLE_TD}`}>Balla Selez.</th>
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
                    <thead className={`${bg_style} ${text_color} ${_MAX_HEIGHT}`}>
                        <tr>
                            {(primary) && <th className={`${_CMNSTYLE_TD}`}>Sel.</th>}
                            {(primary) && <th className={`${_CMNSTYLE_TD}`}>N°</th>}
                            {(primary) && <th className={`${_CMNSTYLE_TD}`}>Stato</th>}
                            <th className={`${_CMNSTYLE_TD}`}>Plastica</th>
                            <th className={`${_CMNSTYLE_TD}`}>Condiz. Balla Carrel.</th>
                            <th className={`${_CMNSTYLE_TD}`}>Motivaz.</th>
                            <th className={`${_CMNSTYLE_TD}`}>Peso (Kg)</th>
                            <th className={`${_CMNSTYLE_TD}`}>Magaz. Destinazione</th>
                            <th className={`${_CMNSTYLE_TD}`}>Note</th>
                            <th className={`${_CMNSTYLE_TD}`}>Stato stampa</th>
                            {(primary) && <th className={`${_CMNSTYLE_TD}`}></th>}
                            <th className={`${_CMNSTYLE_TD}`}>Data</th>
                            <th className={`${_CMNSTYLE_TD}`}>Ora</th>
                        </tr>
                    </thead>
                </>
            );
        }
    }
}