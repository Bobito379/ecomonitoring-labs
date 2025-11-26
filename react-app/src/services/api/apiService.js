const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    throw new Error(`Помилка завантаження даних: ${error.message}`);
  }
};

export const createData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Помилка створення: ${error.message}`);
  }
};

export const updateData = async (endpoint, id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Помилка оновлення: ${error.message}`);
  }
};

export const deleteData = async (endpoint, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Помилка видалення: ${error.message}`);
  }
};
