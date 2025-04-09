import React, { useState } from 'react';
import { 
  DataGrid, 
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  ruRU 
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import SideBar from '../SideBar/SideBar';
import NavBar from '../NavBar/NavBar';
import PropTypes from 'prop-types';
import './ListPage.css';

const CustomToolbar = () => {
  return (
    <div className="MuiDataGrid-toolbarContainer">
      <div>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </div>
      <GridToolbarQuickFilter 
        placeholder="Быстрый поиск..."
        sx={{
          width: '300px',
          marginLeft: 'auto'
        }}
      />
    </div>
  );
};

const ListPage = ({ 
  title, 
  Icon, 
  columns, 
  rows, 
  addButtonText,
  onAddClick,
  onDelete
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && selectedRow) {
      onDelete(selectedRow);
    }
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = (row) => {
    const filteredColumns = columns
      .filter(col => col.field !== 'actions')
      .map(col => ({
        field: col.field,
        headerName: col.headerName,
        type: col.type,
        width: col.width
      }));
    
    navigate('/edit', {
      state: {
        data: row,
        columns: filteredColumns,
        title: title
      }
    });
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Действие',
    width: 150,
    headerClassName: 'data-grid-header',
    sortable: false,
    renderCell: (params) => (
      <div className="action-buttons">
        <button 
          className="action-button edit"
          onClick={() => handleEdit(params.row)}
        >
          <EditIcon />
        </button>
        <button 
          className="action-button delete"
          onClick={() => handleDeleteClick(params.row)}
        >
          <DeleteIcon />
        </button>
      </div>
    ),
  };

  const allColumns = [...columns, actionColumn];

  return (
    <div className="list">
      <SideBar />
      <div className="list-container">
        <NavBar />
        <div className="page-content">
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <Icon />
              </div>
              <div className="header-text">
                <h1>{title}</h1>
              </div>
            </div>
          </div>

          <div className="data-grid-wrapper">
            <DataGrid
              rows={rows}
              columns={allColumns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              className="custom-data-grid"
              style={{ height: 500 }}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'id', sort: 'asc' }],
                },
              }}
              slots={{
                toolbar: CustomToolbar
              }}
              localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            />
          </div>

          <div className="add-button-container">
            <button onClick={onAddClick} className="add-button">
              <AddIcon />
              <span>{addButtonText}</span>
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <p>Вы уверены, что хотите удалить эту запись?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ListPage.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  addButtonText: PropTypes.string.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default ListPage; 