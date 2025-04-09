import React, { useState } from 'react';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    groupId: '2001',
    date: '2024-03-20',
    startTime: '10:00',
    endTime: '11:30',
    deactivated: false
  },
  { 
    id: 2,
    groupId: '2002',
    date: '2024-03-21',
    startTime: '15:00',
    endTime: '16:30',
    deactivated: true
  },
  { 
    id: 3,
    groupId: '2001',
    date: '2024-03-22',
    startTime: '18:00',
    endTime: '19:30',
    deactivated: false
  }
];

const LessonsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [lessons, setLessons] = useState(initialRows);

  const columns = [
    {
      field: 'id',
      headerName: 'Идентификатор',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'groupId',
      headerName: 'ID Группы',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'date',
      headerName: 'Дата',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'startTime',
      headerName: 'Время начала',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'endTime',
      headerName: 'Время окончания',
      width: 150,
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
      name: 'groupId',
      label: 'ID Группы',
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
      name: 'startTime',
      label: 'Время начала',
      type: 'text',
      required: true
    },
    {
      name: 'endTime',
      label: 'Время окончания',
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
    const newLesson = {
      id: parseInt(formData.id),
      groupId: formData.groupId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      deactivated: formData.deactivated || false
    };
    setLessons(prev => [...prev, newLesson]);
    setShowAddForm(false);
  };

  const handleDelete = (lesson) => {
    setLessons(prev => prev.filter(l => l.id !== lesson.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить занятие"
        Icon={EventIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Занятия"
      Icon={EventIcon}
      columns={columns}
      rows={lessons}
      addButtonText="Добавить занятие"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default LessonsList; 