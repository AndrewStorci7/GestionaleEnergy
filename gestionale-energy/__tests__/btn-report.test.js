import { render, screen, fireEvent } from "@testing-library/react";
import BtnReport from "@@/components/main/admin/btn-report";

jest.mock('exceljs');
jest.mock('file-saver');
jest.mock('@config', () => ({
  fetchReportData: jest.fn(() => Promise.resolve([]))
}));

jest.mock('@@/components/main/alert/alertProvider', () => ({
  useAlert: () => ({
    showAlert: jest.fn()
  })
}));

jest.mock('@@/components/main/admin/export-report', () => {
    return jest.fn(({ children, date, reportFor, className, disabled }) => (
        <button 
            data-testid={`export-${reportFor}`}
            data-date={date}
            className={className}
            disabled={disabled}
            onClick={() => {}}
        >
            {children}
        </button>
    ));
});

jest.mock('@@/components/main/get-icon', () => ({
    __esModule: true,
    default: jest.fn(({ type, className }) => (
        <span className={className} data-testid={`icon-${type}`}>Icon</span>
    )),
}));

describe('BtnReport Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<BtnReport />);
        const dateInput = screen.getByLabelText(/date/i);

        expect(dateInput).toBeInTheDocument();

        // Controlla presenza di tutti i testi dei pulsanti
        expect(screen.getByTestId("export-impianto-a")).toBeInTheDocument();
        expect(screen.getByTestId("export-impianto-a-tempi")).toBeInTheDocument();
        expect(screen.getByTestId("export-impianto-b")).toBeInTheDocument();
        expect(screen.getByTestId("export-impianto-b-tempi")).toBeInTheDocument();
        expect(screen.getByTestId("export-impianto-ab")).toBeInTheDocument();
        expect(screen.getByTestId("export-impianto-ab-tempi")).toBeInTheDocument();
        
        // Check if the info text and icon are rendered
        expect(screen.getByTestId('icon-info')).toBeInTheDocument();
        expect(screen.getByText(/I report giornalieri fanno riferimento alla data selezionata/i)).toBeInTheDocument();
    });

    it('updates the date state and passes it to ExportReport components', () => {
        render(<BtnReport />);
        const testDate = '2023-10-05';
        const dateInput = screen.getByLabelText(/date/i);

        fireEvent.change(dateInput, { target: { value: testDate } });

        // Verify input value updated
        expect(dateInput.value).toBe(testDate);

        // Verify date is passed to all ExportReport components
        const reports = [
            'impianto-a',
            'impianto-a-tempi',
            'impianto-b',
            'impianto-b-tempi',
            'impianto-ab',
            'impianto-ab-tempi'
        ];

        reports.forEach(reportFor => {
            expect(screen.getByTestId(`export-${reportFor}`)).toHaveAttribute('data-date', testDate);
        });
    });

    // it('show alerts when date is null', () => {
    //     const { showAlert } = require('@@/components/main/alert/alertProvider').useAlert();
    //     render(
    //         <BtnReport reportFor="impianto-a" />
    //     );

    //     // Simulate clicking the export button without setting a date
    //     fireEvent.click(screen.getByTestId('export-impianto-a'));

    //     // Verify alert was shown
    //     expect(showAlert).toHaveBeenCalledWith({
    //         title: null,
    //         message: "Devi selezionare una data"
    //     });
    // });

    it('passes correct disabled prop to tempo reports', () => {
        render(<BtnReport />);
        
        // Regular reports should not be disabled
        expect(screen.getByTestId('export-impianto-a')).not.toBeDisabled();
        expect(screen.getByTestId('export-impianto-b')).not.toBeDisabled();
        expect(screen.getByTestId('export-impianto-ab')).not.toBeDisabled();

        // Tempo reports should be disabled
        expect(screen.getByTestId('export-impianto-a-tempi')).toBeDisabled();
        expect(screen.getByTestId('export-impianto-b-tempi')).toBeDisabled();
        expect(screen.getByTestId('export-impianto-ab-tempi')).toBeDisabled();
    });
});