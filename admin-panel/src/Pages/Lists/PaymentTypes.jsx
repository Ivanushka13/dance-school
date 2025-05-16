import React, {useCallback, useEffect, useState} from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import {addPaymentType, editPaymentType, getPaymentTypes} from "../../api/paymentTypes";

const createData = [
  {field: 'name', headerName: 'Название', type: 'text', required: true}
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
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'created_at',
    headerName: 'Создано',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'datetime',
  },
  {
    field: 'terminated',
    headerName: 'Удалено',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean',
  }
];

const PaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchPaymentTypes = useCallback(() => {
    setIsLoading(true);
    getPaymentTypes({}).then(async (response) => {
      setPaymentTypes(response.payment_types);
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
    fetchPaymentTypes();
  }, [fetchPaymentTypes]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await editPaymentType(id, formData);
      } else {
        await addPaymentType(formData);
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

  const handleSubmit =  (formData, id, isEdit) => {
    setConfirmModalInfo({
      title: isEdit ? 'Изменение типа платежа' : 'Создание типа платежа',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения в типе платежа?' 
        : 'Вы уверены, что хотите создать новый тип платежа?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit),
    });

    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Типы платежей"
        Icon={CategoryIcon}
        columns={columns}
        rows={paymentTypes}
        addButtonText="Добавить тип платежа"
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

export default PaymentTypes;