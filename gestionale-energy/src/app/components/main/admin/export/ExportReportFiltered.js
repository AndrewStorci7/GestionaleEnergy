import { fetchReportDataFiltered } from "@config";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 *
 * @param {*} ws
 * @param {*} cell
 * @param {*} value
 * @param {*} alignment
 * @param {*} font
 */
const setCell = (
	ws,
	cell,
	value = null,
	alignment = {
		vertical: "middle",
		horizontal: "center",
	},
	font = null,
) => {
	if (value) {
		ws.getCell(cell).value = value;
	}
	ws.getCell(cell).alignment = alignment;
	if (font) ws.getCell(cell).font = font;
};

/**
 *
 * @param {*} range
 */
const applyBorders = (ws, range) => {
	for (let row = range.start; row <= range.end; ++row) {
		ws.getCell(`${range.col}${row}`).border = {
			top: { style: "thin" },
			left: { style: "thin" },
			bottom: { style: "thin" },
			right: { style: "thin" },
		};
	}
};

/**
 *
 * @param {string} reportFor
 * @param {object} options Object containing the filter's options
 * @param {function} showAlert Function to show alerts
 * @returns
 */
const reportFiltered = async (reportFor, options, showAlert) => {
	var char = "A";

	try {
		if (options?.startDate && options.endDate) {
			if (options.startDate > options.endDate) {
				showAlert({
					type: "error",
					title: "Errore nelle date",
					message:
						"La data di inizio non può essere successiva alla data di fine.",
				});
				return;
			}
		} else {
			showAlert({
				type: "error",
				title: "Errore nelle date",
				message: "Date non valide.",
			});
			return;
		}

		const data = await fetchReportDataFiltered(reportFor, options);
		const fileString = `${options.startDate}_${options.endDate}`;

		if (!data) {
			showAlert({
				type: "info",
				title: "Nessun dato trovato",
				message: "Nessun dato trovato per il report Corepla.",
			});
			return;
		}

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("REPORT");

		worksheet.columns = [
			{ header: "PLASTICA", key: "plastic_name", width: 20 },
			{ header: "CODICE", key: "code_plastic", width: 10 },
			{ header: "PESO", key: "weight", width: 15 },
			{ header: "DATA E ORA", key: "datetime", width: 30 },
		];

		for (let i = 0; i < 4; ++i) {
			setCell(worksheet, `${char}${i}`);
			char = String.fromCharCode(char.charCodeAt(0) + 1);
		}

		data.forEach((row) => {
			worksheet.addRow({
				plastic_name: row.plastic,
				code_plastic: row.code,
				weight: row.weight,
				datetime: new Date(row.data_ins).toLocaleString("it-IT", {
					timeZone: "UTC",
				}),
			});
		});

		applyBorders(worksheet, {
			start: 1,
			end: worksheet.rowCount,
			col: "A",
		});
		applyBorders(worksheet, {
			start: 1,
			end: worksheet.rowCount,
			col: "B",
		});
		applyBorders(worksheet, {
			start: 1,
			end: worksheet.rowCount,
			col: "C",
		});
		applyBorders(worksheet, {
			start: 1,
			end: worksheet.rowCount,
			col: "D",
		});

		workbook.xlsx.writeBuffer().then((buffer) => {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			saveAs(blob, `REPORT_${fileString}.xlsx`);
		});
	} catch (error) {
		console.error(
			"Errore durante il fetch dei dati per il report Corepla:",
			error,
		);
	}
};

export { setCell, applyBorders, reportFiltered };
