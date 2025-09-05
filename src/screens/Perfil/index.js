import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';

import styles from './styles';

export default function Perfil() {
    const [editing, setEditing] = useState(false);
    const [userData, setUserData] = useState({
        nome: 'João Henrique',
        email: 'joao@gmail.com',
        telefone: '(11) 99999-9999'
    });

    const handleSave = () => {
        if (!userData.nome || !userData.email) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
            return;
        }
        setEditing(false);
        Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Meu Perfil</Text>
            </View>

            <View style={styles.profileContainer}>
                {/* Foto do perfil - simples */}
                <View style={styles.photoContainer}>
                    <View style={styles.profilePhoto}>
                        <Text style={styles.photoText}>
                            {userData.nome.charAt(0)}
                        </Text>
                    </View>
                </View>

                {/* Formulário de dados */}
                <View style={styles.form}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.nome}
                        onChangeText={(text) => setUserData({ ...userData, nome: text })}
                        editable={editing}
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.email}
                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                        editable={editing}
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        style={styles.input}
                        value={userData.telefone}
                        onChangeText={(text) => setUserData({ ...userData, telefone: text })}
                        editable={editing}
                        keyboardType="phone-pad"
                    />

                    {/* Botões */}
                    <View style={styles.buttons}>
                        {editing ? (
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setEditing(true)}
                            >
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}