import React, { useState } from 'react';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../../Components/ListPage/ListPage';
import AddPage from '../../../Components/AddPage/AddPage';


const initialRows = [
  { 
    id: 1,
    name: 'Месячный стандарт',
    description: 'Базовый абонемент на месяц',
    lessonType: 'Групповые',
    lessonsCount: 8,
    expirationDate: '2024-04-25',
    daysUntilExpiration: 30,
    price: 5000,
    isActive: true
  },
  { 
    id: 2,
    name: 'Квартальный премиум',
    description: 'Расширенный абонемент на квартал',
    lessonType: 'Индивидуальные',
    lessonsCount: 24,
    expirationDate: '2024-06-25',
    daysUntilExpiration: 90,
    price: 14000,
    isActive: true
  },
  { 
    id: 3,
    name: 'Годовой VIP',
    description: 'Премиальный абонемент на год',
    lessonType: 'Смешанные',
    lessonsCount: 96,
    expirationDate: '2025-03-25',
    daysUntilExpiration: 365,
    price: 50000,
    isActive: false
  }
];

const SubscriptionTypesList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState(initialRows);

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
      field: 'lessonType',
      headerName: 'Тип занятий',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'lessonsCount',
      headerName: 'Количество занятий',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'expirationDate',
      headerName: 'Срок истечения',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'string'
    },
    {
      field: 'daysUntilExpiration',
      headerName: 'Дней до истечения',
      width: 200,
      headerClassName: 'data-grid-header',
      type: 'number'
    },
    {
      field: 'price',
      headerName: 'Цена',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'number',
      valueFormatter: (params) => `${params.value} ₽`
    },
    {
      field: 'isActive',
      headerName: 'Активирован',
      width: 150,
      headerClassName: 'data-grid-header',
      type: 'boolean',
      renderCell: (params) => (
        <div className={`status-cell ${params.value ? 'active' : 'deactivated'}`}>
          {params.value ? (
            <>
              <CheckCircleIcon className="status-icon" />
              <span>Да</span>
            </>
          ) : (
            <>
              <CancelIcon className="status-icon" />
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
      name: 'lessonType',
      label: 'Тип занятий',
      type: 'select',
      options: [
        { value: 'Групповые', label: 'Групповые' },
        { value: 'Индивидуальные', label: 'Индивидуальные' },
        { value: 'Смешанные', label: 'Смешанные' }
      ],
      required: true
    },
    {
      name: 'lessonsCount',
      label: 'Количество занятий',
      type: 'number',
      required: true
    },
    {
      name: 'expirationDate',
      label: 'Срок истечения (ГГГГ-ММ-ДД)',
      type: 'text',
      required: true,
      placeholder: 'YYYY-MM-DD'
    },
    {
      name: 'daysUntilExpiration',
      label: 'Дней до истечения',
      type: 'number',
      required: true
    },
    {
      name: 'price',
      label: 'Цена',
      type: 'number',
      required: true
    },
    {
      name: 'isActive',
      label: 'Активирован',
      type: 'switch',
      required: false
    }
  ];

  const handleAdd = (formData) => {
    const newSubscriptionType = {
      id: parseInt(formData.id),
      name: formData.name,
      description: formData.description,
      lessonType: formData.lessonType,
      lessonsCount: parseInt(formData.lessonsCount),
      expirationDate: formData.expirationDate,
      daysUntilExpiration: parseInt(formData.daysUntilExpiration),
      price: parseInt(formData.price),
      isActive: formData.isActive || false
    };
    setSubscriptionTypes(prev => [...prev, newSubscriptionType]);
    setShowAddForm(false);
  };

  const handleDelete = (subscriptionType) => {
    setSubscriptionTypes(prev => prev.filter(st => st.id !== subscriptionType.id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddPage
        title="Добавить тип абонемента"
        Icon={CardMembershipIcon}
        fields={fields}
        onSubmit={handleAdd}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ListPage
      title="Типы абонементов"
      Icon={CardMembershipIcon}
      columns={columns}
      rows={subscriptionTypes}
      addButtonText="Добавить тип абонемента"
      onAddClick={() => setShowAddForm(true)}
      onDelete={handleDelete}
    />
  );
};

export default SubscriptionTypesList; 