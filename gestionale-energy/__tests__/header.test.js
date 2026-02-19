/* eslint-env jest */
import { act, render, screen, fireEvent } from "@testing-library/react";
import Header from "@header/header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Mocks
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("js-cookie", () => ({
    remove: jest.fn(),
    get: jest.fn(() => JSON.stringify({ id_implant: "impianto-123" })),
}));

jest.mock("@main/ws/use-web-socket", () => ({
    useWebSocket: () => ({ message: "test message" }),
}));

jest.mock("@main/loader/loaderProvider", () => ({
    useLoader: () => ({
        showLoader: jest.fn()
    })
}));

jest.mock("@main/alert/alertProvider", () => ({
    useAlert: () => ({
        showAlert: jest.fn(),
        hideAlert: jest.fn()
    })
}))

global.fetch = jest.fn((url) =>
    Promise.resolve({
        ok: true,
        json: async () => {
            if (url.includes("totale-chili")) {
                return { message: { totale_chili: 1234 } };
            }
            return { code: 0, message: 12, message2: 8 };
        },
    })
);

describe("Header component", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue({ push: mockPush });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calls logout on button click", async () => {
        await act(async () => {
            render(<Header implant="impianto-123" username="Mario" type="presser" />);
        });

        const logoutButton = screen.getByRole("button");
        fireEvent.click(logoutButton);

        expect(Cookies.remove).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/pages/login");
    });
});