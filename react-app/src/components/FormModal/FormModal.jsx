import React, { useState, useEffect } from 'react';
import './FormModal.css';

function FormModal({ title, onClose, onSave, initialData, fields }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const processedData = { ...initialData };
      fields.forEach(field => {
        if (field.name === 'measurement_time' && initialData[field.name]) {
          const date = new Date(initialData[field.name]);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          processedData[field.name] = `${year}-${month}-${day}`;
        }
      });
      setFormData(processedData);
    } else {
      const newFormData = {};
      fields.forEach(field => {
        if (field.name === 'measurement_time') {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          newFormData[field.name] = `${year}-${month}-${day}`;
        } else {
          newFormData[field.name] = '';
        }
      });
      setFormData(newFormData);
    }
  }, [initialData, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    if (name === 'measurement_time' && value) {
      if (value.includes('/')) {
        const [month, day, year] = value.split('/');
        finalValue = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else {
        finalValue = value;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} обов'язкове`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = { ...formData };
      if (submitData.measurement_time) {
        submitData.measurement_time = new Date(submitData.measurement_time).toISOString();
      }
      onSave(submitData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {fields.map(field => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                step={field.step}
                pattern={field.pattern}
                placeholder={field.placeholder}
                required={field.required}
                className={errors[field.name] ? 'input-error' : ''}
              />
              {errors[field.name] && (
                <span className="error-text">{errors[field.name]}</span>
              )}
            </div>
          ))}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Скасувати
            </button>
            <button type="submit" className="btn-primary">
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModal;
