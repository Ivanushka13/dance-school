import React, { useState } from 'react';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    student: 'Иван Петров',
    group: 'Группа A1',
    date: '2024-03-25',
    time: '18:00-19:30',
    status: 'present',
    deactivated: false
  },
  { 
    id: 2,
    student: 'Анна Сидорова',
    group: 'Группа A2',
    date: '2024-03-25',
    time: '19:45-21:15',
    status: 'absent',
    deactivated: true
  },
  { 
    id: 3,
    student: 'Петр Иванов',
    group: 'Группа B1',
    date: '2024-03-26',
    time: '15:00-16:30',
    status: 'late',
    deactivated: false
  }
];

const AttendancesList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [attendances, setAttendances] = useState(initialRows);

  const columns = [
    {
      field: 'id',
      headerName: 'Идентификатор',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'student',
      headerName: 'Ученик',
      width: 250,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'group',
      headerName: 'Группа',
      width: 200,
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
      field: 'time',
      headerName: 'Время',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string',
      renderCell: (params) => (
        <div className={`status-cell ${params.value}`}>
          {params.value === 'present' ? (
            <>
              <CheckCircleIcon className="status-icon" />
              <span>Присутствует</span>
            </>
          ) : params.value === 'late' ? (
            <>
              <CancelIcon className="status-icon" />
              <span>Опоздал</span>
            </>
          ) : (
            <>
              <CancelIcon className="status-icon" />
              <span>Отсутствует</span>
            </>
          )}
        </div>
      ),
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
      name: 'student',
      label: 'Ученик',
      type: 'text',
      required: true
    },
    {
      name: 'group',
      label: 'Группа',
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
      name: 'time',
      label: 'Время',
      type: 'text',
      required: true
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      options: [
        { value: 'present', label: 'Присутствует' },
        { value: 'late', label: 'Опоздал' },
        { value: 'absent', label: 'Отсутствует' }
      ],
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
    const newAttendance = {
      id: parseInt(formData.id),
      student: formData.student,
      group: formData.group,
      date: formData.date,
      time: formData.time,
      status: formData.status,
      deactivated: formData.deactivated || false
    };
    setAttendances(prev => [...prev, newAttendance]);
    setShowAddForm(false);
  };

  const handleDelete = (attendance) => {
    setAttendances(prev => prev.filter(a => a.id !== attendance.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить посещение"
        Icon={HowToRegIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Посещения занятий"
      Icon={HowToRegIcon}
      columns={columns}
      rows={attendances}
      addButtonText="Добавить посещение"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default AttendancesList; 