import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {

    const navigation = useNavigation();

    function Acesso() {
        navigation.navigate('Home');
    }

    return(
        <View>
            <Text>Login</Text>
            <TouchableOpacity
                onPress={() => Acesso()}
            >
                <Text>Home</Text>
            </TouchableOpacity>
        
            <TouchableOpacity
                onPress={() => navigation.navigate('CadUsuario')}
            >
                <Text>Cadastro de Usuários</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('EsqSenha')}
            >
                <Text>Esqueceu a senha</Text>
            </TouchableOpacity>
        </View>
    );
}