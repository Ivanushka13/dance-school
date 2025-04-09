import React, { useState } from 'react';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    studentId: '1001',
    typeId: '1',
    amount: 5000,
    date: '2024-03-20',
    description: 'Оплата абонемента',
    deactivated: false
  },
  { 
    id: 2,
    studentId: '1002',
    typeId: '2',
    amount: 7000,
    date: '2024-03-21',
    description: 'Оплата индивидуальных занятий',
    deactivated: true
  },
  { 
    id: 3,
    studentId: '1003',
    typeId: '1',
    amount: 9000,
    date: '2024-03-22',
    description: 'Оплата премиум абонемента',
    deactivated: false
  }
];

const PaymentsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [payments, setPayments] = useState(initialRows);

  const columns = [
    {
      field: 'id',
      headerName: 'Идентификатор',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'studentId',
      headerName: 'ID Студента',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'typeId',
      headerName: 'Тип оплаты',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'amount',
      headerName: 'Сумма',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number',
      valueFormatter: (params) => `${params.value} ₽`
    },
    {
      field: 'date',
      headerName: 'Дата',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'description',
      headerName: 'Описание',
      width: 300,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'deactivated',
      headerName: 'Деактивирован',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'boolean',
      renderCell: (params) => (
        <div className={`status-cell ${params.value ? 'deactivated' : 'active'}`}>
          {params.value ? (
            <>
              <CancelIcon className="status-icon" />
              <span>Да</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="status-icon" />
              <span>Нет</span>
            </>
          )}
        </div>
      ),
    }
  ];

  const fields = [
    {
      name: 'id',
      label: 'Идентификатор',
      type: 'text',
      required: true
    },
    {
      name: 'studentId',
      label: 'ID Студента',
      type: 'text',
      required: true
    },
    {
      name: 'typeId',
      label: 'Тип оплаты',
      type: 'text',
      required: true
    },
    {
      name: 'amount',
      label: 'Сумма',
      type: 'text',
      required: true
    },
    {
      name: 'date',
      label: 'Дата',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'text',
      required: true
    },
    {
      name: 'deactivated',
      label: 'Деактивирован',
      type: 'switch',
      required: false
    }
  ];

  const handleAdd = (formData) => {
    const newPayment = {
      id: parseInt(formData.id),
      studentId: formData.studentId,
      typeId: formData.typeId,
      amount: parseInt(formData.amount),
      date: formData.date,
      description: formData.description,
      deactivated: formData.deactivated || false
    };
    setPayments(prev => [...prev, newPayment]);
    setShowAddForm(false);
  };

  const handleDelete = (payment) => {
    setPayments(prev => prev.filter(p => p.id !== payment.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить платеж"
        Icon={PaymentIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Платежи"
      Icon={PaymentIcon}
      columns={columns}
      rows={payments}
      addButtonText="Добавить платеж"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default PaymentsList; 