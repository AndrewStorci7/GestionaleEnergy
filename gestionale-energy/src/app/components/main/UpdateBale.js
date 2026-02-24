import { getServerRoute, refreshPage, updateStatusTotalbale } from "@config";
import { useAlert } from "@/app/components/main/alert/AlertProvider";
import { fetchDataBale, handleStampa } from "@main/fetch";
import { useLoader } from "@/app/components/main/loader/LoaderProvider";
import SelectInput from "@/app/components/main/search/Select";
import { useWebSocket } from "@/app/components/main/ws/WebSockerProvider";
import Cookies from "js-cookie";
import Image from "next/image";
import PropTypes from "prop-types"; // per ESLint
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * @author Andrea Storci from Oppimittinetworking.com
 *
 * @param {string}   type           Tipo della balla da modificare: [ 'presser' | 'wheelman' ]
 * @param {int}      objBale        Id numerico della balla da modificare
 * @param {Function} handlerClose   Funzione che gestisce il flusso dopo aver cliccato il bottone di Annulla o Conferma
 */
export default function UpdateValuesBale({ type, objBale, handlerClose }) {
	const { showLoader } = useLoader();
	const { showAlert } = useAlert();
	const { ws, message } = useWebSocket();

	// Stati per i dati originali (per confronto)
	const [originalPresserData, setOriginalPresserData] = useState({
		plastic: "",
		rei: 0,
		cdbp: 0,
		selected_b: 0,
		notes: "",
	});
	const [originalWheelmanData, setOriginalWheelmanData] = useState({
		cdbc: 0,
		reason: 0,
		weight: 0,
		dest_wh: 0,
		notes: "",
	});

	// Stati per i dati correnti
	const [presserData, setPresserData] = useState({
		plastic: "",
		rei: 0,
		cdbp: 0,
		selected_b: 0,
		notes: "",
	});
	const [wheelmanData, setWheelmanData] = useState({
		cdbc: 0,
		reason: 0,
		weight: 0,
		dest_wh: 0,
		notes: "",
	});

	const [cacheWeight, setCacheWeight] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isPrinting, setIsPrinting] = useState(false);

	// Verifica se ci sono state modifiche confrontando i dati originali con quelli correnti
	const hasChanges = useMemo(() => {
		if (type === "presser") {
			return (
				presserData.plastic !== originalPresserData.plastic ||
				presserData.rei !== originalPresserData.rei ||
				presserData.cdbp !== originalPresserData.cdbp ||
				presserData.selected_b !== originalPresserData.selected_b ||
				presserData.notes !== originalPresserData.notes
			);
		} else {
			return (
				wheelmanData.cdbc !== originalWheelmanData.cdbc ||
				wheelmanData.reason !== originalWheelmanData.reason ||
				cacheWeight !== originalWheelmanData.weight ||
				wheelmanData.dest_wh !== originalWheelmanData.dest_wh ||
				wheelmanData.notes !== originalWheelmanData.notes
			);
		}
	}, [
		type,
		presserData,
		wheelmanData,
		cacheWeight,
		originalPresserData,
		originalWheelmanData,
	]);

	// Verifica se i dati sono validi per procedere
	const canProceed = useMemo(() => {
		if (type === "presser") {
			return (
				presserData.plastic !== null &&
				presserData.plastic !== undefined &&
				presserData.plastic !== ""
			);
		} else {
			return cacheWeight > 0 || wheelmanData.cdbc === 2 || hasChanges;
		}
	}, [type, presserData.plastic, cacheWeight, wheelmanData.cdbc, hasChanges]);

	// Verifica se può stampare (peso > 0 e non deve necessariamente aver confermato)
	const canPrint = useMemo(() => {
		return (type === "wheelman" && cacheWeight > 0) || wheelmanData.cdbc === 2;
	}, [type, wheelmanData.cdbc, cacheWeight]);

	const handleData = useCallback((response) => {
		const data = response.data;

		if (type === "presser") {
			const tmpData = {
				plastic: data.plastic,
				rei: data._idRei,
				cdbp: data._idCpb,
				selected_b: data._idSb,
				notes: data.notes || "",
			};
			setPresserData(tmpData);
			setOriginalPresserData({ ...tmpData }); // Salva i dati originali
		} else {
			const tmpData = {
				cdbc: data._idCwb,
				reason: data._idRnt,
				weight: data.weight || 0,
				dest_wh: data._idWd,
				notes: data.notes || "",
			};
			setWheelmanData(tmpData);
			setOriginalWheelmanData({ ...tmpData }); // Salva i dati originali
			setCacheWeight(data.weight || 0);
		}
	});

	useEffect(() => {
		fetchDataBale(type, objBale, handleData);
	}, [type, objBale, handleData]);

	/**
	 * Funzione per salvare i dati della balla
	 * @param {boolean} skipRefresh - Se true, non ricarica la pagina (utile per stampa)
	 */
	const saveBaleData = async (skipRefresh = false) => {
		try {
			setIsLoading(true);
			const cookie = JSON.parse(Cookies.get("user-info"));
			let body = null;

			if (type === "presser") {
				body = {
					id_presser: parseInt(cookie.id_user, 10),
					id_plastic: presserData.plastic,
					id_rei: presserData.rei ? parseInt(presserData.rei, 10) : null,
					id_cpb: presserData.cdbp ? parseInt(presserData.cdbp, 10) : null,
					id_sb: presserData.selected_b
						? parseInt(presserData.selected_b, 10)
						: null,
					note: presserData.notes || null,
					where: parseInt(objBale.idBale, 10),
				};
			} else {
				body = {
					id_wheelman: parseInt(cookie.id_user, 10),
					id_cwb: wheelmanData.cdbc ? parseInt(wheelmanData.cdbc, 10) : null,
					id_rnt: wheelmanData.reason
						? parseInt(wheelmanData.reason, 10)
						: null,
					id_wd: wheelmanData.dest_wh
						? parseInt(wheelmanData.dest_wh, 10)
						: null,
					note: wheelmanData.notes || null,
					weight: parseFloat(cacheWeight),
					where: parseInt(objBale.idBale, 10),
				};
			}

			// Aggiorna i dati della balla
			await fetch(getServerRoute("update-bale"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ body, type }),
			});

			// Aggiorna i dati originali per evitare false modifiche
			if (type === "presser") {
				setOriginalPresserData({ ...presserData });
			} else {
				setOriginalWheelmanData({ ...wheelmanData, weight: cacheWeight });
			}

			if (!skipRefresh) {
				const body2 = { status: -1, where: objBale.idUnique };
				await updateStatusTotalbale(body2);
				refreshPage(ws);
			}

			return true;
		} catch (error) {
			console.error("Errore nel salvare i dati:", error);
			showAlert({
				title: "Errore",
				message: "Errore nel salvare i dati della balla",
				type: "error",
			});
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Handle Click function per conferma
	 */
	const handleConfirm = async () => {
		const success = await saveBaleData(false);
		if (success) {
			handlerClose();
		}
	};

	/**
	 * Handle Click function per stampa
	 * Se ci sono modifiche non salvate, le salva prima di stampare
	 */
	const handlePrint = async () => {
		try {
			showLoader(true);
			setIsPrinting(true);
			if (hasChanges) {
				const success = await saveBaleData(true);
				if (!success) return;
			}

			await handleStampa(objBale, showAlert, handlerClose, cacheWeight > 0);
		} catch (error) {
			console.error("Errore nella stampa:", error);
			showAlert({
				title: "Errore",
				message: "Errore durante la stampa dell'etichetta",
				type: "error",
			});
		} finally {
			setIsPrinting(false);
			showLoader(false);
		}
	};

	return (
		<>
			<div className="grid grid-cols-5">
				<div className="relative px-[5px]">
					<label
						htmlFor="select-input-plastic-cdbc"
						className="text-black absolute top-[-30px] left-[5px] font-bold"
					>
						{type === "presser" ? "Codice Plastica" : "Cond. Balla Carrel."}
					</label>
					<SelectInput
						id="select-input-plastic-cdbc"
						searchFor={type === "presser" ? "plastic" : "cdbc"}
						value={type === "presser" ? presserData.plastic : wheelmanData.cdbc}
						onChange={(e) => {
							if (type === "presser") {
								setPresserData((prev) => ({
									...prev,
									plastic: e.target.value,
								}));
							} else {
								if (e.target.value === 1) {
									setWheelmanData((prev) => ({
										...prev,
										cdbc: e.target.value,
										reason: 1,
									}));
								} else {
									setWheelmanData((prev) => ({
										...prev,
										cdbc: e.target.value,
									}));
								}
							}
						}}
						fixedW
					/>
				</div>
				<div className="relative px-[5px]">
					<label
						htmlFor="select-input-rei-reason"
						className="text-black absolute top-[-30px] left-[5px] font-bold"
					>
						{type === "presser" ? "Utiliz. REI" : "Motivaz."}
					</label>
					<SelectInput
						id="select-input-rei-reason"
						disabled={type === "wheelman" && wheelmanData.cdbc === 1}
						searchFor={type === "presser" ? "rei" : "reason"}
						value={type === "presser" ? presserData.rei : wheelmanData.reason}
						onChange={(e) => {
							if (type === "presser") {
								setPresserData((prev) => ({ ...prev, rei: e.target.value }));
							} else {
								setWheelmanData((prev) => ({
									...prev,
									reason: e.target.value,
								}));
							}
						}}
						fixedW
					/>
				</div>
				<div className="relative px-[5px]">
					<label
						htmlFor="select-input-cdbp-destwh"
						className="text-black absolute top-[-30px] left-[5px] font-bold"
					>
						{type === "presser" ? "Cond. Balla Press." : "Magazzino"}
					</label>
					<SelectInput
						id="select-input-cdbp-destwh"
						searchFor={type === "presser" ? "cdbp" : "dest-wh"}
						value={type === "presser" ? presserData.cdbp : wheelmanData.dest_wh}
						onChange={(e) => {
							if (type === "presser") {
								setPresserData((prev) => ({ ...prev, cdbp: e.target.value }));
							} else {
								setWheelmanData((prev) => ({
									...prev,
									dest_wh: e.target.value,
								}));
							}
						}}
						fixedW
					/>
				</div>
				{type === "presser" ? (
					<div className="relative px-[5px]">
						<label
							htmlFor="select-input-selected-b"
							className="text-black absolute top-[-30px] left-[5px] font-bold"
						>
							Balla Selez.
						</label>
						<SelectInput
							id="select-input-selected-b"
							searchFor={"selected-b"}
							value={presserData.selected_b ?? ""}
							onChange={(e) =>
								setPresserData((prev) => ({
									...prev,
									selected_b: e.target.value,
								}))
							}
							fixedW
						/>
					</div>
				) : (
					<div className="relative px-[5px]">
						<label
							htmlFor="peso-carrellista"
							className="text-black absolute top-[-30px] left-[5px] font-bold"
						>
							Peso (kg)
						</label>
						<input
							className="text-black w-full on-input"
							type="number"
							id="peso-carrellista"
							value={cacheWeight || 0}
							onChange={(e) => {
								const newWeight = parseFloat(e.target.value) || 0;
								setCacheWeight(newWeight);
							}}
							placeholder="Inserisci peso"
						/>
					</div>
				)}
				<div>{/* spazziatore */}</div>
				<div className="relative px-[5px] col-span-2 mt-9">
					<label
						htmlFor="note-input"
						className="text-black absolute top-[-30px] left-[5px] font-bold"
					>
						Note
					</label>
					<input
						className="text-black w-full on-input"
						type="text"
						id="note-input"
						value={type === "presser" ? presserData.notes : wheelmanData.notes}
						onChange={(e) => {
							if (type === "presser") {
								setPresserData((prev) => ({ ...prev, notes: e.target.value }));
							} else {
								setWheelmanData((prev) => ({ ...prev, notes: e.target.value }));
							}
						}}
						placeholder="Inserisci note"
					/>
				</div>
			</div>

			{/* Indicatore di modifiche */}
			{hasChanges && (
				<div className="text-orange-600 font-semibold text-center mt-2">
					⚠️ Ci sono modifiche non salvate
				</div>
			)}

			<div className="flex flex-row-reverse m-[10px] mt-[20px]">
				{type === "wheelman" && (
					<button
						type="button"
						className={`border px-[10px] py-[5px] rounded-xl mr-4 text-white font-semibold
                            ${canPrint && !isPrinting ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-no-drop"}`}
						onClick={handlePrint}
						disabled={!canPrint || isPrinting}
						title={
							!canPrint
								? "Inserisci un peso valido per stampare"
								: "Stampa etichetta"
						}
					>
						<div className="flex items-center p-1">
							<Image
								src={"/filled/stampa-bianco-filled.png"}
								width={25}
								height={25}
								alt="Stampa icona"
								className="mr-2"
							/>
							{isPrinting ? "Stampando..." : "Stampa etich."}
						</div>
					</button>
				)}
				<button
					type="button"
					className={`border px-[10px] py-[5px] rounded-xl mx-4 bg-blue-500 text-white font-semibold
                        ${!canProceed ? "disabled:opacity-45 cursor-no-drop" : "hover:bg-blue-600"}`}
					onClick={handleConfirm}
					disabled={!canProceed}
				>
					{isLoading ? "Salvando..." : "Conferma"}
				</button>
				<button
					type="button"
					className="border px-[10px] py-[5px] rounded-xl bg-gray-500 text-white font-semibold mx-4 hover:bg-gray-600"
					onClick={handlerClose}
					disabled={isLoading}
				>
					Annulla
				</button>
			</div>
		</>
	);
}

UpdateValuesBale.propTypes = {
	type: PropTypes.string.isRequired,
	objBale: PropTypes.object.isRequired,
	handlerClose: PropTypes.func.isRequired,
};
