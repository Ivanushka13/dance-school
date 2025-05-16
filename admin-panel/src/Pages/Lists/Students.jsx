import React, {useCallback, useEffect, useState} from 'react';
import SchoolIcon from '@mui/icons-material/School';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import {addStudent, editStudent, getStudents} from "../../api/students";

const createData = [
  {field: 'email', headerName: 'Почта', type: 'email', required: true},
  {field: 'first_name', headerName: 'Имя', type: 'text', required: true},
  {field: 'last_name', headerName: 'Фамилия', type: 'text', required: true},
  {field: 'middle_name', headerName: 'Отчество', type: 'text', required: false},
  {field: 'phone_number', headerName: 'Телефон', type: 'phone', required: false},
  {field: 'description', headerName: 'Описание', type: 'text', required: false},
  {field: 'password', headerName: 'Пароль', type: 'password', required: true},
  {field: 'level_id', headerName: 'Уровень', type: 'text', required: true}
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
    field: 'level_id',
    headerName: 'Уровень',
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
  },
];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchStudents = useCallback(() => {
    setIsLoading(true);
    getStudents({}).then(async (response) => {
      setStudents(response.students.map((student) => {
        return {
          id: student.id,
          user_id: student.user_id,
          level_id: student.level.id,
          first_name: student.user.first_name,
          last_name: student.user.last_name,
          middle_name: student.user?.middle_name,
          email: student.user.email,
          phone_number: student.user.phone_number,
          description: student.user.description,
          terminated: student.user.terminated,
          created_at: student.user.created_at,
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
    fetchStudents();
  }, [fetchStudents]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);

    formData = {
      ...formData,
      receive_email: false,
    };
    
    try {
      if (isEdit) {
        await editStudent(id, formData);
      } else {
        await addStudent(formData);
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
      title: isEdit ? 'Изменение ученика' : 'Создание ученика',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения ученика?' 
        : 'Вы уверены, что хотите создать нового ученика?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Ученики"
        Icon={SchoolIcon}
        columns={columns}
        rows={students}
        addButtonText="Добавить ученика"
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

export default Students;