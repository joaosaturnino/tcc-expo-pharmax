import axios from "axios";

// Substitua pelo IP da máquina onde a API está rodando
// const API_URL = 'http://10.67.23.36';
const API_URL = 'http://10.67.23.35';
const API_PORTA = '3334';

const api = axios.create({
  baseURL: `${API_URL}:${API_PORTA}`
});

export default api;