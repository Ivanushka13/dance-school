import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  FormControl,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { MdError } from 'react-icons/md';
import 'dayjs/locale/ru';
import './ModalForm.css';

const ModalForm = ({
  open,
  onClose,
  title,
  createFields,
  editFields,
  onSubmit,
  initialValues = {},
  isEdit = false
}) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = isEdit ? editFields : createFields;

  useEffect(() => {
    const initialFormValues = {};
    if (fields && fields.length > 0) {
      fields.forEach(field => {
        if (field.field !== 'id' && field.field !== 'actions') {
          if (field.type === 'datetime' || field.type === 'time') {
            const value = initialValues[field.field];
            initialFormValues[field.field] = value
              ? dayjs(value, ['YYYY-MM-DDTHH:mm:ss.SSSZ', 'HH:mm:ssZ', 'HH:mm:ss'])
              : null;
          } else {
            initialFormValues[field.field] = initialValues[field.field] !== undefined ? initialValues[field.field] : '';
          }
        }
      });
    }
    setFormValues(initialFormValues);
    setErrors({});
  }, [fields, initialValues, open, isEdit]);

  const handleChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (fields && fields.length > 0) {
      fields.forEach(field => {
        if (field.field !== 'id' && field.field !== 'actions') {
          const value = formValues[field.field];

          if (field.required && (value === undefined || value === null || value === '')) {
            newErrors[field.field] = 'Поле обязательно для заполнения';
          }

          if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
            newErrors[field.field] = 'Введите корректный email';
          }

          if (field.type === 'phone' && value && !/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(value)) {
            newErrors[field.field] = 'Введите корректный номер телефона';
          }

          if (field.type === 'password' && value && value.length < 8) {
            newErrors[field.field] = 'Пароль должен содержать минимум 8 символов';
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const preparedValues = { ...formValues };

      if (fields && fields.length > 0) {
        fields.forEach(field => {
          const fieldName = field.field;

          if (field.type === 'datetime' && preparedValues[fieldName]) {
            preparedValues[fieldName] = preparedValues[fieldName].format('YYYY-MM-DDTHH:mm:ss.SSS');
          }
          if (field.type === 'time' && preparedValues[fieldName]) {
            preparedValues[fieldName] = preparedValues[fieldName].format('HH:mm:ss');
          }

          if (isEdit) {
            let currentValue = preparedValues[fieldName];
            let originalValue = initialValues[fieldName];

            if (field.type === 'datetime' && originalValue) {
              originalValue = dayjs(originalValue).format('YYYY-MM-DDTHH:mm:ss.SSS');
            }
            if (field.type === 'time' && originalValue) {
              originalValue = dayjs(originalValue).format('HH:mm:ss');
            }

            if (field.type === 'boolean') {
              currentValue = !!currentValue;
              originalValue = !!originalValue;
            }

            if (currentValue === originalValue ||
                (currentValue === '' && originalValue === undefined) ||
                (currentValue === undefined && originalValue === '')) {
              delete preparedValues[fieldName];
            }
          }
        });
      }

      onSubmit(preparedValues, isEdit ? initialValues.id : null);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderField = (field) => {
    if (!field || field.field === 'id' || field.field === 'actions') {
      return null;
    }

    const errorMessage = errors[field.field] || '';
    const hasError = !!errorMessage;

    const errorContent = hasError ? (
      <React.Fragment>
        <MdError className="modal-form-error-icon" />
        {errorMessage}
      </React.Fragment>
    ) : '';

    switch (field.type) {
      case 'datetime':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DateTimePicker
              name='datepicker'
              label={field.headerName}
              value={formValues[field.field] || dayjs()}
              onChange={(newValue) => handleChange(field.field, newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: hasError,
                  helperText: errorContent,
                  className: 'modal-form-datetime-field'
                }
              }}
              className="modal-form-field"
            />
          </LocalizationProvider>
        );

      case 'time':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <TimePicker
              name='timepicker'
              label={field.headerName}
              value={formValues[field.field] || dayjs()}
              onChange={(newValue) => handleChange(field.field, newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: hasError,
                  helperText: errorContent,
                  className: 'modal-form-time-field'
                }
              }}
              className="modal-form-field"
            />
          </LocalizationProvider>
        );

      case 'password':
        return (
          <TextField
            name='password'
            fullWidth
            margin="normal"
            label={field.headerName}
            type={showPassword[field.field] ? 'text' : 'password'}
            value={formValues[field.field] || ''}
            onChange={(e) => handleChange(field.field, e.target.value)}
            error={hasError}
            helperText={errorContent}
            className="modal-form-field"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility(field.field)}
                    edge="end"
                  >
                    {showPassword[field.field] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        );

      case 'email':
        return (
          <TextField
            name='email'
            fullWidth
            margin="normal"
            label={field.headerName}
            type="email"
            value={formValues[field.field] || ''}
            onChange={(e) => handleChange(field.field, e.target.value)}
            error={hasError}
            helperText={errorContent}
            className="modal-form-field"
          />
        );

      case 'phone':
        return (
          <TextField
            name='phone'
            fullWidth
            margin="normal"
            label={field.headerName}
            type="tel"
            value={formValues[field.field] || ''}
            onChange={(e) => handleChange(field.field, e.target.value)}
            error={hasError}
            helperText={errorContent}
            className="modal-form-field"
          />
        );

      case 'boolean':
        return (
          <FormControl
            name='switch-control'
            fullWidth
            margin="normal"
            error={hasError}
            className="modal-form-checkbox-field"
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ padding: '8px 12px' }}>
              <Typography variant="body1" color="text.primary">
                {field.headerName}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    name='switch'
                    checked={!!formValues[field.field]}
                    onChange={(e) => handleChange(field.field, e.target.checked)}
                    color="primary"
                    className="modal-form-switch"
                  />
                }
                label=""
                labelPlacement="start"
              />
            </Box>
            {hasError && (
              <FormHelperText>
                <MdError className="modal-form-error-icon" />
                {errorMessage}
              </FormHelperText>
            )}
          </FormControl>
        );

      default:
        return (
          <TextField
            name='field'
            fullWidth
            margin="normal"
            label={field.headerName}
            type="text"
            value={formValues[field.field] || ''}
            onChange={(e) => handleChange(field.field, e.target.value)}
            error={hasError}
            helperText={errorContent}
            className="modal-form-field"
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
      fullWidth
      className="modal-form-dialog"
      PaperProps={{
        className: 'modal-form-paper'
      }}
    >
      <DialogTitle id="form-dialog-title" className="modal-form-title">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h6" component="div" className="modal-form-title-text" align="center">
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            className="modal-form-close-button"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers className="modal-form-content">
        {fields && fields.length > 0 ? (
          fields.map((field) => (
            <Box key={field.field}>
              {renderField(field)}
            </Box>
          ))
        ) : (
          <Typography variant="body1" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Поля для формы не найдены
          </Typography>
        )}
      </DialogContent>

      <DialogActions className="modal-form-actions" sx={{ justifyContent: 'center', padding: '16px' }}>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          className="modal-form-cancel-button"
          disabled={isSubmitting}
        >
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          className="modal-form-submit-button"
          startIcon={<CheckCircleIcon />}
          disabled={isSubmitting}
        >
          {isEdit ? "Сохранить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  createFields: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool
    })
  ),
  editFields: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool
};

export default ModalForm;