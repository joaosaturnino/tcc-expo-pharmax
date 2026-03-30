import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Alert, Vibration, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av'; 
import api from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const pedidosRef = useRef([]);
  const isRunning = useRef(false);

  // --- FUNÇÃO PARA TOCAR SOM (LOCAL) ---
  const playSound = async () => {
    try {
      // 1. Configura o Áudio para prioridade máxima
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,      // Toca mesmo se o iPhone estiver no mudo
        staysActiveInBackground: true,   // Toca se o app estiver em segundo plano
        shouldDuckAndroid: true,         // Baixa o volume de música se tiver tocando
        playThroughEarpieceAndroid: false
      });

      // 2. Carrega e Toca o Arquivo Local
      // O 'require' garante que o som já está no celular, sem delay de internet
      const { sound } = await Audio.Sound.createAsync(
        require('../../public/sounds/success.mp3'), 
        { shouldPlay: true, volume: 1.0 }
      );

      // 3. Limpa a memória após tocar
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
        }
      });

    } catch (error) {
      console.log("❌ Erro ao tocar som:", error);
      // Se der erro (arquivo não encontrado), tenta vibrar mais forte como fallback
      Vibration.vibrate(1000); 
    }
  };

  // --- DISPARAR ALERTA ---
  const dispararAlerta = (titulo, mensagem) => {
    // 1. Toca Som
    playSound();

    // 2. Vibração Intensa
    if (Platform.OS === 'android') {
      // Espera 0ms, Vibra 500ms, Pausa 200ms, Vibra 500ms
      Vibration.vibrate([0, 500, 200, 500]); 
    } else {
      Vibration.vibrate(); 
    }

    // 3. Alerta Visual
    Alert.alert(titulo, mensagem, [{ text: "OK" }]);
  };

  // --- VERIFICAR MUDANÇAS ---
  const verificarMudancaDeStatus = (antigos, novos) => {
    if (!antigos || antigos.length === 0) return;

    novos.forEach(novoPedido => {
      const pedidoAntigo = antigos.find(p => String(p.id || p.reserva_id) === String(novoPedido.id || novoPedido.reserva_id));
      
      if (pedidoAntigo && pedidoAntigo.status !== novoPedido.status) {
        
        console.log(`🔔 Mudança detectada: ${novoPedido.id} (${novoPedido.status})`);

        if (novoPedido.status === 'CONFIRMADO') {
            dispararAlerta(
                "Pedido Aceito! ✅", 
                `A farmácia confirmou o medicamento:\n${novoPedido.medicamento_nome}\n\nPode ir buscar!`
            );
        } 
        else if (novoPedido.status === 'RETIRADO') {
            dispararAlerta(
                "Pedido Entregue 🛍️", 
                `Retirada confirmada:\n${novoPedido.medicamento_nome}`
            );
        }
        else if (novoPedido.status === 'CANCELADO') {
            dispararAlerta(
                "Pedido Cancelado ❌", 
                `Item cancelado:\n${novoPedido.medicamento_nome}`
            );
        }
      }
    });
  };

  // --- POLLING ---
  const checkReservas = async () => {
    if (isRunning.current) return;
    isRunning.current = true;

    try {
      const userDataJson = await AsyncStorage.getItem('usuario_info');
      if (!userDataJson) { isRunning.current = false; return; }

      const user = JSON.parse(userDataJson);
      const userId = user.usu_id || user.id;
      if (!userId) { isRunning.current = false; return; }

      const response = await api.get(`/reservas/usuario/${userId}`);

      if (response.data.sucesso) {
        const novosPedidos = response.data.dados;
        verificarMudancaDeStatus(pedidosRef.current, novosPedidos);
        pedidosRef.current = novosPedidos;
      }
    } catch (error) {
      // console.log("Polling error");
    } finally {
      isRunning.current = false;
    }
  };

  useEffect(() => {
    checkReservas();
    const interval = setInterval(checkReservas, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ playSound }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);