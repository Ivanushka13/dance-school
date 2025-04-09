import React, { useState } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    deactivated: false
  },
  { 
    id: 2,
    deactivated: true
  },
  { 
    id: 3,
    deactivated: false
  },
  { 
    id: 4,
    deactivated: true
  },
  { 
    id: 5,
    deactivated: false
  }
];

const TeachersList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [teachers, setTeachers] = useState(initialRows);

  const columns = [
    {
      field: 'id',
      headerName: 'Идентификатор',
      width: 250,
      headerClassName: 'data-grid-header',
      type: 'number'
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
      name: 'deactivated',
      label: 'Деактивирован',
      type: 'switch',
      required: false
    }
  ];

  const handleAdd = (formData) => {
    const newTeacher = {
      id: parseInt(formData.id),
      deactivated: formData.deactivated || false
    };
    setTeachers(prev => [...prev, newTeacher]);
    setShowAddForm(false);
  };

  const handleDelete = (teacher) => {
    setTeachers(prev => prev.filter(t => t.id !== teacher.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить преподавателя"
        Icon={GroupsIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Преподаватели"
      Icon={GroupsIcon}
      columns={columns}
      rows={teachers}
      addButtonText="Добавить преподавателя"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default TeachersList; 