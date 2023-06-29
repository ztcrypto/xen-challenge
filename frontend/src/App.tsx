import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import InvoiceTable from './components/InvoiceTable';
import { v4 as uuidv4 } from 'uuid';

interface Borrower {
  id: number;
  name: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: string;
  borrower: Borrower;
}

function App() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchBorrowers();
    fetchInvoices();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const response = await axios.get('/api/borrowers/index');
      setBorrowers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices/index');
      setInvoices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prevInvoices => [...prevInvoices, invoice]);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prevInvoices => prevInvoices.map(invoice => invoice.id === updatedInvoice.id ? updatedInvoice : invoice));
  };

  const deleteInvoice = (deletedInvoice: Invoice) => {
    setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== deletedInvoice.id));
  };

  const onSubmit = async (data: any) => {
    try {
      const randomUUID = uuidv4().replace(/-/g, '');
      const response = await axios.post('/api/invoices/create', {
        invoice_number: randomUUID,
        amount: data.amount,
        due_date: data.due,
        borrower_id: data.borrower,
      });
      console.log(response.data);
      const createdInvoice: Invoice = response.data;
      addInvoice(createdInvoice);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = async (invoice: Invoice) => {
    try {
      const response = await axios.post('/api/invoices/next', {
        invoice_id: invoice.id,
      });
      console.log(response.data);
      const updatedInvoice: Invoice = response.data;
      updateInvoice(updatedInvoice);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    try {
      const response = await axios.delete('/api/invoices/delete', {
        data: { invoice_id: invoice.id },
      });
      console.log(response.data);
      deleteInvoice(invoice);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="amount" {...register('amount', { required: true, min: 1 })} />
          {errors.amount && <span>Amount is required and must be a positive number</span>}
          <input data-testid="due" {...register('due', { required: true })} type="date" />
          {errors.due && <span>Due date is required</span>}
          <select {...register('borrower', { required: true })}>
            <option value="" />
            {borrowers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.borrower && <span>Borrower is required</span>}
          <button type="submit">create</button>
        </form>
        <InvoiceTable invoices={invoices} onNextClick={handleNext} onDeleteClick={handleDelete} />
      </div>
    </>
  );
}

export default App;