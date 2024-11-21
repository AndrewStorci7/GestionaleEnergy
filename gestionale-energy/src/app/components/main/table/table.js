import TableHeader from "./table-header";
import CheckButton from "../select-button";
import Icon from "../get-icon";
import TableContent from "./table-content";

export default function Table({ type }) {
    
    const _CMNSTYLE_TITLE = "text-3xl font-bold";
    const _CMNSTYLE_DIV = "grid grid-cols-2 pt-[30px] relative mt-[20px]";
    const _CMNSTYLE_TABLE = "table-auto w-full p-[20px] rounded-tl-[10px]"; 
    const _CMNSTYLE_LABEL = "absolute top-[-2px] font-bold text-2xl px-[15px] rounded-t-[5px] text-white";
    // const bg_style = (primary) ? 'bg-primary' : 'bg-secondary';
    // const left_fixed = (!primary) ? 'left-[50%]' : null;

    switch (type) {
        case "admin": {
            return(
                <>
                    <h1 className={_CMNSTYLE_TITLE}>Pagina Amministratore</h1>
                    <div className={_CMNSTYLE_DIV}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} primary />
                            {/*
                            <tbody className="bg-secondary text-black">
                                <tr>
                                    <td><CheckButton /></td>
                                    <td><Icon type={"completed"} /></td>
                                    <td>prova valore 2</td>
                                    <td>prova valore 3</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                </tr>
                            </tbody>
                            */}
                        </table>

                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} bg-secondary left-[50%]`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"}/>
                            {/*
                            <tbody className="bg-gray-200 text-black">
                                <tr>
                                    <td><CheckButton /></td>
                                    <td>Prova valore 1</td>
                                    <td>prova valore 2</td>
                                    <td>prova valore 3</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                </tr>
                            </tbody>
                            */}
                        </table>
                    </div>
                </>
            );
        }
        case "pressista": {
            return(
                <>
                    <h1 className={_CMNSTYLE_TITLE}>Pagina Pressista</h1>
                    <div className={_CMNSTYLE_DIV}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} primary />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} bg-secondary left-[50%]`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"}/>
                        </table>
                    </div>
                </>
            );
        }
        case "carrellista": {
            return(
                <>
                    <h1 className={_CMNSTYLE_TITLE}>Pagina Carrellista</h1>
                    <div className="grid grid-cols-2 pt-[30px] mt-[20px]">
                        <table className="table-auto w-full p-[20px] rounded-tl-[10px]">
                            <thead className="bg-primaryON">
                                <tr>
                                    <th>Carrellista</th>
                                </tr>
                                <tr>
                                    <th>Seleziona</th>
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
                            <tbody className="bg-gray-200 text-black">
                                <tr>
                                    <td><CheckButton /></td>
                                    <td>Prova valore 1</td>
                                    <td>prova valore 2</td>
                                    <td>prova valore 3</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                </tr>
                                <tr>
                                    <td><CheckButton /></td>
                                    <td>Prova valore 1</td>
                                    <td>prova valore 2</td>
                                    <td>prova valore 3</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                </tr>
                                <tr>
                                    <td><CheckButton /></td>
                                    <td>Prova valore 1</td>
                                    <td>prova valore 2</td>
                                    <td>prova valore 3</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-auto w-full p-[20px] rounded-tl-[10px]">
                            <thead className="bg-primary">
                                <tr>
                                    <th>Pressista</th>
                                </tr>
                                <tr>
                                    <th>Seleziona</th>
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
                            <tbody className="bg-secondary text-black">
                                <tr>
                                    <td><CheckButton /></td>
                                    <td>Prova valore 1</td>
                                    <td>prova valore 2</td>
                                    <td>prova valore 3</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                </tr>
                                <tr>
                                    <td><CheckButton /></td>
                                    <td>Prova valore 1</td>
                                    <td>prova valore 2</td>
                                    <td>prova valore 3</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                </tr>
                                <tr>
                                    <td><CheckButton /></td>
                                    <td>Prova valore 1</td>
                                    <td>prova valore 2</td>
                                    <td>prova valore 3</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                    <td>Prova valore 5</td>
                                    <td>Prova valore 4</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            );
        }
        default: {
            return(
                <div className="grid grid-cols-2 pt-[30px] mt-[20px]">
                    <table className="table-auto w-full p-[20px] rounded-tl-[10px]">
                        <thead className="bg-primary">
                            <tr>
                                <th>Pressista</th>
                            </tr>
                            <tr>
                                <th>Seleziona</th>
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
                        <tbody className="bg-secondary text-black">
                            <tr>
                                <td><CheckButton /></td>
                                <td>Prova valore 1</td>
                                <td>prova valore 2</td>
                                <td>prova valore 3</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                            </tr>
                            <tr>
                                <td><CheckButton /></td>
                                <td>Prova valore 1</td>
                                <td>prova valore 2</td>
                                <td>prova valore 3</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                            </tr>
                            <tr>
                                <td><CheckButton /></td>
                                <td>Prova valore 1</td>
                                <td>prova valore 2</td>
                                <td>prova valore 3</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table-auto w-full p-[20px] rounded-tl-[10px]">
                        <thead className="bg-primaryON">
                            <tr>
                                <th>Carrellista</th>
                            </tr>
                            <tr>
                                <th>Seleziona</th>
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
                        <tbody className="bg-gray-200 text-black">
                            <tr>
                                <td><CheckButton /></td>
                                <td>Prova valore 1</td>
                                <td>prova valore 2</td>
                                <td>prova valore 3</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                            </tr>
                            <tr>
                                <td><CheckButton /></td>
                                <td>Prova valore 1</td>
                                <td>prova valore 2</td>
                                <td>prova valore 3</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                            </tr>
                            <tr>
                                <td><CheckButton /></td>
                                <td>Prova valore 1</td>
                                <td>prova valore 2</td>
                                <td>prova valore 3</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                                <td>Prova valore 5</td>
                                <td>Prova valore 4</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }
}