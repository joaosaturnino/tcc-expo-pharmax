import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const COLOR_PRIMARY = '#458B00';
const COLOR_BG = '#FFFFFF';
const COLOR_INPUT_BG = '#F8FAFC'; 

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_BG,
    },
    
    // --- HEADER ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? 50 : 20,
        paddingBottom: 10,
        backgroundColor: COLOR_BG,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: -0.5,
    },
    editToggleBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    editToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLOR_PRIMARY,
    },

    scrollContainer: {
        paddingBottom: 40,
        paddingHorizontal: 24,
    },

    // --- ÁREA DA FOTO ---
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    photoContainer: {
        position: 'relative',
        shadowColor: "#458B00",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    profilePhoto: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLOR_PRIMARY,
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 16,
    },
    userEmail: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 2,
    },

    // --- FORMULÁRIO ---
    form: {
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 6,
        fontWeight: '700',
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    
    // Estilo Moderno "Filled"
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR_INPUT_BG,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 58,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputContainerEditable: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 2,
    },

    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '500',
    },
    
    // --- BOTÕES ---
    footerButtons: {
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: COLOR_PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: COLOR_PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },

    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_BG,
    },
});