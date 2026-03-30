import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservaContext = createContext();

export function ReservaProvider({ children }) {
    const [qtdReservas, setQtdReservas] = useState(0);
    const [userId, setUserId] = useState(null);

    // Carrega o ID do usuário ao abrir o app
    useEffect(() => {
        async function loadUser() {
            const userData = await AsyncStorage.getItem('usuario_info');
            if (userData) {
                const usuario = JSON.parse(userData);
                setUserId(usuario.usu_id || usuario.id);
            }
        }
        loadUser();
    }, []);

    // Função que busca os dados na API
    const atualizarBadge = async (idParaBuscar) => {
        // Usa o ID passado ou o que está no estado
        const id = idParaBuscar || userId;
        if (!id) return;

        try {
            // VERIFIQUE SE O IP E PORTA ESTÃO CERTOS
            const url = `http://10.101.130.164:3334/reservas/usuario/${id}`;
            const response = await axios.get(url);
            
            let lista = [];
            if (response.data && Array.isArray(response.data.dados)) {
                lista = response.data.dados;
            } else if (Array.isArray(response.data)) {
                lista = response.data;
            }

            // --- A CORREÇÃO ESTÁ AQUI ---
            // O Backend manda TUDO (para o histórico).
            // O Frontend FILTRA só o que está ativo para o Badge.
            const pedidosAtivos = lista.filter(item => 
                item.status === 'PENDENTE' || item.status === 'CONFIRMADO'
            );

            console.log(`[BADGE] Total Histórico: ${lista.length} | Ativos: ${pedidosAtivos.length}`);
            
            setQtdReservas(pedidosAtivos.length);

        } catch (error) {
            console.log("Erro ao atualizar badge:", error.message);
        }
    };

    // --- AUTO-REFRESH (POLLING) ---
    // Confere a cada 5 segundos se a farmácia mudou o status
    useEffect(() => {
        if (userId) {
            atualizarBadge(userId); // Busca na hora que carrega

            const intervalo = setInterval(() => {
                atualizarBadge(userId);
            }, 5000); // 5000ms = 5 segundos

            return () => clearInterval(intervalo);
        }
    }, [userId]);

    return (
        <ReservaContext.Provider value={{ qtdReservas, atualizarBadge, setUserId }}>
            {children}
        </ReservaContext.Provider>
    );
}

export function useReserva() {
    return useContext(ReservaContext);
}