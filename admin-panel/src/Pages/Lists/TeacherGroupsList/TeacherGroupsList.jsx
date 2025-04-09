import React, { useState } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    teacherId: '3001',
    groupId: '2001',
    deactivated: false
  },
  { 
    id: 2,
    teacherId: '3002',
    groupId: '2001',
    deactivated: true
  },
  { 
    id: 3,
    teacherId: '3001',
    groupId: '2002',
    deactivated: false
  }
];

const TeacherGroupsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [teacherGroups, setTeacherGroups] = useState(initialRows);

  const columns = [
    {
      field: 'id',
      headerName: 'Идентификатор',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'teacherId',
      headerName: 'ID Преподавателя',
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
      name: 'teacherId',
      label: 'ID Преподавателя',
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
    const newTeacherGroup = {
      id: parseInt(formData.id),
      teacherId: formData.teacherId,
      groupId: formData.groupId,
      deactivated: formData.deactivated || false
    };
    setTeacherGroups(prev => [...prev, newTeacherGroup]);
    setShowAddForm(false);
  };

  const handleDelete = (teacherGroup) => {
    setTeacherGroups(prev => prev.filter(tg => tg.id !== teacherGroup.id));
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
      title="Группы преподавателей"
      Icon={GroupsIcon}
      columns={columns}
      rows={teacherGroups}
      addButtonText="Добавить группу"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default TeacherGroupsList; 