import React, { useState } from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    name: 'Оплата абонемента',
    deactivated: false
  },
  { 
    id: 2,
    name: 'Возврат средств',
    deactivated: false
  },
  { 
    id: 3,
    name: 'Оплата разового занятия',
    deactivated: false
  }
];

const PaymentTypesList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState(initialRows);

  const columns = [
    {
      field: 'id',
      headerName: 'Идентификатор',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'name',
      headerName: 'Название',
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
      name: 'name',
      label: 'Название',
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
    const newPaymentType = {
      id: parseInt(formData.id),
      name: formData.name,
      deactivated: formData.deactivated || false
    };
    setPaymentTypes(prev => [...prev, newPaymentType]);
    setShowAddForm(false);
  };

  const handleDelete = (paymentType) => {
    setPaymentTypes(prev => prev.filter(pt => pt.id !== paymentType.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить тип платежа"
        Icon={CategoryIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Типы платежей"
      Icon={CategoryIcon}
      columns={columns}
      rows={paymentTypes}
      addButtonText="Добавить тип платежа"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default PaymentTypesList; 