/* eslint-env jest */
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Alert from '@main/alert/alert';
import { AlertProvider, useAlert } from '@main/alert/alertProvider';
import { useWebSocket } from '@main/ws/use-web-socket';

// Mock dependencies
jest.mock('react-draggable', () => ({ children }) => <div>{children}</div>);
jest.mock('@main/get-icon');
jest.mock('@main/update-bale');
// jest.mock('@main/fetch', () => ({
//     handleDelete: jest.fn(),
//     handleStampa: jest.fn()
// }));
jest.mock('@main/fetch');
jest.mock('@main/ws/use-web-socket');
jest.mock('@config');

// jest.mock('@main/alert/alertProvider', () => ({
//     useAlert: () => ({
//         showAlert: jest.fn(),
//         hideAlert: mockHideAlert
//     })
// }));

describe('Alert Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        useWebSocket.mockReturnValue({ ws: mockWs });
        require('@config').refreshPage.mockImplementation(mockRefreshPage);
    });

    const mockHideAlert = jest.fn();
    const mockRefreshPage = jest.fn();
    const mockWs = { send: jest.fn() };

    const renderAlert = (props) => {
        return render(
            <AlertProvider>
                <Alert {...props} />
            </AlertProvider>
        );
    };

    it('renders error alert correctly', () => {
        renderAlert({
            title: "Test Error",
            msg: "Something went wrong",
            alertFor: "error",
            onHide: mockHideAlert
        });

        expect(screen.getByText('Test Error')).toBeInTheDocument();
        expect(screen.getByText('Errore: Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Chiudi')).toBeInTheDocument();
    });

    it('renders confirmation alert correctly', () => {
        renderAlert({
            title: "Confirm Action",
            msg: "Are you sure?",
            alertFor: "confirm",
            data: { idUnique: '123' },
            onHide: mockHideAlert
        });

        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Conferma')).toBeInTheDocument();
        expect(screen.getByText('Annulla')).toBeInTheDocument();
    });

    it('calls onHide when close button is clicked', () => {
        renderAlert({
            title: "Test Alert",
            msg: "Test message",
            alertFor: "error",
            onHide: mockHideAlert
        });

        fireEvent.click(screen.getByText('Chiudi'));
        expect(mockHideAlert).toHaveBeenCalled();
    });

    it('handles delete confirmation', async () => {
        const mockHandleDelete = require('@main/fetch').handleDelete;
        mockHandleDelete.mockResolvedValue(true);

        renderAlert({
            msg: "Delete this item?",
            alertFor: "delete",
            data: { idUnique: '123' },
            onHide: mockHideAlert
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Si'));
        });

        expect(mockHandleDelete).toHaveBeenCalledWith('123', expect.any(Function));
        expect(mockRefreshPage).toHaveBeenCalled();
    });

    it('handles print confirmation', async () => {
        const mockHandleStampa = require('@main/fetch').handleStampa;
        mockHandleStampa.mockResolvedValue(true);
        // const mockHandleStampa = require('@main/fetch').handleStampa;
        // mockHandleStampa.mockImplementation((data, hideFn, showFn) => {
        //     expect(data).toEqual({ id: '123' });
        //     expect(hideFn).toBe(mockHideAlert); // Direct reference check
        //     expect(typeof showFn).toBe('function');
        //     return Promise.resolve(true);
        // });

        renderAlert({
            title: "Print",
            msg: "Print this item?",
            alertFor: "confirm",
            data: { id: '123' },
            onHide: mockHideAlert
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Conferma'));
        });

        // Get the most recent call
        const [dataArg, hideFn, showFn] = mockHandleStampa.mock.calls[0];
        
        expect(dataArg).toEqual({ id: '123' });
        expect(typeof hideFn).toBe('function');
        expect(typeof showFn).toBe('function');
        
        // Verify the hide function works by calling it
        await act(async () => {
            await hideFn();
            await expect(mockHideAlert).toHaveBeenCalled();
        });

        // expect(mockHandleStampa).toHaveBeenCalledWith(
        //     { id: '123' },
        //     mockHideAlert,
        //     expect.any(Function)
        // );
        // Check the last call's arguments directly
        // expect(mockHandleStampa).toHaveBeenCalled();
    });

    // it('handles print confirmation', async () => {
    //     // handleStampa.mockResolvedValue(true);

    //     renderAlert({
    //         title: "Print",
    //         msg: "Print this item?",
    //         alertFor: "confirm",
    //         data: { id: '123' },
    //         onHide: mockHideAlert
    //     });

    //     await act(async () => {
    //         fireEvent.click(screen.getByText('Conferma'));
    //     });

    //     // Controllo che la funzione sia stata chiamata
    //     expect(handleStampa).toHaveBeenCalled();

    //     // Ora posso fare destructuring in sicurezza
    //     const [dataArg, hideFn, showFn] = handleStampa.mock.calls[0];

    //     expect(dataArg).toEqual({ id: '123' });
    //     expect(typeof hideFn).toBe('function');
    //     expect(typeof showFn).toBe('function');

    //     await act(async () => {
    //         await hideFn();
    //         expect(mockHideAlert).toHaveBeenCalled();
    //     });
    // });

    it('renders update form for presser', () => {
        const mockUpdateValuesBale = require('@main/update-bale').default;
        mockUpdateValuesBale.mockImplementation(() => <div>Update Form</div>);

        renderAlert({
            title: "Update Bale",
            alertFor: "update-p",
            data: { id: '123' },
            onHide: mockHideAlert
        });

        expect(screen.getByText('Update Form')).toBeInTheDocument();
        // expect(mockUpdateValuesBale).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         type: "presser",
        //         objBale: { id: '123' },
        //         handlerClose: mockHideAlert
        //     }),
        //     expect.anything()
        // );
        const lastCallArgs = mockUpdateValuesBale.mock.calls[mockUpdateValuesBale.mock.calls.length - 1][0];
        
        expect(lastCallArgs.type).toBe("presser");
        expect(lastCallArgs.objBale).toEqual({ id: '123' });
        expect(typeof lastCallArgs.handlerClose).toBe('function');
        
        // Verify the function works by calling it
        act(() => {
            expect(() => lastCallArgs.handlerClose()).not.toThrow();
        });
    });
});

describe('AlertProvider', () => {
    it('provides alert context to children', () => {
        const TestComponent = () => {
            const { showAlert } = useAlert();
            return <button onClick={() => showAlert({ title: 'Test' })}>Show Alert</button>;
        };

        render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        );

        expect(screen.getByText('Show Alert')).toBeInTheDocument();
    });

    it('shows and hides alerts', async () => {
        const TestComponent = () => {
            const { showAlert, hideAlert } = useAlert();
            return (
                <div>
                    <button 
                        onClick={() => showAlert({ 
                            title: 'Test', 
                            message: 'Message',
                            type: 'error'
                        })}
                        data-testid="show-alert"
                    >
                        Show
                    </button>
                    <button 
                        onClick={hideAlert}
                        data-testid="hide-alert"
                    >
                        Hide
                    </button>
                </div>
            );
        };

        render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        );

        expect(screen.queryByText('Test')).not.toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByTestId('show-alert'));
        });
        expect(await screen.findByText('Test')).toBeInTheDocument();
        // expect(screen.getByText('Test Message')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByTestId('hide-alert'));
        });

        await waitFor(() => {
            expect(screen.queryByText('Test')).not.toBeInTheDocument();
        });
    });

    it('throws error when used outside provider', () => {
        const TestComponent = () => {
            try {
                useAlert();
            } catch (e) {
                return <div>{e.message}</div>;
            }
            return null;
        };

        render(<TestComponent />);
        expect(screen.getByText('useAlert must be used within an AlertProvider')).toBeInTheDocument();
    });
});