import TableHeader from "./table-header";
import CheckButton from "../select-button";
import Icon from "../get-icon";

export default function Table({type}) {
    
    const _CMNSTYLE_DIV = "grid grid-cols-2 pt-[30px] relative mt-[20px]";
    const _CMNSTYLE_TABLE = "table-auto w-full p-[20px] rounded-tl-[10px]"; 

    switch (type) {
        case "admin": {
            return(
                <div className={_CMNSTYLE_DIV}>
                    <table className={_CMNSTYLE_TABLE}>
                        <TableHeader type={"presser"} />
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
                    </table>

                    <label htmlFor="gest-on-table2" className="absolute left-[50%] font-bold text-2xl bg-secondary px-[15px] rounded-t-[5px]">Carrellista</label>
                    <table id="gest-on-table2" className="table-auto w-full p-[20px] rounded-tl-[10px] opacity-50">
                        <thead className="bg-secondary">
                            <tr>
                                <th>Sel.</th>
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
        case "pressista": {
            return(
                <div className="grid grid-cols-2 pt-[30px] mt-[20px]">
                    <table className="table-auto w-full p-[20px] rounded-tl-[10px]">
                        <thead className="bg-primary">
                            <tr>
                                <th>Pressista</th>
                            </tr>
                            <tr>
                                <th>Sel.</th>
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
        case "carrellista": {
            return(
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