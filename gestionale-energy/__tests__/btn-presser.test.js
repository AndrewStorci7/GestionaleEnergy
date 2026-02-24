// biome-ignore-all lint: reason

import BtnPresser from "@/app/components/main/buttons/BtnPresser";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/image", () => ({
	__esModule: true,
	default: (props) => <img {...props} />,
}));

const mockShowAlert = jest.fn();

jest.mock("@main/alert/alertProvider", () => ({
	useAlert: () => ({
		showAlert: mockShowAlert,
	}),
}));

describe("Componente BtnPresser", () => {
	beforeEach(() => {
		mockShowAlert.mockClear();
	});

	// dati di base fittizi, magari provare anche con dait veri
	const mockProps = {
		baleObj: {
			idBale: null,
			setIdBale: jest.fn(),
			idUnique: 0,
		},
		clickAddHandle: jest.fn(),
		handleConfirmAdd: false,
	};

	test("Renderizza correttamente i tre bottoni", () => {
		render(<BtnPresser {...mockProps} />);

		expect(screen.getByTestId("delete")).toBeInTheDocument();
		expect(screen.getByTestId("update")).toBeInTheDocument();
		expect(screen.getByTestId("add")).toBeInTheDocument();
	});

	test("Click su Aggiungi: deve chiamare la funzione clickAddHandle", () => {
		render(<BtnPresser {...mockProps} />);

		const addBtn = screen.getByTestId("add");

		fireEvent.click(addBtn);
		expect(mockProps.clickAddHandle).toHaveBeenCalled();
		// expect(screen.getByText('Annulla')).toBeInTheDocument();
	});

	test("Click su Elimina SENZA aver selezionato una balla: mostra errore", () => {
		const propsNoBale = { ...mockProps, baleObj: { idBale: null } };
		render(<BtnPresser {...propsNoBale} />);

		fireEvent.click(screen.getByTestId("delete"));
		expect(mockShowAlert).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "error",
				// message: "Nessuna balla selezionata!"
			}),
		);
	});

	test("Click su Elimina CON una balla selezionata: mostra conferma", () => {
		const propsWithBale = {
			...mockProps,
			baleObj: { idBale: 123, idUnique: 99 },
		};
		render(<BtnPresser {...propsWithBale} />);

		fireEvent.click(screen.getByTestId("delete"));
		expect(mockShowAlert).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "delete",
				message: expect.stringContaining("99"),
			}),
		);
	});
});
