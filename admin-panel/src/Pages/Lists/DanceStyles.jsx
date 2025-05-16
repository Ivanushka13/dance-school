import React, {useCallback, useEffect, useState} from 'react';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import {addDanceStyle, editDanceStyle, getDanceStyles} from "../../api/danceStyles";

const createData = [
  {field: 'name', headerName: 'Название', type: 'text', required: true},
  {field: 'description', headerName: 'Описание', type: 'text', required: false},
  {field: 'photo_url', headerName: 'URL фото', type: 'text', required: false}
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
    field: 'photo_url',
    headerName: 'URL фото',
    width: 150,
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
    field: 'terminated',
    headerName: 'Удалено',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean'
  },
];

const DanceStyles = () => {
  const [danceStyles, setDanceStyles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchDanceStyles = useCallback(() => {
    setIsLoading(true);
    getDanceStyles({}).then(async (response) => {
      setDanceStyles(response.dance_styles);
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
    fetchDanceStyles();
  }, [fetchDanceStyles]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await editDanceStyle(id, formData);
      } else {
        await addDanceStyle(id, formData);
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
      title: isEdit ? 'Изменение стиля танца' : 'Создание стиля танца',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения стиля танца?' 
        : 'Вы уверены, что хотите создать новый стиль танца?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Стили танца"
        Icon={MeetingRoomIcon}
        columns={columns}
        rows={danceStyles}
        addButtonText="Добавить стиль танца"
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

export default DanceStyles;