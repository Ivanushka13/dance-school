import React, { useState } from 'react';
import { TextField, Button, Switch, FormControlLabel } from '@mui/material';
import SideBar from '../SideBar/SideBar';
import NavBar from '../NavBar/NavBar';
import './AddPage.css';

const AddPage = ({ title, Icon, fields, onSubmit, onCancel, initialValues = {} }) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

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
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = 'Это поле обязательно для заполнения';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Ошибка при создании записи:', error);
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
                    <form onSubmit={handleSubmit} className="form-grid">
                        {fields.map((field) => (
                            <div key={field.name} className="form-field">
                                {field.type === 'switch' ? (
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
                                ) : (
                                    <TextField
                                        label={field.label}
                                        type={field.type || 'text'}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]}
                                        required={field.required}
                                        fullWidth
                                        size="small"
                                    />
                                )}
                            </div>
                        ))}
                        <div className="form-actions">
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                className="back-button"
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="submit-button"
                            >
                                Создать
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPage; 