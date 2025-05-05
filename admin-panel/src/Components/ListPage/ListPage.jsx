import React, { useState } from 'react';
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarExport,
  ruRU,
  GridToolbarContainer
} from '@mui/x-data-grid';
import {useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SideBar from '../SideBar/SideBar';
import NavBar from '../NavBar/NavBar';
import PropTypes from 'prop-types';
import ModalForm from '../Modal/ModalForm';
import './ListPage.css';

const CustomToolbar = () => {
  return (
    <GridToolbarContainer className="MuiDataGrid-toolbarContainer">
      <div>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </div>
    </GridToolbarContainer>
  );
};

const ListPage =
  ({
     title,
     Icon,
     columns,
     rows,
     addButtonText,
     onSubmit,
     fieldsToCreate,
   }) => {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    const handleEdit = (row) => {
      setEditingRow(row);
      setShowModal(true);
    };

    const handleAddClick = () => {
      setEditingRow(null);
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setEditingRow(null);
    };

    const handleSubmitForm = (formData, id) => {
      const recordId = id || (editingRow ? editingRow.id : null);
      const isEditMode = !!recordId;
      
      onSubmit(formData, recordId, isEditMode);
      
      setShowModal(false);
      setEditingRow(null);
    };

    const centeredColumns = columns.map(column => ({
      ...column,
      headerAlign: 'center',
      align: 'center'
    }));

    const actionColumn = {
      field: 'actions',
      headerName: 'Редактировать',
      width: 150,
      headerClassName: 'data-grid-header',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div className="list-page-action-buttons">
          <button
            className="list-page-action-button edit"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon/>
          </button>
        </div>
      ),
    };

    const allColumns = [...centeredColumns, actionColumn];
    
    const baseFields = columns.filter(col => col.field !== 'actions');
    
    const createFields = fieldsToCreate;
    const editFields = [...baseFields];

    return (
      <div className="list-page">
        <SideBar/>
        <div className="list-page-container">
          <NavBar/>
          <div className="list-page-content">
            <div className="list-page-main-content">
              <div className="list-page-header">
                <div className="list-page-header-content">
                  <div className="list-page-header-icon">
                    <Icon/>
                  </div>
                  <div className="list-page-header-text">
                    <h1>{title}</h1>
                  </div>
                </div>
              </div>

              <div className="list-page-data-grid-wrapper">
                <DataGrid
                  rows={rows}
                  columns={allColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                  className="list-page-custom-data-grid"
                  style={{height: 500}}
                  hideFooterSelectedRowCount={true}
                  slots={{
                    toolbar: CustomToolbar
                  }}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                />
              </div>

              <div className="list-page-add-button-container">
                <button onClick={handleAddClick} className="list-page-add-button">
                  <AddIcon/>
                  <span>{addButtonText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <ModalForm
          open={showModal}
          onClose={handleCloseModal}
          title={editingRow ? `Редактирование` : `Добавление`}
          createFields={createFields}
          editFields={editFields}
          isEdit={!!editingRow}
          onSubmit={handleSubmitForm}
          initialValues={editingRow || {}}
        />
      </div>
    );
  };

ListPage.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  fieldsToCreate: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  addButtonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ListPage; 