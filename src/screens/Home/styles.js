import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE9E9',
    },
    header: {
        paddingTop: 0,
        paddingHorizontal: 16,
        paddingBottom: 0,
        backgroundColor: '#EEE9E9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    logo: {
        width: 250,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 0,
        marginTop: 10,
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#EEE9E9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchInput: {
        backgroundColor: '#f1f2f6',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        color: '#2c3e50',
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    verTudo: {
        fontSize: 14,
        color: '#006400',
        fontWeight: '500',
    },
    categoriasList: {
        paddingBottom: 10,
    },
    categoriaItem: {
        alignItems: 'center',
        marginRight: 20,
        width: 80,
    },
    categoriaIcon: {
        width: 48,
        height: 48,
        marginBottom: 8,
    },
    categoriaNome: {
        fontSize: 12,
        color: '#2c3e50',
        textAlign: 'center',
        fontWeight: '500',
    },
    produtosList: {
        paddingBottom: 15,
    },
    produtoCard: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 2, 
        borderColor: '#fff', 
        overflow: 'hidden',
    },
    produtoImagem: {
        width: 60,
        height: 60,
        backgroundColor: '#f1f2f6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    produtoImagemReal: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    produtoImagemTexto: {
        fontSize: 24,
    },
    produtoNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    produtoMarca: {
        fontSize: 12,
        color: '#7f8c8d',
        marginBottom: 6,
    },
    produtoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#458B00',
    },
    
    // --- ESTILOS DE PROMOÇÃO ---
    produtoCardEmPromocao: {
        backgroundColor: '#fffbeb',
        borderColor: '#e74c3c',
    },
    promoBadge: {
        position: 'absolute',
        top: -1,
        right: -1,
        backgroundColor: '#e74c3c',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        zIndex: 1,
    },
    promoBadgeTexto: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    produtoPrecoAntigo: {
        fontSize: 13,
        color: '#7f8c8d',
        textDecorationLine: 'line-through',
    },
    
    marcasList: {
        paddingBottom: 15,
    },
    marcaCard: {
        alignItems: 'center',
        marginRight: 20,
        width: 80,
    },
    marcaLogo: {
        width: 60,
        height: 60,
        backgroundColor: '#3A5FCD',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    marcaLogoImagem: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
    },
    marcaLogoTexto: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    marcaNome: {
        fontSize: 12,
        color: '#000',
        fontWeight: '500',
        textAlign: 'center',
    },
    
    // --- ESTILOS CARD FARMACIA MELHORADOS ---
    bannerFarmaciaCard: {
        width: 200,
        height: 140, // Aumentado para caber melhor
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3, 
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    bannerFarmaciaImagemContainer: {
        width: '100%',
        height: 100, // Área fixa para imagem
        backgroundColor: '#f9f9f9', 
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    bannerFarmaciaImagem: {
        width: '80%', 
        height: '80%',
    },
    bannerFarmaciaNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginVertical: 10,
        textAlign: 'center',
        paddingHorizontal: 5,
    },

    espacoFinal: {
        height: 30,
    },
});