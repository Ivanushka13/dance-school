import React, {useCallback, useEffect, useState} from 'react';
import EventIcon from '@mui/icons-material/Event';
import ListPage from '../../Components/ListPage/ListPage';
import {apiRequest} from "../../util/apiService";
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";

const createData = [
  {field: 'name', headerName: 'Название', type: 'text', required: true},
  {field: 'description', headerName: 'Описание', type: 'text', required: true},
  {field: 'lesson_type_id', headerName: 'Тип занятия', type: 'text', required: true},
  {field: 'start_time', headerName: 'Начало', type: 'datetime', required: true},
  {field: 'finish_time', headerName: 'Окончание', type: 'datetime', required: true},
  {field: 'classroom_id', headerName: 'Зал', type: 'text', required: true},
  {field: 'group_id', headerName: 'Группа', type: 'text', required: true},
  {field: 'is_confirmed', headerName: 'Подтверждено', type: 'boolean', required: false},
  {field: 'are_neighbours_allowed', headerName: 'Соседи разрешены', type: 'boolean', required: true}
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
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'lesson_type_id',
    headerName: 'Тип занятия',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'start_time',
    headerName: 'Начало',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
  {
    field: 'finish_time',
    headerName: 'Окончание',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
  {
    field: 'classroom_id',
    headerName: 'Зал',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'group_id',
    headerName: 'Группа',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'created_at',
    headerName: 'Создано',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'datetime',
  },
  {
    field: 'is_confirmed',
    headerName: 'Подтверждено',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean',
  },
  {
    field: 'are_neighbours_allowed',
    headerName: 'Соседи разрешены',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean',
  },
  {
    field: 'terminated',
    headerName: 'Удалено',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean',
  },
];

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchLessons = useCallback(() => {
    setIsLoading(true);
    apiRequest({
      method: 'POST',
      url: '/lessons/search/admin',
      data: {}
    }).then(async (response) => {
      setLessons(response.lessons);
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
    fetchLessons();
  }, [fetchLessons]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await apiRequest({
          method: 'PATCH',
          url: `/lessons/${id}`,
          data: formData
        });
      } else {
        await apiRequest({
          method: 'POST',
          url: '/lessons',
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
      title: isEdit ? 'Изменение занятия' : 'Создание занятия',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения занятия?' 
        : 'Вы уверены, что хотите создать новое занятие?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Занятия"
        Icon={EventIcon}
        columns={columns}
        rows={lessons}
        addButtonText="Добавить занятие"
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

export default Lessons;