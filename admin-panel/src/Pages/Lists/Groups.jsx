import React, {useCallback, useEffect, useState} from 'react';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ListPage from '../../Components/ListPage/ListPage';
import {apiRequest} from "../../util/apiService";
import {useNavigate} from "react-router-dom";
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";

const createData = [
  {field: 'name', headerName: 'Название', type: 'text', required: true},
  {field: 'description', headerName: 'Описание', type: 'text', required: false},
  {field: 'level_id', headerName: 'Уровень', type: 'text', required: true},
  {field: 'max_capacity', headerName: 'Максимальная вместимость', type: 'number', required: true}
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
    field: 'description',
    headerName: 'Описание',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'level_id',
    headerName: 'Уровень',
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'max_capacity',
    headerName: 'Макс. вместимость',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'number'
  },
  {
    field: 'created_at',
    headerName: 'Создано',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'datetime'
  },
  {
    field: 'terminated',
    headerName: 'Удалено',
    width: 150,
    headerClassName: 'data-grid-header',
    type: 'boolean'
  }
];

const Groups = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  const fetchGroups = useCallback(() => {
    setIsLoading(true);
    apiRequest({
      method: 'POST',
      url: '/groups/search/',
      data: {}
    }).then(async (response) => {
      setGroups(response.groups);
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
    fetchGroups();
  }, [fetchGroups]);

  const executeAction = async (formData, id, isEdit) => {
    setIsLoading(true);
    setShowConfirmModal(false);
    
    try {
      if (isEdit) {
        await apiRequest({
          method: 'PATCH',
          url: `/groups/${id}`,
          data: formData
        });
      } else {
        await apiRequest({
          method: 'POST',
          url: '/groups',
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
      title: isEdit ? 'Изменение группы' : 'Создание группы',
      message: isEdit 
        ? 'Вы уверены, что хотите сохранить изменения группы?' 
        : 'Вы уверены, что хотите создать новую группу?',
      confirmText: isEdit ? 'Сохранить' : 'Создать',
      cancelText: 'Отмена',
      onConfirm: () => executeAction(formData, id, isEdit)
    });
    
    setShowConfirmModal(true);
  };

  const handleDelete = (data) => {
    // todo
    console.log(data);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleAddClick = () => {
    navigate('/groups/add');
  };

  const handleRowClick = (row) => {
    navigate(`/groups/edit/${row.id}`);
  };

  return (
    <>
      <ListPage
        title="Группы"
        Icon={GroupIcon}
        columns={columns}
        rows={groups}
        addButtonText="Добавить группу"
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

export default Groups;