import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

const TransacaoItemList = ({ transacao }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={styles.container}>
      <Text style={styles.descricao}>{transacao.descricao}</Text>
      <Text style={styles.valor}>R$ {transacao.valorConvertido.toFixed(2)}</Text>
      <Text style={styles.data}>
        {new Date(transacao.dataHora).toLocaleDateString()}
      </Text>

      {isLandscape && (
        <>
          <Text style={styles.hora}>
            {new Date(transacao.dataHora).toLocaleTimeString()}
          </Text>
          <Text style={styles.categoria}>{transacao.categoria}</Text>
          <Text style={styles.tipo}>{transacao.tipo}</Text>
          <Text style={styles.moeda}>{transacao.moeda}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  descricao: { fontSize: 16, fontWeight: 'bold' },
  valor: { fontSize: 14, color: '#4CAF50' },
  data: { fontSize: 12, color: '#aaa' },
  hora: { fontSize: 12, color: '#aaa' },
  categoria: { fontSize: 12, color: '#aaa' },
  tipo: { fontSize: 12, color: '#aaa' },
  moeda: { fontSize: 12, color: '#aaa' },
});

export default TransacaoItemList;
