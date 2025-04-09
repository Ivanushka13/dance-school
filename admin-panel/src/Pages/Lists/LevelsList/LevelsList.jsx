import React, { useState } from 'react';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    name: 'A1',
    description: 'Начальный уровень',
    deactivated: false
  },
  { 
    id: 2,
    name: 'A2',
    description: 'Элементарный уровень',
    deactivated: false
  },
  { 
    id: 3,
    name: 'B1',
    description: 'Средний уровень',
    deactivated: true
  }
];

const LevelsList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [levels, setLevels] = useState(initialRows);

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
    const newLevel = {
      id: parseInt(formData.id),
      name: formData.name,
      description: formData.description,
      deactivated: formData.deactivated || false
    };
    setLevels(prev => [...prev, newLevel]);
    setShowAddForm(false);
  };

  const handleDelete = (level) => {
    setLevels(prev => prev.filter(l => l.id !== level.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить уровень"
        Icon={SignalCellularAltIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Уровни"
      Icon={SignalCellularAltIcon}
      columns={columns}
      rows={levels}
      addButtonText="Добавить уровень"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default LevelsList; 