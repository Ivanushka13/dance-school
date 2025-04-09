import React, { useState } from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    name: 'Мастер-класс',
    description: 'Интенсивное практическое занятие',
    deactivated: false
  },
  { 
    id: 2,
    name: 'Открытый урок',
    description: 'Демонстрационное занятие для новых студентов',
    deactivated: true
  },
  { 
    id: 3,
    name: 'Разговорный клуб',
    description: 'Практика разговорной речи в неформальной обстановке',
    deactivated: false
  }
];

const EventTypesList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventTypes, setEventTypes] = useState(initialRows);

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
    const newEventType = {
      id: parseInt(formData.id),
      name: formData.name,
      description: formData.description,
      deactivated: formData.deactivated || false
    };
    setEventTypes(prev => [...prev, newEventType]);
    setShowAddForm(false);
  };

  const handleDelete = (eventType) => {
    setEventTypes(prev => prev.filter(et => et.id !== eventType.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить тип мероприятия"
        Icon={CategoryIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Типы мероприятий"
      Icon={CategoryIcon}
      columns={columns}
      rows={eventTypes}
      addButtonText="Добавить тип мероприятия"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default EventTypesList; 