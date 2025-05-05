import React, {useCallback, useEffect, useState} from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListPage from '../../Components/ListPage/ListPage';
import {apiRequest} from "../../util/apiService";
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";

const createData = [
  {field: 'teacher_id', headerName: 'Преподаватель', type: 'text', required: true},
  {field: 'day_of_week', headerName: 'День недели', type: 'number', required: true},
  {field: 'start_time', headerName: 'Время начала', type: 'time', required: true},
  {field: 'end_time', headerName: 'Время окончания', type: 'time', required: true}
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
    field: 'teacher_id',
    headerName: 'Преподаватель',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'start_time',
    headerName: 'Время начала',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'time'
  },
  {
    field: 'end_time',
    headerName: 'Время окончания',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'time'
  },
  {
    field: 'day_of_week',
    headerName: 'День недели',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'number'
  },
  {
    field: 'created_at',
    headerName: 'Создано',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
];

const Slots = () => {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchSlots = useCallback(() => {
    setIsLoading(true);
    apiRequest({
      method: 'POST',
      url: '/slots/search',
      data: {}
    }).then(async (response) => {
      setSlots(response.slots);
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
    fetchSlots();
  }, [fetchSlots]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await apiRequest({
          method: 'PATCH',
          url: `/slots/${id}`,
          data: formData
        });
      } else {
        await apiRequest({
          method: 'POST',
          url: '/slots',
          data: formData
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
      title: isEdit ? 'Изменение слота' : 'Создание слота',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения слота?' 
        : 'Вы уверены, что хотите создать новый слот?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Слоты"
        Icon={CalendarMonthIcon}
        columns={columns}
        rows={slots}
        addButtonText="Добавить слот"
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

export default Slots;