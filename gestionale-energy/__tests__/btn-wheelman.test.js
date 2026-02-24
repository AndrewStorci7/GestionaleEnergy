// biome-ignore-all lint: reason

import BtnWheelman from "@/app/components/main/buttons/BtnWheelman";
import { render, screen } from "@testing-library/react";
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

describe("Componente BtnWheelman", () => {
	beforeEach(() => {
		mockShowAlert.mockClear();
	});

	const mockProps = {
		baleObj: {
			idBale: null,
			setIdBale: jest.fn(),
			idUnique: 0,
		},
	};

	test("Renderizza correttamente i bottoni", () => {
		render(<BtnWheelman {...mockProps} />);

		expect(screen.getByTestId("update")).toBeInTheDocument();
		expect(screen.getByTestId("print")).toBeInTheDocument();
	});

	test("Click su Modifica: deve chiamare la funzione handleClick", () => {
		render(<BtnWheelman {...mockProps} />);

		const _updateBtn = screen.getByTestId("");
	});
});
