import React, { useState } from 'react';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    studentId: '1001',
    typeId: '1',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    remainingLessons: 8,
    deactivated: false
  },
  { 
    id: 2,
    studentId: '1002',
    typeId: '2',
    startDate: '2024-03-15',
    endDate: '2024-04-14',
    remainingLessons: 12,
    deactivated: true
  },
  { 
    id: 3,
    studentId: '1003',
    typeId: '3',
    startDate: '2024-03-20',
    endDate: '2024-04-19',
    remainingLessons: 16,
    deactivated: false
  }
];

const SubscriptionsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [subscriptions, setSubscriptions] = useState(initialRows);

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
      headerName: 'Тип абонемента',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'startDate',
      headerName: 'Дата начала',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'endDate',
      headerName: 'Дата окончания',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'remainingLessons',
      headerName: 'Осталось занятий',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number'
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
      label: 'Тип абонемента',
      type: 'text',
      required: true
    },
    {
      name: 'startDate',
      label: 'Дата начала',
      type: 'text',
      required: true
    },
    {
      name: 'endDate',
      label: 'Дата окончания',
      type: 'text',
      required: true
    },
    {
      name: 'remainingLessons',
      label: 'Осталось занятий',
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
    const newSubscription = {
      id: parseInt(formData.id),
      studentId: formData.studentId,
      typeId: formData.typeId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      remainingLessons: parseInt(formData.remainingLessons),
      deactivated: formData.deactivated || false
    };
    setSubscriptions(prev => [...prev, newSubscription]);
    setShowAddForm(false);
  };

  const handleDelete = (subscription) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subscription.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить абонемент"
        Icon={CardMembershipIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Абонементы"
      Icon={CardMembershipIcon}
      columns={columns}
      rows={subscriptions}
      addButtonText="Добавить абонемент"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default SubscriptionsList; 