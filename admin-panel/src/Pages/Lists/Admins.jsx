import React, {useCallback, useEffect, useState} from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import {addAdmin, editAdmin, getAdmins} from "../../api/admins";

const createData = [
  {field: 'email', headerName: 'Email', type: 'email', required: true},
  {field: 'first_name', headerName: 'Имя', type: 'text', required: true},
  {field: 'last_name', headerName: 'Фамилия', type: 'text', required: true},
  {field: 'middle_name', headerName: 'Отчество', type: 'text', required: false},
  {field: 'description', headerName: 'Описание', type: 'text', required: false},
  {field: 'phone_number', headerName: 'Номер телефона', type: 'phone', required: true},
  {field: 'password', headerName: 'Пароль', type: 'password', required: true},
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
    headerName: 'Id пользователя',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'first_name',
    headerName: 'Имя',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text',
    required: true
  },
  {
    field: 'last_name',
    headerName: 'Фамилия',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'text',
    required: true
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
    type: 'email',
    required: true
  },
  {
    field: 'phone_number',
    headerName: 'Номер телефона',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'phone',
    required: true
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

const Admins = () => {

  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchAdmins = useCallback(() => {
    setIsLoading(true);
    getAdmins({}).then(async (response) => {
      setAdmins(response.admins.map((admin) => {
        return {
          id: admin.id,
          user_id: admin.user_id,
          first_name: admin.user.first_name,
          last_name: admin.user.last_name,
          middle_name: admin.user?.middle_name,
          email: admin.user.email,
          phone_number: admin.user.phone_number,
          description: admin.user.description,
          terminated: admin.user.terminated,
          created_at: admin.user.created_at,
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
    fetchAdmins();
  }, [fetchAdmins]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);

    try {
      if (isEdit) {
        await editAdmin(id, formData);
      } else {
        await addAdmin(formData);
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
      title: isEdit ? 'Изменение администратора' : 'Создание администратора',
      message: isEdit
        ? 'Вы уверены, что хотите сохранить изменения администратора?'
        : 'Вы уверены, что хотите создать нового администратора?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });

    setShowConfirmModal(true);
  };

  return (
    <>
      <ListPage
        title="Администраторы"
        Icon={AdminPanelSettingsIcon}
        columns={columns}
        rows={admins}
        addButtonText="Добавить администратора"
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

export default Admins;