import React, { useState } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    firstName: 'Иван',
    lastName: 'Петров',
    middleName: 'Сергеевич',
    login: 'ivan.petrov',
    phone: '+7 (999) 123-45-67',
    deactivated: false
  },
  { 
    id: 2,
    firstName: 'Анна',
    lastName: 'Сидорова',
    middleName: 'Александровна',
    login: 'anna.sidorova',
    phone: '+7 (999) 765-43-21',
    deactivated: true
  }
];

const AdminsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [admins, setAdmins] = useState(initialRows);

  const columns = [
    {
      field: 'id',
      headerName: 'Идентификатор',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'firstName',
      headerName: 'Имя',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'lastName',
      headerName: 'Фамилия',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'middleName',
      headerName: 'Отчество',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'login',
      headerName: 'Логин',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'phone',
      headerName: 'Телефон',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'deactivated',
      headerName: 'Деактивирован',
      width: 200,
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
      name: 'firstName',
      label: 'Имя',
      type: 'text',
      required: true
    },
    {
      name: 'lastName',
      label: 'Фамилия',
      type: 'text',
      required: true
    },
    {
      name: 'middleName',
      label: 'Отчество',
      type: 'text',
      required: true
    },
    {
      name: 'login',
      label: 'Логин',
      type: 'text',
      required: true
    },
    {
      name: 'phone',
      label: 'Телефон',
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
    const newAdmin = {
      id: parseInt(formData.id),
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      login: formData.login,
      phone: formData.phone,
      deactivated: formData.deactivated || false
    };
    setAdmins(prev => [...prev, newAdmin]);
    setShowAddForm(false);
  };

  const handleDelete = (admin) => {
    setAdmins(prev => prev.filter(a => a.id !== admin.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить администратора"
        Icon={AdminPanelSettingsIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Администраторы"
      Icon={AdminPanelSettingsIcon}
      columns={columns}
      rows={admins}
      addButtonText="Добавить администратора"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default AdminsList; 