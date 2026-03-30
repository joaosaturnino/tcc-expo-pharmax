import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl, 
  SafeAreaView,
  StatusBar,
  Alert,
  Vibration,
  Platform,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native';

// 1. IMPORTAR O CONTEXTO
import { useReserva } from '../../contexts/ReservaContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  background: '#F3F4F6', 
  card: '#FFFFFF',
  primary: '#458B00',
  textDark: '#111827',
  textLight: '#6B7280',
  orange: '#F59E0B',
  green: '#10B981',
  red: '#EF4444',
  blue: '#3B82F6',
  gray: '#9CA3AF'
};

const SkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <View style={{height: 120, backgroundColor: '#E5E7EB', borderRadius: 8, marginBottom: 10}} />
    <View style={{height: 50, backgroundColor: '#E5E7EB', borderRadius: 4}} />
  </View>
);

export default function MeusPedidosScreen() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const pedidosRef = useRef([]);

  // 2. USAR O HOOK DO CONTEXTO
  const { atualizarBadge } = useReserva();

  const formatCurrency = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  const formatDate = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const copiarProtocolo = () => {
    Vibration.vibrate(50);
    Alert.alert("Sucesso", "Protocolo copiado!");
  };

  const fetchPedidos = async (silent = false) => { 
    try {
      if (!silent) setLoading(true);
      const userDataJson = await AsyncStorage.getItem('usuario_info');
      const user = JSON.parse(userDataJson);
      
      const response = await api.get(`/reservas/usuario/${user.usu_id || user.id}`);
      
      if (response.data.sucesso) {
        if (!loading) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setPedidos(response.data.dados);

        // 3. SINCRONIA: Sempre que buscar a lista, atualiza o badge também
        atualizarBadge(user.usu_id || user.id);
      }
    } catch (error) { console.log('Erro API'); } 
    finally { if (!silent) setLoading(false); setRefreshing(false); }
  };

  const handleAction = (id, type) => {
    const isCancel = type === 'cancel';
    const title = isCancel ? "Cancelar Pedido" : "Excluir Registro";
    const message = isCancel ? "Deseja realmente cancelar?" : "Apagar do seu histórico? (A farmácia ainda verá o registro)";

    Alert.alert(title, message, [
      { text: "Não", style: "cancel" },
      { 
        text: "Sim", 
        style: 'destructive', 
        onPress: async () => {
          try {
            const userDataJson = await AsyncStorage.getItem('usuario_info');
            const user = JSON.parse(userDataJson);
            const userId = user.usu_id || user.id;

            if (isCancel) {
                await api.put(`/reservas/${id}/status`, { status: 'CANCELADO' });
            } else {
                await api.delete(`/reservas/${id}`, { data: { parte: 'usuario' } });
            }
            
            // Atualiza a lista e o badge imediatamente após a ação
            fetchPedidos(true); 

          } catch (e) { 
              Alert.alert("Erro", "Não foi possível realizar a ação."); 
          }
        }
      }
    ]);
  };

  // 4. AUTO-ATUALIZAÇÃO MAIS RÁPIDA (5 segundos)
  useFocusEffect(
    useCallback(() => {
        fetchPedidos(); // Busca assim que a tela abre
        
        // Define o intervalo para 5000ms (5 segundos)
        const i = setInterval(() => {
            fetchPedidos(true); // true = modo silencioso (sem loading spinner)
        }, 5000); 
        
        return () => clearInterval(i);
    }, [])
  );

  const onRefresh = useCallback(() => { setRefreshing(true); fetchPedidos(false); }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDENTE': return COLORS.orange;
      case 'CONFIRMADO': return COLORS.primary;
      case 'RETIRADO': return COLORS.green; 
      case 'CANCELADO': return COLORS.red;
      default: return COLORS.gray;
    }
  };

  const getStatusLabel = (status) => {
    const labels = { PENDENTE: 'Pendente', CONFIRMADO: 'Aprovado', RETIRADO: 'Retirado', CANCELADO: 'Cancelado' };
    return labels[status] || status;
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const statusLabel = getStatusLabel(item.status);
    const isActive = ['PENDENTE', 'CONFIRMADO'].includes(item.status);
    const id = item.id || item.reserva_id;

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardTop}>
            <View style={styles.headerRow}>
                <View style={styles.pharmacyContainer}>
                    <Ionicons name="storefront" size={18} color={COLORS.textLight} style={{marginRight: 6}} />
                    <Text style={styles.pharmacyName}>{item.farmacia_nome}</Text>
                </View>
                <View style={[styles.statusBadge, { borderColor: statusColor }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                </View>
            </View>

            <Text style={styles.dateText}>{formatDate(item.data_reserva)}</Text>

            <View style={styles.medInfo}>
                <Text style={styles.medName}>{item.medicamento_nome}</Text>
                <Text style={styles.medDetail}>{item.dosagem} • {item.quantidade} unidade(s)</Text>
            </View>

            <Text style={styles.priceText}>{formatCurrency(item.valor_total)}</Text>
        </View>

        <View style={styles.dashedContainer}>
            <View style={styles.circleLeft} />
            <View style={styles.dashLine} />
            <View style={styles.circleRight} />
        </View>

        <View style={styles.cardBottom}>
            {isActive && item.protocolo ? (
                <View style={styles.activeFooter}>
                    <TouchableOpacity onPress={copiarProtocolo} style={styles.protocolBox}>
                        <Text style={styles.protocolLabel}>PROTOCOLO</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.protocolValue}>{item.protocolo}</Text>
                            <Ionicons name="copy-outline" size={18} color={COLORS.textLight} style={{marginLeft: 8}} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleAction(id, 'cancel')} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.inactiveFooter}>
                    <View style={styles.inactiveStatus}>
                        <Ionicons name={item.status === 'RETIRADO' ? "checkmark-circle" : "close-circle"} size={20} color={COLORS.textLight} />
                        <Text style={styles.inactiveText}>Pedido finalizado</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleAction(id, 'delete')} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={18} color={COLORS.textLight} />
                        <Text style={styles.deleteButtonText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Minhas Reservas</Text>
      </View>

      {loading && !refreshing ? (
        <View style={{padding:20}}>
            <SkeletonCard /><SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          keyExtractor={(item) => (item.id || item.reserva_id).toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
                <Ionicons name="ticket-outline" size={50} color="#D1D5DB" />
                <Text style={styles.emptyText}>Nenhuma reserva ativa.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 20, paddingBottom: 15 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textDark },
  list: { paddingHorizontal: 20, paddingBottom: 80 },
  cardContainer: { backgroundColor: COLORS.card, borderRadius: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, overflow: 'hidden' },
  cardTop: { padding: 18 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  pharmacyContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  pharmacyName: { fontSize: 16, fontWeight: '600', color: COLORS.textDark }, 
  dateText: { fontSize: 12, color: COLORS.textLight, marginBottom: 12 }, 
  statusBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  medInfo: { marginBottom: 12 },
  medName: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 4 }, 
  medDetail: { fontSize: 14, color: COLORS.textLight }, 
  priceText: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, alignSelf: 'flex-end' },
  dashedContainer: { flexDirection: 'row', alignItems: 'center', height: 1, overflow: 'visible' },
  circleLeft: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.background, marginLeft: -8 },
  dashLine: { flex: 1, height: 1, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 1 },
  circleRight: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.background, marginRight: -8 },
  cardBottom: { padding: 16, backgroundColor: '#F9FAFB' },
  activeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  protocolBox: { flex: 1, marginRight: 12, justifyContent: 'center' },
  protocolLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: 'bold', letterSpacing: 0.5 },
  protocolValue: { fontSize: 15, color: COLORS.textDark, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginTop: 2 },
  cancelButton: { backgroundColor: '#FEF2F2', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#FCA5A5' },
  cancelButtonText: { color: COLORS.red, fontSize: 13, fontWeight: '700' },
  inactiveFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inactiveStatus: { flexDirection: 'row', alignItems: 'center', opacity: 0.7 },
  inactiveText: { marginLeft: 6, color: COLORS.textLight, fontSize: 14 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  deleteButtonText: { marginLeft: 4, color: COLORS.textLight, fontSize: 13 },
  skeletonCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, marginBottom: 16 },
  emptyState: { alignItems: 'center', marginTop: 60, opacity: 0.5 },
  emptyText: { marginTop: 10, fontSize: 15, color: COLORS.textDark },
});