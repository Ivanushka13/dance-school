import React, {useCallback, useEffect, useState} from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import {addTeacher, editTeacher, getTeachers} from "../../api/teachers";

const createData = [
  {field: 'email', headerName: 'Почта', type: 'email', required: true},
  {field: 'first_name', headerName: 'Имя', type: 'text', required: true},
  {field: 'last_name', headerName: 'Фамилия', type: 'text', required: true},
  {field: 'middle_name', headerName: 'Отчество', type: 'text', required: false},
  {field: 'phone_number', headerName: 'Телефон', type: 'phone', required: false},
  {field: 'description', headerName: 'Описание', type: 'text', required: false},
  {field: 'password', headerName: 'Пароль', type: 'password', required: true}
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
    field: 'user_id',
    headerName: 'ID пользователя',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'first_name',
    headerName: 'Имя',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'last_name',
    headerName: 'Фамилия',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'middle_name',
    headerName: 'Отчество',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'email'
  },
  {
    field: 'phone_number',
    headerName: 'Телефон',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'phone'
  },
  {
    field: 'description',
    headerName: 'Описание',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'created_at',
    headerName: 'Создан',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
  {
    field: 'terminated',
    headerName: 'Удален',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean'
  },
];

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchTeachers = useCallback(() => {
    setIsLoading(true);
    getTeachers({}).then(async (response) => {
      setTeachers(response.teachers.map((teacher) => {
        return {
          id: teacher.id,
          user_id: teacher.user_id,
          first_name: teacher.user.first_name,
          last_name: teacher.user.last_name,
          middle_name: teacher.user?.middle_name,
          email: teacher.user.email,
          phone_number: teacher.user.phone_number,
          description: teacher.user.description,
          terminated: teacher.user.terminated,
          created_at: teacher.user.created_at,
        }
      }));
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
    fetchTeachers();
  }, [fetchTeachers]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await editTeacher(id, formData);
      } else {
        await addTeacher(formData);
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
      title: isEdit ? 'Изменение преподавателя' : 'Создание преподавателя',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения преподавателя?' 
        : 'Вы уверены, что хотите создать нового преподавателя?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Преподаватели"
        Icon={GroupsIcon}
        columns={columns}
        rows={teachers}
        addButtonText="Добавить преподавателя"
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

export default Teachers;