import CheckButton from "./select-button";

export default function TableContent() {

    return(
        <div className="grid grid-cols-2 pt-[30px]">
            <table className="table-auto w-full p-[20px] rounded-tl-[10px]">
                <thead className="bg-primary">
                    <tr>
                        <th>Pressista</th>
                    </tr>
                    <tr>
                        <th>Seleziona</th>
                        <th>Voce 1</th>
                        <th>Voce 2</th>
                        <th>Voce 3</th>
                        <th>Voce 4</th>
                        <th>Voce 5</th>
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
                    </tr>
                    <tr>
                        <td><CheckButton /></td>
                        <td>Voce 1</td>
                        <td>Voce 2</td>
                        <td>Voce 3</td>
                        <td>Voce 4</td>
                        <td>Voce 5</td>
                    </tr>
                    <tr>
                        <td><CheckButton /></td>
                        <td>Voce 1</td>
                        <td>Voce 2</td>
                        <td>Voce 3</td>
                        <td>Voce 4</td>
                        <td>Voce 5</td>
                    </tr>
                </tbody>
            </table>
            <table className="table-fixed w-full">
                <thead className="bg-primaryON">
                    <tr>
                        <th>Carrellista</th>
                    </tr>
                    <tr>
                        <th>Voce 1</th>
                        <th>Voce 2</th>
                        <th>Voce 3</th>
                        <th>Voce 4</th>
                        <th>Voce 5</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-300 text-black">
                    <tr>
                        <td>Prova valore 1</td>
                        <td>prova valore 2</td>
                        <td>prova valore 3</td>
                        <td>Prova valore 4</td>
                        <td>Prova valore 5</td>
                    </tr>
                    <tr>
                        <td>Voce 1</td>
                        <td>Voce 2</td>
                        <td>Voce 3</td>
                        <td>Voce 4</td>
                        <td>Voce 5</td>
                    </tr>
                    <tr>
                        <td>Voce 1</td>
                        <td>Voce 2</td>
                        <td>Voce 3</td>
                        <td>Voce 4</td>
                        <td>Voce 5</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}