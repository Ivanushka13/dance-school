import React, { useState } from 'react';
import SideBar from '../SideBar/SideBar';
import NavBar from '../NavBar/NavBar';
import './AddPage.css';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Checkbox, 
    FormControlLabel, 
    Switch,
    RadioGroup, 
    Radio, 
    FormLabel, 
    FormGroup,
    InputAdornment,
    Button,
    Box,
    Paper,
    Typography,
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
        switch (field.type) {
            case 'switch':
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!formData[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                                color="primary"
                            />
                        }
                        label={field.label}
                    />
                );
                
            case 'select':
                return (
                    <FormControl 
                        fullWidth 
                        variant="outlined" 
                        error={!!errors[field.name]}
                        required={field.required}
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
                        {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
                    </FormControl>
                );
                
            case 'date':
                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        type="date"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        required={field.required}
                    />
                );
                
            case 'time':
                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        type="time"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        required={field.required}
                    />
                );
                
            case 'datetime':
            case 'datetime-local':
                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        type="datetime-local"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        required={field.required}
                    />
                );
                
            case 'radio':
                return (
                    <FormControl component="fieldset" error={!!errors[field.name]}>
                        <FormLabel component="legend">{field.label}{field.required && '*'}</FormLabel>
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
                                    control={<Radio />}
                                    label={option.label}
                                />
                            ))}
                        </RadioGroup>
                        {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
                    </FormControl>
                );
                
            case 'checkbox':
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!formData[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                                color="primary"
                            />
                        }
                        label={field.label}
                    />
                );
                
            case 'number':
                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        type="number"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        variant="outlined"
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        required={field.required}
                        InputProps={field.adornment ? {
                            startAdornment: (
                                <InputAdornment position="start">
                                    {field.adornment}
                                </InputAdornment>
                            ),
                        } : undefined}
                    />
                );
                
            default:
                return (
                    <TextField
                        fullWidth
                        label={field.label}
                        type={field.type || 'text'}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        variant="outlined"
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        required={field.required}
                        multiline={field.multiline}
                        rows={field.multiline ? (field.rows || 4) : undefined}
                    />
                );
        }
    };

    return (
        <div className="add-page">
            <SideBar />
            <div className="add-page-container">
                <NavBar />
                <div className="add-page-content">
                    <div className="page-header">
                        <div className="header-content">
                            {Icon && <div className="header-icon"><Icon /></div>}
                            <div className="header-text">
                                <h1>{title}</h1>
                            </div>
                        </div>
                    </div>
                    
                    <Paper elevation={2} className="form-paper">
                        <form onSubmit={handleSubmit} className="form-container">
                            <div className="form-fields">
                                {fields.map((field) => (
                                    <div key={field.name} className={`form-field-container ${field.multiline ? 'full-width' : ''}`}>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>
                            
                            <Box className="form-actions">
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={onCancel}
                                    startIcon={<ArrowBackIcon />}
                                    size="large"
                                    className="add-page-action-button add-page-back-button"
                                    disabled={isSubmitting}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<SaveIcon />}
                                    size="large"
                                    className="add-page-action-button add-page-submit-button"
                                    style={{ backgroundColor: '#333' }}
                                    disabled={isSubmitting}
                                >
                                    Создать
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </div>
            </div>
        </div>
    );
};

export default AddPage; 