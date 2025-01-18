import { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { TransacaoContext } from '../context/TransacaoContext';
import { getListaMoedas } from '../api/cotacaoApi';

const NovaTransacaoScreen = ({ navigation }) => {
  const { adicionarTransacao } = useContext(TransacaoContext);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataHora, setDataHora] = useState(new Date());
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('Selecione um Tipo');
  const [moeda, setMoeda] = useState('BRL');
  const [moedas, setMoedas] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchMoedas = async () => {
      try {
        const lista = await getListaMoedas();
        setMoedas(lista);
      } catch (error) {
        console.error('Erro ao carregar moedas:', error);
        Alert.alert('Erro', 'Falha ao carregar as moedas.');
      }
    };
    fetchMoedas();
  }, []);

  const handleSalvar = () => {
    if (!descricao || !valor || !categoria) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const novaTransacao = {
      id: Date.now().toString(),
      descricao,
      valor: parseFloat(valor),
      dataHora: dataHora.toISOString(),
      categoria,
      tipo,
      moeda,
    };
console.log('Nova transação:', novaTransacao);
    adicionarTransacao(novaTransacao);
    navigation.goBack();
  };

  const handleValorChange = (text) => {
    const onlyNumbers = text.replace(/[^0-9.]/g, '');
    setValor(onlyNumbers);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valor}
        onChangeText={handleValorChange}
        keyboardType="numeric"
      />
      <View style={styles.datePickerContainer}>
        <Button
          title={`Selecionar Data e Hora: ${dataHora.toLocaleString()}`}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={dataHora}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDataHora(selectedDate);
              }
            }}
          />
        )}
      </View>
      <Picker
        selectedValue={categoria}
        onValueChange={(value) => setCategoria(value)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma Categoria" value="" />
        <Picker.Item label="Alimentação" value="Alimentação" />
        <Picker.Item label="Saúde" value="Saúde" />
        <Picker.Item label="Entretenimento" value="Entretenimento" />
        <Picker.Item label="Roupas" value="Roupas" />
        <Picker.Item label="Outros" value="Outros" />
      </Picker>
      <Picker
        selectedValue={tipo}
        onValueChange={(value) => setTipo(value)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um Tipo" value="" />
        <Picker.Item label="Receita" value="Receita" />
        <Picker.Item label="Despesa" value="Despesa" />
      </Picker>
      <Picker
        selectedValue={moeda}
        onValueChange={(value) => setMoeda(value)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma Moeda" value="" />
        {moedas.map((m) => (
          <Picker.Item key={m.simbolo} label={m.nomeFormatado} value={m.simbolo} />
        ))}
      </Picker>
      <Button title="Salvar" onPress={handleSalvar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
  datePickerContainer: { marginBottom: 16 },
  picker: { marginBottom: 16 },
});

export default NovaTransacaoScreen;
