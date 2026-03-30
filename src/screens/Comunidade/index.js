import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
    View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, 
    TextInput, ActivityIndicator, Alert, SafeAreaView, StatusBar, RefreshControl, 
    KeyboardAvoidingView, Platform, LayoutAnimation, UIManager, Vibration, 
    TouchableWithoutFeedback, Share 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import styles from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ... (CONSTANTES DE CORES - Mantenha igual)
const COLORS = {
    primary: '#458B00',
    background: '#F8FAFC',   
    white: '#FFFFFF',
    textDark: '#1E293B',     
    textGray: '#64748B',     
    price: '#15803d',
    danger: '#EF4444',
    inputBg: '#F1F5F9',
    overlay: 'rgba(0,0,0,0.6)',
    tip: '#15803d',    
    doubt: '#1D4ED8',  
    alert: '#B45309',  
    locator: '#7E22CE',
    review: '#CA8A04',
    report: '#DC2626',
};

const SkeletonCard = () => (
    <View style={styles.cardSkeleton}>
        <View style={{width:'100%', height:100, backgroundColor:'#E2E8F0', borderRadius:12}} />
    </View>
);

export default function Comunidade() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [myUserId, setMyUserId] = useState(null);
    
    // Estados
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState('TODOS'); 
    const [menuOpen, setMenuOpen] = useState(false);
    const [postType, setPostType] = useState('DICA'); 
    const [modalVisible, setModalVisible] = useState(false);
    const [modalComentariosVisible, setModalComentariosVisible] = useState(false);
    
    // Form
    const [novoMedicamento, setNovoMedicamento] = useState('');
    const [novaFarmacia, setNovaFarmacia] = useState('');
    const [novoPreco, setNovoPreco] = useState('');
    const [novoTexto, setNovoTexto] = useState('');
    const [posting, setPosting] = useState(false);
    // Adicionado estado para nota (Avaliação)
    const [novaNota, setNovaNota] = useState(0);

    // Comentários
    const [postSelecionado, setPostSelecionado] = useState(null);
    const [listaComentarios, setListaComentarios] = useState([]);
    const [textoComentario, setTextoComentario] = useState('');
    const [loadingComentarios, setLoadingComentarios] = useState(false);
    const [enviandoComentario, setEnviandoComentario] = useState(false);

    // --- CORREÇÃO PRINCIPAL AQUI ---
    const fetchPosts = async (shouldAnimate = false) => {
        try {
            const userData = await AsyncStorage.getItem('usuario_info');
            const user = JSON.parse(userData);
            const userId = user.usu_id || user.id;
            setMyUserId(userId);

            const response = await api.get(`/comunidade?usuario_id=${userId}`);
            
            if (response.data.sucesso) {
                // Só anima se for explicitamente solicitado (ex: refresh)
                // Isso evita conflito na montagem inicial da tela
                if (shouldAnimate) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }
                setPosts(response.data.dados);
            }
        } catch (error) { 
            console.log("Erro API"); 
        } finally { 
            setLoading(false); 
            setRefreshing(false); 
        }
    };

    // UseCallback vazio para garantir que a função não mude
    useFocusEffect(
        useCallback(() => { 
            fetchPosts(false); // False para não animar na entrada (evita crash)
        }, [])
    );

    // --- FILTROS ---
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            if (activeFilter !== 'TODOS' && post.tipo !== activeFilter) return false;
            if (searchText) {
                const term = searchText.toLowerCase();
                return (
                    (post.medicamento_nome && post.medicamento_nome.toLowerCase().includes(term)) ||
                    (post.farmacia_nome && post.farmacia_nome.toLowerCase().includes(term)) ||
                    (post.texto && post.texto.toLowerCase().includes(term))
                );
            }
            return true;
        });
    }, [posts, searchText, activeFilter]);

    // --- AÇÕES ---
    const toggleMenu = () => {
        Vibration.vibrate(20);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setMenuOpen(!menuOpen);
    };

    const openModalWithType = (type) => {
        setPostType(type);
        setMenuOpen(false);
        limparFormularioPost();
        setModalVisible(true);
    };

    const handlePostar = async () => {
        if (!novoMedicamento.trim() && !novoTexto.trim()) return Alert.alert("Ops!", "Preencha os dados.");
        if (postType === 'AVALIACAO' && novaNota === 0) return Alert.alert("Nota", "Selecione uma nota.");

        setPosting(true);
        try {
            let textoFinal = novoTexto;
            // Tags visuais
            if (postType === 'DUVIDA') textoFinal = `[DÚVIDA] ${novoTexto}`;
            else if (postType === 'ALERTA') textoFinal = `[ALERTA] ${novoTexto}`;
            else if (postType === 'ONDE') textoFinal = `[ONDE?] ${novoTexto}`;
            else if (postType === 'AVALIACAO') textoFinal = `[AVALIAÇÃO] ${novoTexto}`;
            else if (postType === 'DENUNCIA') textoFinal = `[DENÚNCIA] ${novoTexto}`;

            if (postType === 'ALERTA') {
                const resAlert = await api.post('/alertas', {
                    usuario_id: myUserId,
                    termo_busca: novoMedicamento,
                    preco_alvo: parseFloat(novoPreco.replace(',', '.')) || 0
                });
                Alert.alert("Alerta Criado 🔔", resAlert.data.mensagem);
            } else {
                await api.post('/comunidade', {
                    usuario_id: myUserId,
                    medicamento_nome: novoMedicamento,
                    farmacia_nome: novaFarmacia,
                    preco: novoPreco ? parseFloat(novoPreco.replace(',', '.')) : null,
                    texto: textoFinal,
                    tipo: postType,
                    nota: postType === 'AVALIACAO' ? novaNota : null,
                    motivo: postType === 'DENUNCIA' ? novaFarmacia : null
                });
            }
            
            setModalVisible(false);
            limparFormularioPost();
            fetchPosts(true); // Aqui podemos animar pois é uma ação do usuário
        } catch (e) { Alert.alert("Erro ao enviar"); } 
        finally { setPosting(false); }
    };

    // --- HELPERS ---
    const handleLike = async (post) => {
        const isLiked = post.curtiu === 1;
        setPosts(c => c.map(p => p.id === post.id ? { ...p, curtiu: !isLiked ? 1 : 0, total_likes: !isLiked ? p.total_likes + 1 : p.total_likes - 1 } : p));
        try { await api.post(`/comunidade/${post.id}/like`, { usuario_id: myUserId }); } catch(e){}
    };

    const abrirComentarios = async (post) => {
        setPostSelecionado(post); setModalComentariosVisible(true); setLoadingComentarios(true);
        try { const res = await api.get(`/comunidade/${post.id}/comentarios`); if(res.data.sucesso) setListaComentarios(res.data.dados); } catch(e){} finally { setLoadingComentarios(false); }
    };

    const enviarComentario = async () => {
        if(!textoComentario.trim()) return; setEnviandoComentario(true);
        try { await api.post('/comunidade/comentarios', { post_id: postSelecionado.id, usuario_id: myUserId, texto: textoComentario }); setTextoComentario(''); const res = await api.get(`/comunidade/${postSelecionado.id}/comentarios`); setListaComentarios(res.data.dados); setPosts(prev => prev.map(p => p.id === postSelecionado.id ? {...p, total_comentarios: p.total_comentarios + 1} : p)); } catch(e){} finally { setEnviandoComentario(false); }
    };

    const handleExcluirPost = (id) => Alert.alert("Excluir", "Apagar?", [{text:"Não"}, {text:"Sim", onPress: async()=>{try{await api.delete(`/comunidade/${id}`); setPosts(p=>p.filter(x=>x.id!==id));}catch(e){}}}]);
    const handleExcluirComentario = (id) => Alert.alert("Excluir", "Apagar?", [{text:"Não"}, {text:"Sim", onPress: async()=>{try{await api.delete(`/comunidade/comentarios/${id}`); setListaComentarios(p=>p.filter(x=>x.id!==id));}catch(e){}}}]);
    const handleShare = async (item) => { try{await Share.share({message: `Confira: ${item.medicamento_nome}`});}catch(e){} };
    
    const limparFormularioPost = () => { 
        setNovoMedicamento(''); setNovaFarmacia(''); setNovoPreco(''); setNovoTexto(''); setNovaNota(0); 
    };

    // --- CONFIG VISUAL ---
    const getModalConfig = () => {
        switch(postType) {
            case 'DUVIDA': return { title: 'Tira-Dúvidas', color: COLORS.doubt, btn: 'Enviar Pergunta', medLabel: 'Medicamento', medPlace: 'Ex: Amoxicilina' };
            case 'ALERTA': return { title: 'Criar Alerta', color: COLORS.alert, btn: 'Ativar Monitoramento', medLabel: 'Produto', medPlace: 'Ex: Fralda G' };
            case 'ONDE': return { title: 'Onde Encontrar?', color: COLORS.locator, btn: 'Perguntar', medLabel: 'O que procura?', medPlace: 'Ex: Buscopan' };
            case 'AVALIACAO': return { title: 'Avaliação', color: COLORS.review, btn: 'Enviar Avaliação', medLabel: 'Estabelecimento/Produto', medPlace: 'Ex: Farmácia X' };
            case 'DENUNCIA': return { title: 'Denúncia', color: COLORS.report, btn: 'Enviar Report', medLabel: 'Produto/Local', medPlace: 'Ex: Álcool Gel' };
            default: return { title: 'Nova Dica', color: COLORS.primary, btn: 'Publicar Dica', medLabel: 'Medicamento', medPlace: 'Ex: Dipirona' };
        }
    };
    const modalUI = getModalConfig();

    const getTypeStyle = (tipo) => {
        switch(tipo) {
            case 'DUVIDA': return { label: 'DÚVIDA', color: COLORS.doubt, bg: COLORS.doubtBg, icon: 'chatbox-ellipses' };
            case 'ALERTA': return { label: 'ALERTA', color: COLORS.alert, bg: COLORS.alertBg, icon: 'notifications' };
            case 'ONDE': return { label: 'ONDE TEM?', color: COLORS.locator, bg: COLORS.locatorBg, icon: 'location' };
            case 'AVALIACAO': return { label: 'AVALIAÇÃO', color: COLORS.review, bg: '#FEFCE8', icon: 'thumbs-up' };
            case 'DENUNCIA': return { label: 'DENÚNCIA', color: COLORS.report, bg: '#FEF2F2', icon: 'warning' };
            default: return { label: 'DICA', color: COLORS.tip, bg: COLORS.tipBg, icon: 'bulb' };
        }
    };

    const renderStarInput = () => (
        <View style={{flexDirection:'row', justifyContent:'center', marginVertical:10, gap:8}}>
            {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => setNovaNota(star)}>
                    <Ionicons name={star <= novaNota ? "star" : "star-outline"} size={32} color="#F59E0B" />
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderStarsCard = (nota) => (
        <View style={{flexDirection:'row', gap:2, marginTop:4}}>
            {[1,2,3,4,5].map(star => (
                <Ionicons key={star} name={star <= nota ? "star" : "star-outline"} size={14} color="#F59E0B" />
            ))}
        </View>
    );

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const safeDate = String(dateString).replace(' ', 'T');
        const date = new Date(safeDate);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    const renderItem = ({ item }) => {
        const typeStyle = getTypeStyle(item.tipo);
        const liked = item.curtiu === 1;
        const textoLimpo = item.texto ? item.texto.replace(/\[.*?\]/g, '').trim() : '';

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                        <View style={[styles.avatar, {backgroundColor: typeStyle.color}]}>
                            <Text style={styles.avatarText}>{item.usu_nome?.charAt(0) || 'U'}</Text>
                        </View>
                        <View>
                            <Text style={styles.userName}>{item.usu_nome}</Text>
                            {item.tipo === 'AVALIACAO' && item.nota ? renderStarsCard(item.nota) : (
                                <Text style={styles.timeText}>{formatDate(item.data_postagem)}</Text>
                            )}
                        </View>
                    </View>
                    <View style={[styles.badge, {backgroundColor: typeStyle.bg}]}>
                        <Ionicons name={typeStyle.icon} size={10} color={typeStyle.color} style={{marginRight:4}} />
                        <Text style={[styles.badgeText, {color: typeStyle.color}]}>{typeStyle.label}</Text>
                    </View>
                </View>
                
                <Text style={styles.postBody}>{textoLimpo}</Text>

                {(item.medicamento_nome || item.preco) && (
                    <View style={styles.ticket}>
                        <View style={{flex:1}}>
                            <Text style={styles.medName}>{item.medicamento_nome}</Text>
                            {item.tipo === 'DENUNCIA' && item.motivo ? (
                                <Text style={[styles.farmName, {color: COLORS.report}]}>⚠️ Motivo: {item.motivo}</Text>
                            ) : (
                                item.farmacia_nome && <Text style={styles.farmName}>📍 {item.farmacia_nome}</Text>
                            )}
                        </View>
                        {parseFloat(item.preco) > 0 && <Text style={styles.priceText}>R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}</Text>}
                    </View>
                )}

                <View style={styles.actionsFooter}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item)}>
                        <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? COLORS.danger : COLORS.textGray} />
                        <Text style={[styles.actionLabel, liked && {color: COLORS.danger}]}>{item.total_likes || 'Curtir'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => abrirComentarios(item)}>
                        <Ionicons name="chatbubble-outline" size={19} color={COLORS.textGray} />
                        <Text style={styles.actionLabel}>{item.total_comentarios || 'Comentar'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item)}>
                        <Ionicons name="share-social-outline" size={19} color={COLORS.textGray} />
                    </TouchableOpacity>
                    {item.usuario_id === myUserId && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleExcluirPost(item.id)}>
                            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Comunidade</Text>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={COLORS.textGray} />
                    <TextInput style={styles.searchInput} placeholder="Buscar..." value={searchText} onChangeText={setSearchText} />
                    {searchText.length > 0 && <TouchableOpacity onPress={() => setSearchText('')}><Ionicons name="close-circle" size={18} color={COLORS.textGray} /></TouchableOpacity>}
                </View>
            </View>

            <View style={styles.tabsContainer}>
                {['TODOS', 'DICA', 'ONDE', 'DUVIDA', 'ALERTA'].map((tab) => (
                    <TouchableOpacity key={tab} style={[styles.tabItem, activeFilter === tab && styles.tabItemActive]} onPress={() => setActiveFilter(tab)}>
                        <Text style={[styles.tabText, activeFilter === tab && styles.tabTextActive]}>
                            {tab === 'TODOS' ? 'Geral' : tab === 'ONDE' ? 'Onde?' : tab.charAt(0) + tab.slice(1).toLowerCase() + 's'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? <View style={{padding:16}}><SkeletonCard /><SkeletonCard /></View> : (
                <FlatList
                    data={filteredPosts}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPosts(true)} colors={[COLORS.primary]} />}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum post encontrado.</Text>}
                />
            )}

            {menuOpen && <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}><View style={styles.backdrop} /></TouchableWithoutFeedback>}

            {/* MENU GRID */}
            {menuOpen && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => openModalWithType('DICA')}>
                        <View style={[styles.miniFab, {backgroundColor: COLORS.tip}]}><Ionicons name="bulb" size={22} color="#FFF" /></View>
                        <View style={styles.labelContainer}><Text style={styles.labelText}>Dica</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => openModalWithType('ONDE')}>
                        <View style={[styles.miniFab, {backgroundColor: COLORS.locator}]}><Ionicons name="location" size={22} color="#FFF" /></View>
                        <View style={styles.labelContainer}><Text style={styles.labelText}>Onde?</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => openModalWithType('DUVIDA')}>
                        <View style={[styles.miniFab, {backgroundColor: COLORS.doubt}]}><Ionicons name="chatbox-ellipses" size={22} color="#FFF" /></View>
                        <View style={styles.labelContainer}><Text style={styles.labelText}>Dúvida</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => openModalWithType('ALERTA')}>
                        <View style={[styles.miniFab, {backgroundColor: COLORS.alert}]}><Ionicons name="notifications" size={22} color="#FFF" /></View>
                        <View style={styles.labelContainer}><Text style={styles.labelText}>Alerta</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => openModalWithType('AVALIACAO')}>
                        <View style={[styles.miniFab, {backgroundColor: COLORS.review}]}><Ionicons name="thumbs-up" size={22} color="#FFF" /></View>
                        <View style={styles.labelContainer}><Text style={styles.labelText}>Avaliar</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => openModalWithType('DENUNCIA')}>
                        <View style={[styles.miniFab, {backgroundColor: COLORS.report}]}><Ionicons name="warning" size={22} color="#FFF" /></View>
                        <View style={styles.labelContainer}><Text style={styles.labelText}>Reportar</Text></View>
                    </TouchableOpacity>
                </View>
            )}

            {/* FAB */}
            {!menuOpen && (
                <TouchableOpacity style={styles.fab} onPress={toggleMenu} activeOpacity={0.9}>
                    <Ionicons name="add" size={32} color="#FFF" />
                </TouchableOpacity>
            )}

            {/* Modal Criar */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIndicator} />
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, {color: modalUI.color}]}>{modalUI.title}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={COLORS.textGray} /></TouchableOpacity>
                        </View>

                        {postType === 'AVALIACAO' && renderStarInput()}

                        <Text style={styles.inputLabel}>{modalUI.medLabel}</Text>
                        <TextInput style={styles.input} placeholder={modalUI.medPlace} value={novoMedicamento} onChangeText={setNovoMedicamento} />

                        {postType !== 'DUVIDA' && postType !== 'DENUNCIA' && (
                            <View style={{flexDirection:'row', gap:12}}>
                                <View style={{flex:1}}>
                                    <Text style={styles.inputLabel}>{postType === 'ONDE' ? 'Região/Bairro' : 'Local'}</Text>
                                    <TextInput style={styles.input} placeholder="Ex: Centro" value={novaFarmacia} onChangeText={setNovaFarmacia} />
                                </View>
                                {postType !== 'ONDE' && postType !== 'AVALIACAO' && (
                                    <View style={{width:'35%'}}>
                                        <Text style={styles.inputLabel}>Preço</Text>
                                        <TextInput style={styles.input} placeholder="0,00" keyboardType="numeric" value={novoPreco} onChangeText={setNovoPreco} />
                                    </View>
                                )}
                            </View>
                        )}

                        {postType === 'DENUNCIA' && (
                            <View>
                                <Text style={styles.inputLabel}>Motivo</Text>
                                <TextInput style={styles.input} placeholder="Ex: Preço abusivo" value={novaFarmacia} onChangeText={setNovaFarmacia} />
                            </View>
                        )}

                        <Text style={styles.inputLabel}>Detalhes</Text>
                        <TextInput style={[styles.input, styles.textArea]} placeholder="Escreva aqui..." multiline value={novoTexto} onChangeText={setNovoTexto} />

                        <TouchableOpacity style={[styles.postBtn, {backgroundColor: modalUI.color}]} onPress={handlePostar} disabled={posting}>
                            {posting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.postBtnText}>{modalUI.btn}</Text>}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
            
            {/* Modal Comentários */}
            <Modal animationType="fade" visible={modalComentariosVisible} transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, {height:'80%'}]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Comentários</Text>
                            <TouchableOpacity onPress={()=>setModalComentariosVisible(false)}><Ionicons name="close" size={24} color={COLORS.textGray}/></TouchableOpacity>
                        </View>
                        {loadingComentarios ? <ActivityIndicator color={COLORS.primary} /> : (
                            <FlatList data={listaComentarios} keyExtractor={i=>String(i.id)} renderItem={({item}) => (
                                <View style={styles.commentItem}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Text style={{fontWeight:'bold', color:COLORS.textDark}}>{item.usu_nome}</Text>
                                        {item.usuario_id === myUserId && <TouchableOpacity onPress={() => handleExcluirComentario(item.id)}><Ionicons name="trash-outline" size={14} color={COLORS.danger} /></TouchableOpacity>}
                                    </View>
                                    <Text style={{color:'#334155', marginTop:2}}>{item.texto}</Text>
                                </View>
                            )} />
                        )}
                        <View style={styles.footerInput}>
                            <TextInput style={styles.commentInput} placeholder="Comentar..." value={textoComentario} onChangeText={setTextoComentario} />
                            <TouchableOpacity style={styles.sendBtn} onPress={enviarComentario}><Ionicons name="arrow-up" size={20} color="#FFF" /></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}