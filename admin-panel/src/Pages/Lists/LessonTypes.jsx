import React, {useCallback, useEffect, useState} from 'react';
import SchoolIcon from '@mui/icons-material/School';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import {addLessonType, editLessonType, getLessonTypes} from "../../api/lessonTypes";

const createData = [
  {field: 'dance_style_id', headerName: 'Стиль танца', type: 'text', required: true},
  {field: 'is_group', headerName: 'Групповое', type: 'boolean', required: true}
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
    field: 'dance_style_id',
    headerName: 'Стиль танца',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'created_at',
    headerName: 'Создано',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
  {
    field: 'is_group',
    headerName: 'Групповое',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean'
  },
  {
    field: 'terminated',
    headerName: 'Удалено',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean'
  }
];

const LessonTypes = () => {
  const [lessonTypes, setLessonTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchLessonTypes = useCallback(() => {
    setIsLoading(true);
    getLessonTypes({}).then(async (response) => {
      setLessonTypes(response.lesson_types);
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
    fetchLessonTypes();
  }, [fetchLessonTypes]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await editLessonType(id, formData);
      } else {
        await addLessonType(formData);
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
      title: isEdit ? 'Изменение типа занятия' : 'Создание типа занятия',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения типа занятия?' 
        : 'Вы уверены, что хотите создать новый тип занятия?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Типы занятий"
        Icon={SchoolIcon}
        columns={columns}
        rows={lessonTypes}
        addButtonText="Добавить тип занятия"
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

export default LessonTypes;