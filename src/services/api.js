import axios from "axios";

// Substitua pelo IP da máquina onde a API está rodando
const API_URL = 'http://192.168.200.140'; 
const API_PORTA = '3334';

const api = axios.create({
  baseURL: `${API_URL}:${API_PORTA}`
});

export default api;