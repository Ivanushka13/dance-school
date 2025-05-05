import React, {useCallback, useEffect, useState} from 'react';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ListPage from '../../Components/ListPage/ListPage';
import {apiRequest} from "../../util/apiService";
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";

const createData = [
  {field: 'name', headerName: 'Название', type: 'text', required: true},
  {field: 'description', headerName: 'Описание', type: 'text', required: true},
  {field: 'lesson_count', headerName: 'Количество занятий', type: 'number', required: true},
  {field: 'price', headerName: 'Цена', type: 'number', required: true},
  {field: 'expiration_day_count', headerName: 'Срок действия (дней)', type: 'number', required: true},
  {field: 'expiration_date', headerName: 'Дата окончания', type: 'datetime', required: false}
];

const columns = [
  {
    field: 'id',
    headerName: 'Id',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'name',
    headerName: 'Название',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'description',
    headerName: 'Описание',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'lesson_count',
    headerName: 'Количество занятий',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'number'
  },
  {
    field: 'price',
    headerName: 'Цена',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'number'
  },
  {
    field: 'expiration_day_count',
    headerName: 'Срок действия (дней)',
    width: 170,
    headerClassName: 'data-grid-header',
    type: 'number'
  },
  {
    field: 'expiration_date',
    headerName: 'Дата окончания',
    width: 170,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
  {
    field: 'created_at',
    headerName: 'Создано',
    width: 170,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  }
];

const SubscriptionTemplateList = () => {
  const [subscriptionTemplates, setSubscriptionTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchSubscriptionTemplates = useCallback(() => {
    setIsLoading(true);
    apiRequest({
      method: 'POST',
      url: '/subscriptionTemplates/search',
      data: {}
    }).then(async (response) => {
      setSubscriptionTemplates(response.subscription_templates);
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка при загрузке данных',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [refreshData]);

  useEffect(() => {
    fetchSubscriptionTemplates();
  }, [fetchSubscriptionTemplates]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await apiRequest({
          method: 'PATCH',
          url: `/subscriptionTemplates/${id}`,
          data: formData,
        });
      } else {
        await apiRequest({
          method: 'POST',
          url: '/subscriptionTemplates',
          data: formData,
        });
      }

      setRefreshData((prev) => prev + 1);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при отправке запроса',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (formData, id, isEdit) => {
    setConfirmModalInfo({
      title: isEdit ? 'Изменение шаблона абонемента' : 'Создание шаблона абонемента',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения в шаблоне абонемента?' 
        : 'Вы уверены, что хотите создать новый шаблон абонемента?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Типы абонементов"
        Icon={CardMembershipIcon}
        columns={columns}
        rows={subscriptionTemplates}
        addButtonText="Добавить тип абонемента"
        onSubmit={handleSubmit}
        fieldsToCreate={createData}
      />
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
      <ConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmModalInfo.onConfirm}
        title={confirmModalInfo.title}
        message={confirmModalInfo.message}
        confirmText={confirmModalInfo.confirmText}
        cancelText={confirmModalInfo.cancelText}
      />
    </>
  );
};

export default SubscriptionTemplateList;