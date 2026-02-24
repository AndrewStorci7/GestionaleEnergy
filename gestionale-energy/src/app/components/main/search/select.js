import { useAlert } from "@/app/components/main/alert/AlertProvider";
import { fetchDataSingleElements } from "@fetch";
import PropTypes from "prop-types"; // per ESLint
import React, { useEffect, useState } from "react";

/**
 * @author Andrea Storci from Oppimittinetworking
 *
 * @param {boolean}  disabled
 * @param {string}   searchFor   [ Ricerca per
 *                                  'status'        => Stato lavorazione
 *                                  'plastic'       => Tipo o codice plastica
 *                                  'cdbc'          => Condizione balla carrellista
 *                                  'cdbp'          => Condizione balla pressista
 *                                  'dest-wh'       => magazzino di destinazione
 *                                  'rei'           => Utilizzo REI
 *                                  'selected-b'    => Balla selezionata
 *                                  'reason'        => Motivazione
 *                               ]
 * @param {string}   id          Id of the component
 * @param {boolean}  fixedW      Se true andrà a settare per default una larghezza fissa
 * @param {any}      value       Variabile nella quale salvare l'opzione selezionata
 * @param {function} onChange    Funzione che gestisce il salvataggio del dato
 *
 * @returns
 */
const SelectInput = ({
	disabled,
	searchFor,
	id,
	fixedW,
	value,
	onChange,
	required = false,
	isForSearch = false,
}) => {
	const { showAlert } = useAlert();
	const fixed_width = fixedW && "w-full";
	const _CMNSTYLE_SELECT = `rounded-md ${fixed_width} text-black border-2 border-gray-300 p-1`;

	// Risposta ottenuta dal server
	const [content, setContent] = useState([]);

	const fetchData = async () => {
		try {
			const data = await fetchDataSingleElements(searchFor);
			if (data !== null) setContent(data);
		} catch (error) {
			console.error("Error fetching data:", error);
			showAlert({
				title: "Errore fetching data",
				message: `Errore: ${error}`,
				type: "error",
				onConfirm: () => window.location.reload(),
			});
		}
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<select
			disabled={disabled}
			id={id}
			data-testid={id}
			className={_CMNSTYLE_SELECT}
			value={value}
			onChange={onChange}
			required={required}
		>
			{(isForSearch || searchFor === "plastic") && (
				<option value={""}>-</option>
			)}

			{/* Iterate the content data */}
			{content?.map((_m, _i) => {
				if (typeof _m === "object" && _m !== null) {
					// Variabili locali
					let code = "";
					let data = "";
					let str = "";
					let tmp = "";

					// Controllo per impostare componente <option> correttamente:
					// <option value={id}>name</option>
					Object.keys(_m).map((key) => {
						code += key === "code" || key === "id" ? _m[key] : "";
						data = key === "desc" ? _m[key] : "";
						tmp =
							key === "desc"
								? `(${_m[key]})`
								: key !== "plastic_type" && key !== "id"
									? _m[key]
									: "";
						str += `${tmp} `;
					});

					return (
						<option
							key={`option-${Math.random()}`}
							value={code}
							data-code={data}
						>
							{str}
						</option>
					);
				} else {
					return (
						<option key={_m[_i]} value={_m}>
							{_m}
						</option>
					);
				}
			})}
		</select>
	);
};

SelectInput.propTypes = {
	disabled: PropTypes.bool,
	searchFor: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	fixedW: PropTypes.bool,
	value: PropTypes.any,
	onChange: PropTypes.func,
	required: PropTypes.bool,
	isForSearch: PropTypes.bool,
};

export default React.memo(SelectInput);
