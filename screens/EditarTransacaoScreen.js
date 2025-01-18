import { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { TransacaoContext } from '../context/TransacaoContext';
import { getListaMoedas } from '../api/cotacaoApi';

const EditarTransacaoScreen = ({ route, navigation }) => {
  const { transacao } = route.params;
  const { editarTransacao } = useContext(TransacaoContext);

  const [descricao, setDescricao] = useState(transacao.descricao);
  const [valor, setValor] = useState(String(transacao.valor));
  const [dataHora, setDataHora] = useState(new Date(transacao.dataHora));
  const [categoria, setCategoria] = useState(transacao.categoria);
  const [tipo, setTipo] = useState(transacao.tipo);
  const [moeda, setMoeda] = useState(transacao.moeda);
  const [moedas, setMoedas] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchMoedas = async () => {
      try {
        const lista = await getListaMoedas();
        setMoedas(lista);
      } catch (error) {
        console.error('Erro ao carregar moedas:', error);
      }
    };
    fetchMoedas();
  }, []);

  const handleSalvar = () => {
    const transacaoAtualizada = {
      ...transacao,
      descricao,
      valor: parseFloat(valor),
      dataHora: dataHora.toISOString(),
      categoria,
      tipo,
      moeda,
    };
    editarTransacao(transacaoAtualizada);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
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
        onChangeText={(text) => setValor(text.replace(/[^0-9.]/g, ''))}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
  datePickerContainer: { marginBottom: 16 },
  picker: { marginBottom: 16 },
});

export default EditarTransacaoScreen;
