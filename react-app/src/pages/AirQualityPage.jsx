import React, { useState, useEffect } from 'react';
import { deleteData, createData, updateData, fetchData } from '../services/api/apiService';
import DataTable from '../components/DataTable/DataTable';
import FormModal from '../components/FormModal/FormModal';
import PrimaryButton from '../components/ui/PrimaryButton/PrimaryButton';

const ENDPOINT = '/air-quality';

const columns = [
  { key: '_id', label: 'ID' },
  { key: 'station_name', label: 'Назва станції' },
  { key: 'city_name', label: 'Місто' },
  { key: 'pm25', label: 'PM2.5 (мкг/м³)' },
  { key: 'pm10', label: 'PM10 (мкг/м³)' },
  { key: 'no2', label: 'NO₂ (мкг/м³)' },
  { key: 'measurement_time', label: 'Час вимірювання' }
];

const formFields = [
  { name: 'station_name', label: 'Назва станції', type: 'text', required: true },
  { name: 'city_name', label: 'Місто', type: 'text', required: true },
  { name: 'pm25', label: 'PM2.5 (мкг/м³)', type: 'number', required: true },
  { name: 'pm10', label: 'PM10 (мкг/м³)', type: 'number', required: true },
  { name: 'no2', label: 'NO₂ (мкг/м³)', type: 'number', required: true },
  { name: 'measurement_time', label: 'Дата вимірювання', type: 'date', required: true }
];

function AirQualityPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData(ENDPOINT);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей запис?')) {
      try {
        await deleteData(ENDPOINT, id);
        setData(data.filter(item => item._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingId) {
        await updateData(ENDPOINT, editingId, formData);
      } else {
        await createData(ENDPOINT, formData);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const editingData = editingId ? data.find(item => item._id === editingId) : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Якість повітря</h2>
        <PrimaryButton onClick={handleAddNew}>
          + Додати новий запис
        </PrimaryButton>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Завантаження...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={data}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {showModal && (
        <FormModal
          title={editingId ? 'Редагування запису' : 'Додавання нового запису'}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={editingData}
          fields={formFields}
        />
      )}
    </div>
  );
}

export default AirQualityPage;
