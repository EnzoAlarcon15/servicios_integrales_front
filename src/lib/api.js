import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  // Puedes agregar headers comunes aquí si los necesitas
});

export default api;