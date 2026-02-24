import { useAlert } from "@/app/components/main/alert/AlertProvider";
import { refreshPage } from "@config";
import { fetchDataTotalBale } from "@fetch";
import { checkIfAttributeIsValid } from "@functions";
import Icon from "@/app/components/main/GetIcon";
import { useLoader } from "@/app/components/main/loader/LoaderProvider";
import CheckButton from "@/app/components/main/SelectButton";
import InsertNewBale from "@/app/components/main/table/TableAddNewBale";
import { useWebSocket } from "@/app/components/main/ws/WebSockerProvider";
import Cookies from "js-cookie";
import PropTypes from "prop-types"; // per ESLint
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Custom component for handling the data of a bale
 *
 * @param {string}      type    [ `presser` | `wheelman` | `both` | `admin` ]
 *                              Il tipo della pagina
 * @param {Object}      add     Oggetto che contiene lo stato di add e la funzione che gestisce il suo cambiamento
 *                              [ `true` | `false` ]
 *                              True se il bottone di aggiunta è stato premuto, altrimenti false
 * @param {Object}      useFor  [ `regular` | `specific` | `reverse` ]
 *                              Di default è impostato su `regular`, ovvero, che stampa tutte le alle ancora in lavorazione.
 *                              Se invece viene impostato su `specific`, allora stamperà le balle completate.
 *                              Se impostato su `reverse` verranno stampate le balle al contrario in ordine di inserimento.
 *
 * @param {Function}    noData  Funzione che aggiorna lo stato della variabile noData.
 *                              Serve per far visualizzare il messaggio "Nessun dato" nel caso in cui non vengano restituiti dati dal database
 *
 * @param {Function}    handleSelect    Accetta una funzione che gestisce la selezione di una balla
 *
 * @param {boolean}     primary Serve per settare correttamente il colore dello sfondo
 *
 * @param {boolean}     tableChanged    Serve per ricaricare la componente quando viene effettuata una modifica, eliminazione o aggiunta
 *
 * @returns
 */
export default function TableContent({
	admin = false,
	type,
	add,
	useFor = "regular",
	noData,
	handleSelect,
	primary = false,
	handleError,
	selectedBaleId,
	style,
}) {
	// serve solo per il conteggio dei render
	// viene utilizzato per far visualizzare il caricamento dei dati
	const [countRender, setRender] = useState(0);
	const { showLoader } = useLoader();
	const { showAlert } = useAlert();
	const { ws, message } = useWebSocket();

	const [content, setContent] = useState([]);

	const [isEmpty, setEmpty] = useState(false);

	const selectedBaleIdRef = useRef([]);

	const handleNoteClick = (value) => {
		showAlert({
			title: "Nota dell'utente",
			message: value,
			type: "note",
		});
	};

	/**
	 *
	 * @param {boolean} valid Se il parametro è true allora ricarica la pagina altrminet
	 */
	const handleAddChange = async (valid = true) => {
		if (valid) {
			refreshPage(ws);
			add.changeAddBtn();
		} else {
			handleError();
		}
	};

	const safeType = useMemo(() => {
		if (!type || (type !== "presser" && type !== "wheelman")) {
			// console.warn(`Invalid type in TableContent: ${type}, defaulting to 'presser'`);
			return "presser";
		}
		return type;
	}, [type]);

	const fetchData = useCallback(async () => {
		if (countRender === 0) {
			showLoader(true, "Caricamento dei dati");
		}

		try {
			const cookies = JSON.parse(Cookies.get("user-info"));
			const body = { id_implant: cookies.id_implant, useFor };

			await fetchDataTotalBale(
				body,
				safeType,
				setContent,
				setEmpty,
				noData,
				showAlert,
			);
		} catch (error) {
			console.error("Error fetching data:", error);
			showAlert({
				title: null,
				message: error.message,
				type: "error",
			});
		} finally {
			showLoader(false);
		}
	}, [safeType, useFor, noData, showAlert, countRender, showLoader]);

	/**
	 * renderDataContent
	 *
	 * Renderizza i dati del carrellista e del pressista in un'unica riga
	 *
	 * @param {Object}  data dati provenienti dal database che possono essere del pressista ("presser") o del carrellista ("wheelman")
	 * @param {string}  style stile del background da applicare a tutta la riga
	 * @param {number}  idUnique Id univoco della balla totale
	 * @param {boolean} showBtnOk se true inserirà uno spazio per il bottone di conferma aggiunta, altrimenti no
	 * @returns
	 */
	const renderDataContent = (data, style, idUnique, showBtnOk) => {
		// gestire meglio l'errore
		if (typeof data !== "object") return;

		// Data e ora del pressista
		const date = data.data_ins?.substr(0, 10).replaceAll("-", "/") || "";
		const hour = data.data_ins?.substr(11, 5) || "";
		return (
			<>
				{/* Dati del pressista */}
				{Object.entries(data).map(([key, value]) =>
					checkIfAttributeIsValid(key) ? (
						key === "notes" && value ? (
							<td key={idUnique + key} className={`${style} !p-1`}>
								<button type="button" onClick={() => handleNoteClick(value)}>
									<Icon type="info" />
								</button>
							</td>
						) : key === "is_printed" ? (
							<td key={idUnique + key} className={`${style} !p-2 font-bold`}>
								{value === 0 ? "Da stamp." : "Stampato"}
							</td>
						) : key === "weight" ? (
							<td className={`${style} !p-2`} key={idUnique + key}>
								{value}
							</td>
						) : key !== "data_ins" ? (
							<td key={idUnique + key} className={`${style} !p-2`}>
								{value}
							</td>
						) : null
					) : null,
				)}

				{showBtnOk && <td className={`${style} !p-2`}></td>}
				{/* spazio del bottone dell'OK per la conferma dell'aggiunta */}
				<td className={`${style} !p-2 font-bold`}>{`${date} ${hour}`}</td>
			</>
		);
	};

	useEffect(() => {
		// prelevo i dati
		fetchData();

		// incremento il contatore dei render
		setRender((prev) => prev + 1);
	}, [
		// prelevo i dati
		fetchData,
	]);

	const handleRowClick = (id, idUnique) => {
		const newSelectedBaleId = selectedBaleId === id ? null : id;
		selectedBaleIdRef.current = newSelectedBaleId;
		handleSelect(newSelectedBaleId, idUnique);
	};

	return (
		<tbody className="bg-white dark:bg-slate-800 overflow-y-scroll select-text">
			{useFor === "regular" && add.state && (
				<InsertNewBale
					style={style}
					type={type}
					mod={primary}
					primary={primary}
					confirmHandle={handleAddChange}
				/>
			)}

			{!isEmpty &&
				content &&
				content.map((bale) => {
					const plastic = bale.presser.plastic;
					const code = bale.presser.codePlastic;
					const id = type === "presser" ? bale.presser.id : bale.wheelman.id;
					const idUnique = bale.idUnique;

					const status =
						bale.status === 1 && bale.wheelman._idCwb === 2
							? "rei"
							: bale.status === 0
								? "working"
								: bale.status === 1
									? "completed"
									: "warning";

					// variabile che controlla se la balla corrente è ferro o allum,
					// qualora sia vero la riga verrà colorato di grigio
					const bgAllumFerro =
						useFor !== "specific" &&
						(plastic === "ALLUM." || plastic === "FERRO")
							? "!bg-gray-400"
							: "";

					return (
						<tr
							key={idUnique}
							data-bale-id={
								safeType === "wheelman" ? bale.wheelman.id : bale.presser.id
							}
							className={`max-h-[45px] h-[45px] bg-gray-200 ${bgAllumFerro}`}
						>
							{/* Nel caso in cui viene chiamata la componente con la prop `primary` a `true`
                        Verranno visualizzati il bottone di selezione, l'id e lo stato */}
							{!admin && (
								<td key={`${idUnique}_checkbtn`} className={style}>
									{(useFor === "regular" || useFor === "reverse") && (
										<CheckButton
											isSelected={selectedBaleId === id}
											handleClick={() => handleRowClick(id, idUnique)}
										/>
									)}
								</td>
							)}
							<td className={`${style + bgAllumFerro} font-bold`}>
								{idUnique}
							</td>
							<td className={style + bgAllumFerro}>
								<Icon type={status} />
							</td>
							<td className={style + bgAllumFerro}>{plastic}</td>

							{type === "presser" ? (
								<td className={style + bgAllumFerro}>{code}</td>
							) : (
								""
							)}

							{renderDataContent(
								type === "presser" ? bale.presser : bale.wheelman,
								`${style} ${bgAllumFerro}`,
								idUnique,
								type === "presser",
							)}
							{renderDataContent(
								type === "presser" ? bale.wheelman : bale.presser,
								type === "presser"
									? `  ${style} bgWheelman300 ${bgAllumFerro}`
									: `bgPresser300 ${style} ${bgAllumFerro}`,
								idUnique,
								false,
							)}
						</tr>
					);
				})}
		</tbody>
	);
}

TableContent.propTypes = {
	admin: PropTypes.bool,
	type: PropTypes.string,
	add: PropTypes.object,
	useFor: PropTypes.string,
	noData: PropTypes.func,
	handleSelect: PropTypes.func,
	primary: PropTypes.bool,
	handleError: PropTypes.func,
	selectedBaleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	style: PropTypes.string,
};
