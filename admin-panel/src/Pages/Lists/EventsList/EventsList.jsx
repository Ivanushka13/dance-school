import React, { useState } from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    name: 'День открытых дверей',
    typeId: '1',
    date: '2024-03-25',
    startTime: '10:00',
    endTime: '18:00',
    description: 'Презентация школы для новых студентов',
    deactivated: false
  },
  { 
    id: 2,
    name: 'Мастер-класс по грамматике',
    typeId: '2',
    date: '2024-03-26',
    startTime: '15:00',
    endTime: '17:00',
    description: 'Интенсивный курс английской грамматики',
    deactivated: true
  },
  { 
    id: 3,
    name: 'Разговорный клуб',
    typeId: '3',
    date: '2024-03-27',
    startTime: '18:00',
    endTime: '20:00',
    description: 'Практика разговорного английского',
    deactivated: false
  }
];

const EventsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [events, setEvents] = useState(initialRows);

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
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'typeId',
      headerName: 'Тип события',
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
      name: 'name',
      label: 'Название',
      type: 'text',
      required: true
    },
    {
      name: 'typeId',
      label: 'Тип события',
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
    const newEvent = {
      id: parseInt(formData.id),
      name: formData.name,
      typeId: formData.typeId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      deactivated: formData.deactivated || false
    };
    setEvents(prev => [...prev, newEvent]);
    setShowAddForm(false);
  };

  const handleDelete = (event) => {
    setEvents(prev => prev.filter(e => e.id !== event.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить мероприятие"
        Icon={EventNoteIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Мероприятия"
      Icon={EventNoteIcon}
      columns={columns}
      rows={events}
      addButtonText="Добавить мероприятие"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default EventsList;