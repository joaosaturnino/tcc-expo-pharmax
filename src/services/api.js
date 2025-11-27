import axios from "axios";

// --- CONFIGURAÇÃO DO IP ---
// IMPORTANTE: No React Native (especialmente Android), você NÃO pode usar 'localhost'.
// O celular/emulador não entende 'localhost' como sendo o seu computador.
// Você DEVE usar o endereço IPv4 da sua máquina na rede Wi-Fi.

// Como descobrir seu IP:
// Windows: Abra o CMD e digite 'ipconfig' (procure por Endereço IPv4)
// Mac/Linux: Abra o Terminal e digite 'ifconfig'

const SEU_IP = '172.16.0.34'; // <--- ATENÇÃO: Verifique se este número mudou hoje!
const PORTA = '3334';

const api = axios.create({
    // Monta a URL base: http://192.168.200.27:3334
    baseURL: `http://${SEU_IP}:${PORTA}`,

    // Timeout: Define um limite de tempo (em milissegundos).
    // Se a API não responder em 10 segundos, o App cancela e avisa o erro.
    // Isso evita que o aplicativo fique travado ("congelado") eternamente.
    timeout: 10000,
});

export default api;