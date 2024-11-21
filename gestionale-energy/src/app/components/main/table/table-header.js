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
    const bg_style = (primary) ? 'bg-primary' : 'bg-secondary';
    const left_fixed = (!primary) ? 'left-[50%]' : null;
    const text = "";

    switch (type) {
        case 'presser': {
            return (
                <>
                    {/*<label htmlFor="gest-on-table2" className={`${_COMMONSTYLE} ${bg_style}`}>Pressista</label>*/}
                    <thead className={`${bg_style} text-white`}>
                        <tr>
                            {(primary) ? <th>Sel.</th> : null}
                            <th>Lavorazione</th>
                            <th>Plastica</th>
                            <th>Codice</th>
                            <th>Utiliz. REI</th>
                            <th>Condiz. Balla Pressa</th>
                            <th>Balla Selez.</th>
                            <th>Note Pressista</th>
                            <th>Conf.</th>
                            <th>Data Ins.</th>
                            <th>Ora Ins.</th>
                        </tr>
                    </thead>
                </>
            );
        }
        case 'wheelman': {
            return (
                <>
                    {/*<label htmlFor="gest-on-table2" className={`${_COMMONSTYLE} ${bg_style}`}>Carrellista</label>*/}
                    <thead className={`${bg_style} text-white`}>
                        <tr>
                            {(primary) ? <th>Sel.</th> : null}
                            <th>Condiz. Balla Carrel.</th>
                            <th>Motivaz.</th>
                            <th>Peso (Kg)</th>
                            <th>Utiliz. REI</th>
                            <th>Condiz. Balla Pressa</th>
                            <th>Balla Selez.</th>
                            <th>Note Pressista</th>
                            <th>Conf.</th>
                            <th>Data Ins.</th>
                            <th>Ora Ins.</th>
                        </tr>
                    </thead>
                </>
            );
        }
    }
}