/* eslint-env jest */
import { act, fireEvent, render, screen } from '@testing-library/react';
import BtnReportFiltered from '@admin/buttons/btn-report-filtered';
import { formattedDateTime } from '@config';
import userEvent from '@testing-library/user-event';

const mockImplantsData = [
    { id: 1, name: 'Impianto A' },
    { id: 2, name: 'Impianto B' },
    { id: 3, name: 'Impianto C' },
];

jest.mock('exceljs');
jest.mock('file-saver');
jest.mock('@config', () => ({
    fetchReportDataFiltered: jest.fn((params) => {
        if (params.reportFor === 'impianto-a') {
            if (params.options.startDate === '2025-07-31T06:00') {
                return Promise.resolve([{
                    0: {plastic: 'PLASMIX TL', code: '27213', weight: 520, data_ins: '2025-07-31T06:11:15.000Z'},
                    1: {plastic: 'PLASMIX TL', code: '27213', weight: 592, data_ins: '2025-07-31T06:11:20.000Z'},
                    2: {plastic: 'PLASMIX TL', code: '27213', weight: 535, data_ins: '2025-07-31T06:11:49.000Z'},
                    3: {plastic: 'PLASMIX TL', code: '27213', weight: 560, data_ins: '2025-07-31T06:11:55.000Z'},
                    4: {plastic: 'PLASMIX TL', code: '27213', weight: 528, data_ins: '2025-07-31T07:15:21.000Z'},
                }]);
            }
        } else {
            return Promise.resolve([])
        }
    }),
    formattedDateTime: jest.fn((date) => {
        const now = new Date(date);
        now.setDate(now.getDate() - 1); // Imposta la data al giorno precedente
        return now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + 'T' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');
    })
}));

jest.mock('@alert/alertProvider', () => ({
    useAlert: () => ({
        showAlert: jest.fn()
    })
}));

jest.mock('@fetch', () => ({
    fetchDataSingleElements: jest.fn(() => {
        return Promise.resolve(mockImplantsData);
    })
}));

describe('BtnReportFiltered Component', () => {

    var today06 = new Date();
    var today22 = new Date();
    today06.setHours(6, 0, 0, 0);
    today22.setHours(22, 0, 0, 0);
    today06 = formattedDateTime(today06);
    today22 = formattedDateTime(today22); 

    it('Render <BtnReportFiltered />', () => {
        render(<BtnReportFiltered />);
        expect(screen.getByText('PERIODO')).toBeInTheDocument();
        expect(screen.getByText('IMPIANTO')).toBeInTheDocument();
        expect(screen.getByText('GENERA REPORT')).toBeInTheDocument();
        expect(screen.getByDisplayValue(today06)).toBeInTheDocument();
        expect(screen.getByDisplayValue(today22)).toBeInTheDocument();
    });

    it('Check update of date inputs', async () => {
        await act(async () => {
            render(<BtnReportFiltered />);
        })

        const user = userEvent.setup();

        const startDateInput = screen.getByDisplayValue(today06); // data inizio
        const endDateInput = screen.getByDisplayValue(today22); // data fine
        const selectImplant = screen.getByTestId('search-input-implants');
        const testDate1 = '2025-07-31T01:00';
        const testDate2 = '2025-07-31T14:00';

        fireEvent.change(startDateInput, { target: { value: testDate1 } });
        fireEvent.change(endDateInput, { target: { value: testDate2 } });

        expect(startDateInput.value).toBe(testDate1);
        expect(endDateInput.value).toBe(testDate2);

        screen.debug(selectImplant); // Debug per vedere lo stato del DOM

        await act(async () => {
            // fireEvent.change(selectImplant, { target: { value: '1' } }); // Seleziona un impianto valido
            await user.selectOptions(selectImplant, '1');
        });
        expect(selectImplant).toHaveValue('1');
    });
});