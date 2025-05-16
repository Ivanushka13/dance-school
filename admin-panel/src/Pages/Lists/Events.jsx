import React, {useCallback, useEffect, useState} from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import {addEvent, editEvent, getEvents} from "../../api/events";

const createData = [
  {field: 'event_type_id', headerName: 'Тип мероприятия', type: 'text', required: true},
  {field: 'name', headerName: 'Название', type: 'text', required: true},
  {field: 'description', headerName: 'Описание', type: 'text', required: false},
  {field: 'start_time', headerName: 'Время начала', type: 'datetime', required: true},
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
    field: 'event_type_id',
    headerName: 'Тип мероприятия',
    width: 200,
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
    field: 'start_time',
    headerName: 'Время начала',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'datetime'
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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const fetchEvents = useCallback(() => {
    setIsLoading(true);
    getEvents({}).then(async (response) => {
      setEvents(response.events);
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
    fetchEvents();
  }, [fetchEvents]);

  const handleSubmit = async (formData, id, isEdit) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        await editEvent(id, formData);
      } else {
        await addEvent(formData);
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

  return (
    <>
      <ListPage
        title="Мероприятия"
        Icon={EventNoteIcon}
        columns={columns}
        rows={events}
        addButtonText="Добавить мероприятие"
        onSubmit={handleSubmit}
        fieldsToCreate={createData}
      />
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
};

export default Events;