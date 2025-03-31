import { getBgColor } from "@@/config";

/**
 * 
 * @param {string}  type    [ 'presser' | 'wheelman' | 'both' | 'admin' ]
 *                          Il tipo della pagina
 * @param {boolean} primary Serve per settare correttamente il colore dello sfondo   
 *  
 * @returns 
 */
export default function TableHeader({ 
    type, 
    primary = false,
    style, 
    ...props 
}) {
    
    // const fixColor = type === "presser" ? " !text-white" : " testoProva";
    const fixColor = " !text-white"; 
    const fixStyle = " !text-left";

    switch (type) {
        case 'presser': {
            return (
                <>
                    <thead className="h-[52px]">
                        <tr>
                            {(primary) && <th className={style + fixColor + " !pl-3"}>Sel.</th>}
                            {(primary) && <th className={style + fixColor}>N°</th>}
                            {(primary) && <th className={style + fixColor}>Stato</th>}
                            <th className={style + fixStyle + fixColor}>Plastica</th>
                            <th className={style + fixStyle + fixColor}>Codice</th>
                            <th className={style + fixStyle + fixColor}><p className="truncate">Utiliz. REI</p></th>
                            <th className={style + fixStyle + fixColor}><p className="truncate">Condiz. Balla Pressa</p></th>
                            <th className={style + fixStyle + fixColor}><p className="truncate">Balla Selez.</p></th>
                            <th className={style + fixStyle + fixColor}>Note</th>
                            {(primary) && <th className={style + fixStyle + fixColor + " w-[40px]"}></th>}
                            <th className={style + fixStyle + fixColor}>Data</th>
                            <th className={style + fixStyle + fixColor}>Ora</th>
                        </tr>
                    </thead>
                </>
            );
        }
        case 'wheelman': {
            return (
                <>
                    <thead className="h-[52px]">
                        <tr>
                            {(primary) && <th className={style + fixColor + " !pl-3"}>Sel.</th>}
                            {(primary) && <th className={style + fixColor}>N°</th>}
                            {(primary) && <th className={style + fixColor}>Stato</th>}
                            {(primary) && <th className={style + fixStyle + fixColor}>Plastica</th>}
                            <th className={style + fixStyle + fixColor + fixStyle}><p className="truncate">Condiz. Balla Carrel.</p></th>
                            <th className={style + fixStyle + fixColor}>Motivaz.</th>
                            <th className={style + fixStyle + fixColor}>Peso (Kg)</th>
                            <th className={style + fixStyle + fixColor}><p className="truncate">Magaz. Destinazione</p></th>
                            <th className={style + fixStyle + fixColor}>Note</th>
                            <th className={style + fixStyle + fixColor}><p className="truncate">Stato stampa</p></th>
                            {(primary) && <th className={style + fixStyle + fixColor + "w-[40px]"}></th>}
                            <th className={style + fixStyle + fixColor}>Data</th>
                            <th className={style + fixStyle + fixColor}>Ora</th>
                        </tr>
                    </thead>
                </>
            );
        }
    }
}