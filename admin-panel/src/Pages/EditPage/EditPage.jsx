import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    FormControlLabel,
    Switch,
    IconButton,
    Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SideBar from '../../Components/SideBar/SideBar';
import NavBar from '../../Components/NavBar/NavBar';
import './EditPage.css';

const EditPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({});
    const [columns, setColumns] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (location.state) {
            const { data, columns, title } = location.state;
            setFormData(data);
            setColumns(columns);
            setTitle(title);
        }
    }, [location]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const renderField = (column) => {
        if (!column) return null;
        
        const value = formData[column.field];
        
        const commonProps = {
            key: column.field,
            fullWidth: true,
            margin: "normal",
            disabled: !isEditing,
            size: "medium",
            sx: {
                '& .MuiInputBase-root': {
                    borderRadius: '12px',
                    backgroundColor: isEditing ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
                },
                '& .MuiInputLabel-root': {
                    color: 'text.primary'
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.7)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#000',
                    }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000'
                }
            }
        };

        switch (column.type) {
            case 'boolean':
                return (
                    <Paper 
                        elevation={0} 
                        className="field-paper"
                        sx={{ 
                            bgcolor: isEditing ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                            p: 2,
                            borderRadius: '12px'
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={value || false}
                                    onChange={(e) => handleChange(column.field, e.target.checked)}
                                    disabled={!isEditing}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#000',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            },
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#000',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body1" color="text.primary">
                                    {column.headerName}
                                </Typography>
                            }
                        />
                    </Paper>
                );
            case 'date':
                return (
                    <TextField
                        {...commonProps}
                        label={column.headerName}
                        type="date"
                        value={value || ''}
                        onChange={(e) => handleChange(column.field, e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                );
            case 'time':
                return (
                    <TextField
                        {...commonProps}
                        label={column.headerName}
                        type="time"
                        value={value || ''}
                        onChange={(e) => handleChange(column.field, e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                );
            case 'number':
                return (
                    <TextField
                        {...commonProps}
                        label={column.headerName}
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleChange(column.field, e.target.value)}
                    />
                );
            default:
                return (
                    <TextField
                        {...commonProps}
                        label={column.headerName}
                        value={value || ''}
                        onChange={(e) => handleChange(column.field, e.target.value)}
                    />
                );
        }
    };

    if (!columns || columns.length === 0) {
        return (
            <div className="list">
                <SideBar />
                <div className="list-container">
                    <NavBar />
                    <Box className="edit-page">
                        <Paper className="edit-container" elevation={0}>
                            <Typography variant="h5" color="error">
                                Ошибка: данные не загружены
                            </Typography>
                        </Paper>
                    </Box>
                </div>
            </div>
        );
    }

    return (
        <div className="list">
            <SideBar />
            <div className="list-container">
                <NavBar />
                <div className="page-content">
                    <Paper 
                        className="edit-container" 
                        elevation={0}
                        sx={{
                            borderRadius: '32px',
                            overflow: 'hidden'
                        }}
                    >
                        <Box className="edit-header">
                            <IconButton 
                                onClick={handleBack} 
                                className="back-button"
                                sx={{ mr: 2 }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                Редактирование
                            </Typography>
                        </Box>
                        
                        <form onSubmit={handleSubmit} className="edit-form">
                            <Box className="form-fields">
                                {columns.map(column => renderField(column))}
                            </Box>
                            
                            <Box className="button-container">
                                {!isEditing ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleEdit}
                                        className="edit-button"
                                        startIcon={<EditIcon />}
                                        sx={{
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            px: 4
                                        }}
                                    >
                                        Редактировать
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setIsEditing(false)}
                                            className="cancel-button"
                                            startIcon={<CancelIcon />}
                                            sx={{
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                px: 4
                                            }}
                                        >
                                            Отмена
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            className="save-button"
                                            startIcon={<SaveIcon />}
                                            sx={{
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                px: 4,
                                                ml: 2
                                            }}
                                        >
                                            Сохранить
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </form>
                    </Paper>
                </div>
            </div>
        </div>
    );
};

export default EditPage; 