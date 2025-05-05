import React, { useState } from 'react';
import SideBar from '../SideBar/SideBar';
import NavBar from '../NavBar/NavBar';
import './AddPage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    FormControlLabel, 
    Switch,
    RadioGroup, 
    Radio, 
    FormLabel, 
    Button,
    Box,
    Paper,
    Typography,
    Container,
    IconButton,
    Grid,
    Chip,
    Divider
} from '@mui/material';

const AddPage = ({ title, Icon, fields, onSubmit, onCancel, initialValues = {} }) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        fields.forEach(field => {
            if (field.required && (formData[field.name] === undefined || formData[field.name] === null || formData[field.name] === '')) {
                newErrors[field.name] = 'Это поле обязательно для заполнения';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
        } catch (error) {
            console.error('Ошибка при создании записи:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (field) => {
        const commonProps = {
            fullWidth: true,
            margin: "normal",
            size: "medium",
            className: "add-page-text-field",
            required: field.required,
            error: !!errors[field.name],
            helperText: errors[field.name],
            label: field.label,
            value: formData[field.name] || '',
            onChange: (e) => handleChange(field.name, e.target.value),
            sx: {
                '& .MuiInputBase-root': {
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.3s ease'
                },
                '& .MuiInputLabel-root': {
                    color: 'text.primary'
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease'
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.7)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#000',
                        borderWidth: '1.5px'
                    }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000'
                }
            }
        };
        
        switch (field.type) {
            case 'switch':
                return (
                    <Paper 
                        elevation={0} 
                        className="add-page-field-paper"
                        sx={{ 
                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                            p: 2,
                            borderRadius: '14px',
                            border: '1px solid',
                            borderColor: 'rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    className="add-page-switch"
                                    checked={!!formData[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.checked)}
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
                                <Typography variant="body1" color="text.primary" fontWeight={500}>
                                    {field.label}
                                </Typography>
                            }
                        />
                    </Paper>
                );
                
            case 'select':
                return (
                    <FormControl 
                        fullWidth 
                        variant="outlined" 
                        error={!!errors[field.name]}
                        required={field.required}
                        className="add-page-text-field"
                        margin="normal"
                        sx={commonProps.sx}
                    >
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            label={field.label}
                        >
                            <MenuItem value="">
                                <em>Выберите...</em>
                            </MenuItem>
                            {field.options?.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors[field.name] && <div className="add-page-error-message">{errors[field.name]}</div>}
                    </FormControl>
                );
                
            case 'date':
                return (
                    <TextField
                        {...commonProps}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                );
                
            case 'time':
                return (
                    <TextField
                        {...commonProps}
                        type="time"
                        InputLabelProps={{ shrink: true }}
                    />
                );
                
            case 'datetime':
            case 'datetime-local':
                return (
                    <TextField
                        {...commonProps}
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                    />
                );
                
            case 'radio':
                return (
                    <FormControl component="fieldset" error={!!errors[field.name]} className="add-page-radio-field">
                        <FormLabel component="legend" sx={{ fontWeight: 500, color: 'rgba(0, 0, 0, 0.7)' }}>
                            {field.label}{field.required && '*'}
                        </FormLabel>
                        <RadioGroup
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            row={field.row}
                        >
                            {field.options?.map(option => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={
                                        <Radio 
                                            className="add-page-radio"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#000',
                                                }
                                            }}
                                        />
                                    }
                                    label={option.label}
                                />
                            ))}
                        </RadioGroup>
                        {errors[field.name] && <div className="add-page-error-message">{errors[field.name]}</div>}
                    </FormControl>
                );
                
            case 'checkbox':
                return (
                    <Paper 
                        elevation={0} 
                        className="add-page-field-paper"
                        sx={{ 
                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                            p: 2,
                            borderRadius: '14px',
                            border: '1px solid',
                            borderColor: 'rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    className="add-page-switch"
                                    checked={!!formData[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.checked)}
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
                                <Typography variant="body1" color="text.primary" fontWeight={500}>
                                    {field.label}
                                </Typography>
                            }
                        />
                    </Paper>
                );
                
            case 'number':
                return (
                    <TextField
                        {...commonProps}
                        type="number"
                    />
                );
                
            default:
                return (
                    <TextField
                        {...commonProps}
                        type={field.type || 'text'}
                        multiline={field.multiline}
                        rows={field.multiline ? (field.rows || 4) : undefined}
                    />
                );
        }
    };

    return (
        <div className="list">
            <SideBar />
            <div className="list-container">
                <NavBar />
                <div className="page-content">
                    <Container maxWidth="lg">
                        <Paper 
                            className="add-page-container" 
                            elevation={0}
                            sx={{
                                borderRadius: '24px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06) !important',
                                border: '1px solid rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <Box className="add-page-header">
                                <IconButton 
                                    onClick={onCancel} 
                                    className="add-page-back-button"
                                    sx={{ mr: 2 }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                                <div className="add-page-header-content">
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        {title}
                                    </Typography>
                                </div>
                                <Chip 
                                    label="Создание" 
                                    variant="outlined" 
                                    size="small" 
                                    sx={{ ml: 'auto', borderRadius: '10px' }}
                                />
                            </Box>
                            
                            <form onSubmit={handleSubmit} className="add-page-form">
                                <div className="add-page-fields">
                                    <Grid container spacing={3}>
                                        {fields.map((field) => (
                                            <Grid 
                                                item 
                                                xs={12} 
                                                md={field.multiline || field.fullWidth ? 12 : 6} 
                                                key={field.name}
                                            >
                                                {renderField(field)}
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                                
                                <div className="add-page-button-container">
                                    <Button
                                        variant="outlined"
                                        onClick={onCancel}
                                        className="add-page-cancel-button"
                                        disabled={isSubmitting}
                                        startIcon={<ArrowBackIcon />}
                                    >
                                        ОТМЕНА
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="add-page-save-button"
                                        disabled={isSubmitting}
                                        startIcon={<SaveIcon />}
                                    >
                                        СОЗДАТЬ
                                    </Button>
                                </div>
                            </form>
                        </Paper>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default AddPage; 