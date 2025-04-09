import React, { useState } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    level: 'A1',
    deactivated: false
  },
  { 
    id: 2,
    level: 'B2',
    deactivated: true
  },
  { 
    id: 3,
    level: 'C1',
    deactivated: false
  },
  { 
    id: 4,
    level: 'A2',
    deactivated: true
  },
  { 
    id: 5,
    level: 'B1',
    deactivated: false
  }
];

const StudentsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [students, setStudents] = useState(initialRows);

  const columns = [
    {
      field: 'id',
      headerName: 'Идентификатор',
      width: 250,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'level',
      headerName: 'Уровень',
      width: 250,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'deactivated',
      headerName: 'Деактивирован',
      width: 250,
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
      name: 'level',
      label: 'Уровень',
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
    const newStudent = {
      id: parseInt(formData.id),
      level: formData.level,
      deactivated: formData.deactivated || false
    };
    setStudents(prev => [...prev, newStudent]);
    setShowAddForm(false);
  };

  const handleDelete = (student) => {
    setStudents(prev => prev.filter(s => s.id !== student.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить ученика"
        Icon={SchoolIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Ученики"
      Icon={SchoolIcon}
      columns={columns}
      rows={students}
      addButtonText="Добавить ученика"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default StudentsList;