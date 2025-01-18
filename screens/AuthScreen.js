import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function AuthScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('TransacaoList');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Usuário"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Acessar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { marginVertical: 8, padding: 12, borderWidth: 1, borderRadius: 8 },
});
