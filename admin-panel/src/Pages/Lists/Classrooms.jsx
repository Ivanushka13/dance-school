import React, {useCallback, useEffect, useState} from 'react';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import {addClassroom, editClassroom, getClassrooms} from "../../api/classrooms";

const createData = [
  {field: 'name', headerName: 'Название', type: 'text', required: true},
  {field: 'description', headerName: 'Описание', type: 'text', required: false}
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
    field: 'created_at',
    headerName: 'Создан',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
  {
    field: 'terminated',
    headerName: 'Удален',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean'
  }
];

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchClassrooms = useCallback(() => {
    setIsLoading(true);
    getClassrooms({}).then(async (response) => {
      setClassrooms(response.classrooms);
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
    fetchClassrooms();
  }, [fetchClassrooms]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await editClassroom(id, formData);
      } else {
        await addClassroom(formData);
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
      title: isEdit ? 'Изменение зала' : 'Создание зала',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения зала?' 
        : 'Вы уверены, что хотите создать новый зал?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Залы"
        Icon={MeetingRoomIcon}
        columns={columns}
        rows={classrooms}
        addButtonText="Добавить зал"
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

export default Classrooms;