import React, {useCallback, useEffect, useState} from 'react';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ListPage from '../../Components/ListPage/ListPage';
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";
import {addLevel, editLevel, getLevels} from "../../api/levels";

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
    width: 200,
    headerClassName: 'data-grid-header',
    type: 'text'
  },
  {
    field: 'description',
    headerName: 'Описание',
    width: 300,
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
  }
];

const Levels = () => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const fetchLevels = useCallback(() => {
    setIsLoading(true);
    getLevels({}).then(async (response) => {
      setLevels(response.levels);
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
    fetchLevels();
  }, [fetchLevels]);

  const handleSubmit = async (formData, id, isEdit) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        await editLevel(id, formData);
      } else {
        await addLevel(formData);
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
        title="Уровни"
        Icon={SignalCellularAltIcon}
        columns={columns}
        rows={levels}
        addButtonText="Добавить уровень"
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

export default Levels;