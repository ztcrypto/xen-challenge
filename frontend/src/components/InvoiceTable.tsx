import React from 'react';
import { useTable, usePagination, Column, CellProps, Row, TableInstance, TableState } from 'react-table';

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

interface InvoiceTableProps {
  invoices: Invoice[];
  onNextClick: (invoice: Invoice) => void;
  onDeleteClick: (invoice: Invoice) => void;
}

function InvoiceTable({ invoices, onNextClick, onDeleteClick }: InvoiceTableProps) {

  const getButtonText = (status: string) => {
    if (status === 'created') return 'Approve';
    if (status === 'approved') return 'Purchase';
    if (status === 'purchased') return 'Close';
    return '';
  };
  
  const columns: Column<Invoice>[] = React.useMemo(
    () => [
      { Header: 'Invoice #', accessor: 'invoice_number' },
      { Header: 'Amount', accessor: 'amount' },
      { Header: 'Due Date', accessor: 'due_date' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Borrower', accessor: (row: Invoice) => row.borrower.name },
      {
        Header: 'Action',
        Cell: ({ row }: CellProps<Invoice>) => (
          <>
            {row.original.status !== 'rejected' && row.original.status !== 'closed' && (
              <button onClick={() => onNextClick(row.original)}>{getButtonText(row.original.status)}</button>
            )}
            <button onClick={() => onDeleteClick(row.original)}>Delete</button>
          </>
        ),
      },
    ],
    [onNextClick, onDeleteClick]
  );

  const data = React.useMemo(() => invoices, [invoices]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable<Invoice>({ columns, data, initialState: { pageIndex: 0, pageSize: 10 } as Partial<TableState<Invoice>> }, usePagination) as TableInstance<Invoice> & {
      state: TableState<Invoice>;
    };

  return (
    <>
      <table {...getTableProps()} className="invoice_table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: Row<Invoice>) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={previousPage} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button onClick={nextPage} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </>
  );
}

export default InvoiceTable;