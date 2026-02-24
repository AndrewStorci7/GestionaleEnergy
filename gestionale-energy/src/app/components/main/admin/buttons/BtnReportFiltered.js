"use client";

import { reportFiltered } from "@/app/components/main/admin/export/ExportReportFiltered";
import { useAlert } from "@/app/components/main/alert/AlertProvider";
import { formattedDateTime } from "@config";
import SelectInput from "@/app/components/main/search/Select";
import { useState } from "react";

// import PropTypes from 'prop-types'; // per ESLint

const BtnReportFiltered = (
	// reportFor,
) => {
	// date di default:
	// siccome in generale questo report verra' richiesot da COREPLA, la data e l'orario di default saranno impostati a 6:00 e 22:00 del giorno prima
	var today06 = new Date();
	var today22 = new Date();
	today06.setHours(6, 0, 0, 0);
	today22.setHours(22, 0, 0, 0);
	today06 = formattedDateTime(today06);
	today22 = formattedDateTime(today22);

	const [startDate, setStartDate] = useState(today06);
	const [endDate, setEndDate] = useState(today22);
	const [implant, setImplant] = useState(0);
	// const [plastic, setPlastic] = useState("");

	const { showAlert } = useAlert();

	const handleClick = () => {
		if (!implant || implant <= 0) {
			showAlert({
				title: "Devi selezionare un impianto",
				type: "error",
				message: "Seleziona un impianto",
			});
			return;
		}

		reportFiltered(implant, { startDate, endDate }, showAlert);
	};

	return (
		<>
			<p className="ml-3 mb-1.5 font-bold">PERIODO</p>
			<input
				className="border-2 border-gray-300 p-1 mb-1.5 rounded-md"
				type="datetime-local"
				name="inizio"
				defaultValue={startDate}
				onChange={(e) => setStartDate(e.target.value)}
			/>
			<input
				className="border-2 border-gray-300 p-1 mb-1.5 rounded-md"
				type="datetime-local"
				name="fine"
				defaultValue={endDate}
				min={startDate}
				onChange={(e) => setEndDate(e.target.value)}
			/>
			<p className="ml-3 mb-1.5 font-bold">IMPIANTO</p>
			<SelectInput
				id="search-input-implants"
				searchFor={"implants"}
				onChange={(e) => setImplant(parseInt(e.target.value, 10))}
				isForSearch
				required
			/>
			<p></p>
			<p className="ml-3 mb-1.5 font-bold">TIPO PLASTICA</p>
			<SelectInput
				id="search-input-plastic"
				searchFor={"plastic"}
				// onChange={(e) => setPlastic(e.target.value)}
				onChange={() => {}}
				isForSearch
			/>
			<p></p>
			<p></p>
			<button
				type="button"
				className="text-black font-semibold bg-sky-50 rounded-full text-sm px-2 py-2 text-center me-2 mt-3 mb-3.5 transition-all hover:bg-sky-700 hover:text-white"
				onClick={handleClick}
			>
				GENERA REPORT
			</button>
		</>
	);
};

// BtnReportFiltered.propTypes = {
//     reportFor: PropTypes.string.isRequired,
// };

export default BtnReportFiltered;
