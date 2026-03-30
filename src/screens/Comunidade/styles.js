import { StyleSheet, Dimensions, Platform } from 'react-native';

const COLORS = {
    primary: '#458B00',
    background: '#F8FAFC',   
    white: '#FFFFFF',
    textDark: '#1E293B',     
    textGray: '#64748B',
    border: '#E2E8F0',
    inputBg: '#F1F5F9',
    overlay: 'rgba(0,0,0,0.8)',
    
    // Cores das Categorias
    tip: '#15803d',    
    doubt: '#1D4ED8',  
    alert: '#B45309',  
    locator: '#7E22CE',
    review: '#CA8A04',
    report: '#DC2626',
};

export default StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.background 
    },
    
    header: { 
        padding: 20, 
        paddingTop: Platform.OS === 'android' ? 50 : 20, 
        backgroundColor: COLORS.white, 
        borderBottomWidth: 1, 
        borderColor: '#F1F5F9' 
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: '800', 
        color: COLORS.textDark, 
        marginBottom: 12 
    },
    
    searchBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F1F5F9', 
        borderRadius: 12, 
        paddingHorizontal: 12, 
        height: 46 
    },
    searchInput: { 
        flex: 1, 
        marginLeft: 10, 
        fontSize: 15, 
        color: COLORS.textDark 
    },

    tabsContainer: { 
        flexDirection: 'row', 
        paddingHorizontal: 20, 
        paddingBottom: 12, 
        backgroundColor: COLORS.white, 
        paddingTop: 10 
    },
    tabItem: { 
        paddingVertical: 6, 
        paddingHorizontal: 14, 
        borderRadius: 20, 
        marginRight: 8, 
        backgroundColor: '#F1F5F9' 
    },
    tabItemActive: { 
        backgroundColor: COLORS.textDark 
    },
    tabText: { 
        fontSize: 13, 
        fontWeight: '600', 
        color: COLORS.textGray 
    },
    tabTextActive: { 
        color: COLORS.white 
    },

    list: { 
        padding: 16, 
        paddingBottom: 100 
    },

    card: { 
        backgroundColor: COLORS.white, 
        borderRadius: 16, 
        padding: 16, 
        marginBottom: 16, 
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 12 
    },
    avatar: { 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    avatarText: { 
        color: '#FFF', 
        fontWeight: 'bold' 
    },
    userName: { 
        fontWeight: '700', 
        color: COLORS.textDark, 
        fontSize: 15 
    },
    timeText: { 
        fontSize: 11, 
        color: COLORS.textGray 
    },
    badge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 6 
    },
    badgeText: { 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 0.5 
    },
    postBody: { 
        fontSize: 15, 
        color: '#334155', 
        lineHeight: 22, 
        marginBottom: 12 
    },
    
    ticket: { 
        backgroundColor: '#F8FAFC', 
        padding: 12, 
        borderRadius: 12, 
        marginBottom: 12, 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#E2E8F0' 
    },
    medName: { 
        fontWeight: '700', 
        color: COLORS.textDark 
    },
    farmName: { 
        fontSize: 12, 
        color: COLORS.textGray 
    },
    priceText: { 
        fontSize: 16, 
        fontWeight: '800', 
        color: COLORS.primary 
    },

    actionsFooter: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingTop: 10, 
        borderTopWidth: 1, 
        borderColor: '#F1F5F9' 
    },
    actionBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 6 
    },
    actionLabel: { 
        fontSize: 13, 
        fontWeight: '600', 
        color: COLORS.textGray 
    },

    // --- MENU GRID (AJUSTADO) ---
    
    backdrop: { 
        position: 'absolute', 
        top: 0, bottom: 0, left: 0, right: 0, 
        backgroundColor: COLORS.overlay, 
        zIndex: 90 
    },

    menuContainer: { 
        position: 'absolute', 
        // Ajustado para ficar centralizado ou levemente acima de onde o botão estava
        bottom: 100, 
        left: 20, 
        right: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        gap: 20,
    },
    
    menuItem: { 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 80,
        marginBottom: 10,
    },
    
    labelContainer: { 
        marginTop: 8,
        backgroundColor: 'rgba(255,255,255,0.9)', 
        paddingVertical: 4, 
        paddingHorizontal: 8, 
        borderRadius: 12, 
    },
    labelText: { 
        fontWeight: '700', 
        fontSize: 11, 
        color: '#000',
        textAlign: 'center'
    },
    
    miniFab: { 
        width: 56, 
        height: 56, 
        borderRadius: 28, 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        borderWidth: 2,
        borderColor: '#FFF'
    },

    // --- BOTÃO FAB (POSIÇÃO NOVA) ---
    fab: { 
        position: 'absolute', 
        bottom: 90, // SUBIU MAIS (Estava 50 ou 30)
        right: 24, 
        width: 64, 
        height: 64, 
        borderRadius: 32, 
        backgroundColor: COLORS.primary, 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 10, 
        zIndex: 100,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    // Removido o fabOpen já que ele vai sumir

    // --- MODAL ---
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'flex-end' 
    },
    modalContent: { 
        backgroundColor: '#FFF', 
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24, 
        padding: 24 
    },
    modalIndicator: { 
        width: 40, 
        height: 4, 
        backgroundColor: '#E2E8F0', 
        borderRadius: 2, 
        alignSelf: 'center', 
        marginBottom: 20 
    },
    modalHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: '800', 
        color: COLORS.textDark 
    },
    inputLabel: { 
        fontSize: 12, 
        fontWeight: '700', 
        color: COLORS.textGray, 
        marginBottom: 6, 
        marginTop: 10, 
        textTransform: 'uppercase' 
    },
    input: { 
        backgroundColor: COLORS.inputBg, 
        padding: 14, 
        borderRadius: 12, 
        fontSize: 15, 
        color: COLORS.textDark
    },
    textArea: { 
        height: 100, 
        textAlignVertical: 'top' 
    },
    postBtn: { 
        padding: 16, 
        borderRadius: 14, 
        alignItems: 'center', 
        marginTop: 24 
    },
    postBtnText: { 
        color: '#FFF', 
        fontWeight: 'bold', 
        fontSize: 16 
    },

    // --- COMENTÁRIOS ---
    commentItem: { 
        padding: 12, 
        backgroundColor: '#F8FAFC', 
        borderRadius: 10, 
        marginBottom: 10 
    },
    footerInput: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 10, 
        borderTopWidth: 1, 
        borderColor: '#EEE', 
        paddingTop: 10 
    },
    commentInput: { 
        flex: 1, 
        backgroundColor: '#F1F5F9', 
        borderRadius: 20, 
        padding: 10, 
        marginRight: 10 
    },
    sendBtn: { 
        backgroundColor: COLORS.primary, 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    
    emptyText: { 
        textAlign: 'center', 
        marginTop: 50, 
        color: COLORS.textGray,
        fontSize: 16 
    },
    cardSkeleton: { 
        padding: 16, 
        backgroundColor: '#FFF', 
        borderRadius: 16, 
        marginBottom: 16 
    }
});