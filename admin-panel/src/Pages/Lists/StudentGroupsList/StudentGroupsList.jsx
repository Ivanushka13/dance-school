import React, { useState } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    studentId: '1001',
    groupId: '2001',
    deactivated: false
  },
  { 
    id: 2,
    studentId: '1002',
    groupId: '2001',
    deactivated: true
  },
  { 
    id: 3,
    studentId: '1003',
    groupId: '2002',
    deactivated: false
  }
];

const StudentGroupsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [studentGroups, setStudentGroups] = useState(initialRows);

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
      headerName: 'ID Ученика',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'groupId',
      headerName: 'ID Группы',
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
      name: 'studentId',
      label: 'ID Ученика',
      type: 'text',
      required: true
    },
    {
      name: 'groupId',
      label: 'ID Группы',
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
    const newStudentGroup = {
      id: parseInt(formData.id),
      studentId: formData.studentId,
      groupId: formData.groupId,
      deactivated: formData.deactivated || false
    };
    setStudentGroups(prev => [...prev, newStudentGroup]);
    setShowAddForm(false);
  };

  const handleDelete = (studentGroup) => {
    setStudentGroups(prev => prev.filter(sg => sg.id !== studentGroup.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить группу"
        Icon={GroupsIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Группы учеников"
      Icon={GroupsIcon}
      columns={columns}
      rows={studentGroups}
      addButtonText="Добавить группу"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default StudentGroupsList; 