import React, {useCallback, useEffect, useState} from 'react';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import {addSubscription, editSubscription, getSubscriptions} from "../../api/subscriptions";

const createData = [
  {field: 'subscription_template_id', headerName: 'Шаблон абонемента', type: 'text', required: true},
  {field: 'student_id', headerName: 'ID студента', type: 'text', required: true},
  {field: 'payment_id', headerName: 'ID платежа', type: 'text', required: true},
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
    field: 'subscription_template_id',
    headerName: 'Шаблон абонемента',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'student_id',
    headerName: 'ID студента',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'payment_id',
    headerName: 'ID платежа',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'expiration_date',
    headerName: 'Дата окончания',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
  {
    field: 'created_at',
    headerName: 'Создано',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  }
];

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchSubscriptions = useCallback(() => {
    setIsLoading(true);
    getSubscriptions({}).then(async (response) => {
      setSubscriptions(response.subscriptions);
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
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await editSubscription(id, formData);
      } else {
        await addSubscription(formData);
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
      title: isEdit ? 'Изменение абонемента' : 'Создание абонемента',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения в абонементе?' 
        : 'Вы уверены, что хотите создать новый абонемент?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Абонементы"
        Icon={CardMembershipIcon}
        columns={columns}
        rows={subscriptions}
        addButtonText="Добавить абонемент"
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

export default Subscriptions;