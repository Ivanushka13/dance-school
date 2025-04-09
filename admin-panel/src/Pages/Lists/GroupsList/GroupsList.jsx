import React, { useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    name: 'Группа A1',
    level: 'A1',
    deactivated: false
  },
  { 
    id: 2,
    name: 'Группа B2',
    level: 'B2',
    deactivated: true
  },
  { 
    id: 3,
    name: 'Группа C1',
    level: 'C1',
    deactivated: false
  }
];

const GroupsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [groups, setGroups] = useState(initialRows);

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
      field: 'level',
      headerName: 'Уровень',
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
      name: 'name',
      label: 'Название',
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
    const newGroup = {
      id: parseInt(formData.id),
      name: formData.name,
      level: formData.level,
      deactivated: formData.deactivated || false
    };
    setGroups(prev => [...prev, newGroup]);
    setShowAddForm(false);
  };

  const handleDelete = (group) => {
    setGroups(prev => prev.filter(g => g.id !== group.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить группу"
        Icon={GroupIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Группы"
      Icon={GroupIcon}
      columns={columns}
      rows={groups}
      addButtonText="Добавить группу"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default GroupsList;