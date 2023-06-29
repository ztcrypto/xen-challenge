import App from './App'
import { render, screen, waitFor, fireEvent } from './utils/test-utils'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Simple working test', () => {
  let mockAxios: any;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  afterAll(() => {
    mockAxios.restore();
  });

  it('should fetch borrowers and invoices on component mount', async () => {
    const mockBorrowers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    const mockInvoices = [
      { id: 1, invoice_number: 'INV-001', amount: 100, due_date: '2023-07-01', status: 'created', borrower: { id: 1, name: 'John Doe' } },
      { id: 2, invoice_number: 'INV-002', amount: 200, due_date: '2023-07-02', status: 'approved', borrower: { id: 2, name: 'Jane Smith' } },
    ];

    mockAxios.onGet('/api/borrowers/index').reply(200, mockBorrowers);
    mockAxios.onGet('/api/invoices/index').reply(200, mockInvoices);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('John Doe', { selector: 'option' })).toBeInTheDocument();
      expect(screen.getByText('Jane Smith', { selector: 'option' })).toBeInTheDocument();
      expect(screen.getByText('INV-001')).toBeInTheDocument();
      expect(screen.getByText('INV-002')).toBeInTheDocument();
    });
  });

  it('should add a new invoice on form submission', async () => {
    const mockBorrowers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    const mockInvoice = { id: 3, invoice_number: 'INV-003', amount: 300, due_date: '2023-07-03', status: 'created', borrower: { id: 1, name: 'John Doe' } };

    mockAxios.onGet('/api/borrowers/index').reply(200, mockBorrowers);
    mockAxios.onGet('/api/invoices/index').reply(200, [mockInvoice]);
    mockAxios.onPost('/api/invoices/create').reply(200, mockInvoice);

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('amount'), { target: { value: '300' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('due'), { target: { value: '2023-07-03' } });

    fireEvent.click(screen.getByText('create'));

    await waitFor(() => {
      expect(screen.getByText('INV-003')).toBeInTheDocument();
    });
  });

  it('should update an invoice on "Purchase" button click', async () => {
    const mockBorrowers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    const mockInvoice = { id: 1, invoice_number: 'INV-001', amount: 100, due_date: '2023-07-01', status: 'approved', borrower: { id: 1, name: 'John Doe' } };

    mockAxios.onGet('/api/borrowers/index').reply(200, mockBorrowers);
    mockAxios.onGet('/api/invoices/index').reply(200, [mockInvoice]);
    mockAxios.onPost('/api/invoices/next').reply(200, mockInvoice);

    render(<App />);

    await waitFor(() => fireEvent.click(screen.getByText('Purchase')));

    await waitFor(() => {
      expect(screen.getByText('approved')).toBeInTheDocument();
    });
  });

  it('should delete an invoice on "Delete" button click', async () => {
    const mockBorrowers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    const mockInvoice = { id: 1, invoice_number: 'INV-001', amount: 100, due_date: '2023-07-01', status: 'created', borrower: { id: 1, name: 'John Doe' } };

    mockAxios.onGet('/api/borrowers/index').reply(200, mockBorrowers);
    mockAxios.onGet('/api/invoices/index').reply(200, [mockInvoice]);
    mockAxios.onDelete('/api/invoices/delete').reply(200, {});

    render(<App />);

    await waitFor(() => fireEvent.click(screen.getByText('Delete')));

    await waitFor(() => {
      expect(screen.queryByText('INV-001')).not.toBeInTheDocument();
    });
  });
})