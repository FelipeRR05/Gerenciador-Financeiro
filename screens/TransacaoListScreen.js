import { useContext, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TransacaoContext } from '../context/TransacaoContext';
import { getCotacao } from '../api/cotacaoApi';
import TransacaoItemList from '../components/TransacaoItemList';

const TransacaoListScreen = ({ navigation }) => {
  const { transacoes, excluirTransacao } = useContext(TransacaoContext);
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('');
  const [transacoesVisiveis, setTransacoesVisiveis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarTransacoesConvertidas = async () => {
      const transacoesConvertidas = await Promise.all(
        transacoes.map(async (transacao) => {
          if (transacao.moeda === 'BRL') return transacao; 
          try {
            const cotacao = await getCotacao(transacao.moeda, transacao.dataHora.split('T')[0]);
            const valorConvertido = cotacao[0]?.cotacaoVenda * transacao.valor || transacao.valor;
            return { ...transacao, valorConvertido };
          } catch (error) {
            console.error(`Erro ao converter transação ${transacao.id}:`, error);
            return { ...transacao, valorConvertido: transacao.valor }; 
          }
        })
      );
      setTransacoesVisiveis(transacoesConvertidas);
      setLoading(false);
    };

    carregarTransacoesConvertidas();
  }, [transacoes]);

  const transacoesFiltradas = () =>
    transacoesVisiveis.filter((item) =>
      item.descricao.toLowerCase().includes(busca.toLowerCase())
    );

  const ordenarTransacoes = (a, b) => {
    if (ordenacao === 'valor') return b.valorConvertido - a.valorConvertido;
    if (ordenacao === 'data') return new Date(b.dataHora) - new Date(a.dataHora);
    return 0;
  };

  const handleExcluir = (id) => {
    setTransacoesVisiveis((prev) => prev.filter((t) => t.id !== id));
    excluirTransacao(id);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Carregando transações...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Buscar transação..."
          value={busca}
          onChangeText={setBusca}
        />
        <Picker
          selectedValue={ordenacao}
          onValueChange={(value) => setOrdenacao(value)}
          style={styles.picker}
        >
          <Picker.Item label="Ordenar por..." value="" />
          <Picker.Item label="Valor" value="valor" />
          <Picker.Item label="Data" value="data" />
        </Picker>
        <FlatList
          data={[...transacoesFiltradas()].sort(ordenarTransacoes)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable
              renderLeftActions={() => (
                <View style={styles.gestoContainer}>
                  <Icon
                    name="delete"
                    size={24}
                    color="#F44336"
                    onPress={() => handleExcluir(item.id)}
                  />
                </View>
              )}
              renderRightActions={() => (
                <View style={styles.gestoContainer}>
                  <Icon
                    name="edit"
                    size={24}
                    color="#4CAF50"
                    onPress={() =>
                      navigation.navigate('EditarTransacao', { transacao: item })
                    }
                  />
                </View>
              )}
            >
              <TransacaoItemList
                transacao={{
                  ...item,
                  valor: item.valorConvertido || item.valor,
                }}
              />
            </Swipeable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          }
        />
        <Text
          style={styles.adicionar}
          onPress={() => navigation.navigate('NovaTransacao')}
        >
          + Adicionar Nova Transação
        </Text>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
  picker: { marginBottom: 16 },
  gestoContainer: { justifyContent: 'center', padding: 16 },
  adicionar: {
    fontSize: 18,
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#aaa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransacaoListScreen;
