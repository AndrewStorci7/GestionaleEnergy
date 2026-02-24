import Image from "next/image";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import SelectInput from "./Select";

const PRESSER_VOICES = ["Utilizzo REI", "Balla selezionata"]
const WHEELMAN_VOICES = ["Cond. balla carrellista", "Magaz. Destinazione"]
const WHEELMAN_SEARCHFOR = ["rei", "selected-b"]
const PRESSER_SEARCHFOR = ["cdbc", "dest-wh"]

function SearchInput({ type }) {
	const _CMNSTYLE_LABEL = "block font-bold";
	const _CMNSTYLE_DIV = "grid content-center font-bold";
	const _CMNSTYLE_DIV_MAIN =
		"justify-items-start w-full bg-white rounded-md border-b border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl";

	const [bg_color, setBgColor] = useState("");
	const [searchFor, setSearchFor] = useState([]);
	const [label_title, setLabelTitle] = useState([]);
	const [attivo, setAttivo] = useState(false); // stato per attiva/disattiva

	const setData = useCallback((type) => {
		switch (type) {
			default:
			case "presser": {
				setBgColor("bg-primary_3");
				setSearchFor(PRESSER_SEARCHFOR);
				setLabelTitle(PRESSER_VOICES);
				break;
			}
			case "wheelman": {
				setBgColor("bg-secondary_3");
				setSearchFor(WHEELMAN_SEARCHFOR);
				setLabelTitle(WHEELMAN_VOICES);
				break;
			}
		}
	}, [])

	useEffect(() => {
		setData(type);
	}, [type, setData]);

	return (
		<div className={`${_CMNSTYLE_DIV_MAIN} ${bg_color}`}>
			{/* Bottone attiva/disattiva */}
			{type === "wheelman" ? (
				<button
					type="button"
					className="on-btn-wheelman font-bold "
					onClick={() => setAttivo(!attivo)}
				>
					<div className="flex items-center p-1">
						<Image
							src={"/filled/aggiungi-bianco-filled.png"}
							width={25}
							height={25}
							alt="Aggiungi icona"
							className={"mr-2"}
						/>
						{!attivo ? "Attiva filtro" : "Disattiva filtro"}
					</div>
				</button>
			) : (
				<button
					type="button"
					className="on-btn-presser font-bold"
					onClick={() => setAttivo(!attivo)}
				>
					<div className="flex items-center p-1">
						<Image
							src={"/filled/aggiungi-bianco-filled.png"}
							width={25}
							height={25}
							alt="Aggiungi icona"
							className={"mr-2"}
						/>
						{!attivo ? "Attiva filtro" : "Disattiva filtro"}
					</div>
				</button>
			)}

			{/* Rendering condizionale */}
			{attivo && (
				<div className="grid grid-cols-1 p-4 content-center">
					<div className={`${_CMNSTYLE_DIV}`}>
						<h1 className="text-xl">Filtra per</h1>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
						<div>
							<label
								className={`${_CMNSTYLE_LABEL}`}
								htmlFor="search-input-status"
							>
								Lavorazione
							</label>
							<SelectInput
								id="search-input-status"
								searchFor={"status"}
								isForSearch
							/>
						</div>
						<div>
							<label
								className={`${_CMNSTYLE_LABEL}`}
								htmlFor="search-input-plastic"
							>
								Plastica
							</label>
							<SelectInput
								id="search-input-plastic"
								searchFor={"plastic"}
								isForSearch
							/>
						</div>
						<div>
							<label
								className={`${_CMNSTYLE_LABEL}`}
								htmlFor={`search-input-${searchFor[0]}`}
							>
								{label_title[0]}
							</label>
							<SelectInput
								id={`search-input-${searchFor[0]}`}
								searchFor={searchFor[0]}
								isForSearch
							/>
						</div>
						<div>
							<label
								className={`${_CMNSTYLE_LABEL}`}
								htmlFor={`search-input-${searchFor[1]}`}
							>
								{label_title[1]}
							</label>
							<SelectInput
								id={`search-input-${searchFor[1]}`}
								searchFor={searchFor[1]}
								isForSearch
							/>
						</div>
						<div className="flex items-center gap-4 justify-start col-span-2">
							<button
								type="button"
								className="rounded-full bg-cyan-500 p-2 flex items-center pr-4"
							>
								<img
									src="/outlined/ricerca1.png"
									alt="Ricerca"
									className="w-6 h-6 mr-3"
								/>
								<p className="text-white font-bold">Cerca</p>
							</button>
							<button
								type="button"
								className="rounded-full bg-cyan-950 p-2 flex items-center pr-4"
							>
								<img
									src="/outlined/rimuovi1.png"
									alt="Rimuovi"
									className="w-6 h-6 mr-3"
								/>
								<p className="text-white font-bold">Annulla</p>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

SearchInput.propTypes = {
	type: PropTypes.string.isRequired,
};

export default React.memo(SearchInput);
