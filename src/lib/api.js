import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

const api = axios.create({
  baseURL,
  // Puedes agregar headers comunes aquí si los necesitas
});

export default api;