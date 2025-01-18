import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TransacaoContext = createContext();

export default function TransacaoProvider({ children }) {
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    const carregarTransacoes = async () => {
      try {
        const transacoesSalvas = await AsyncStorage.getItem('transacoes');
        if (transacoesSalvas) {
          setTransacoes(JSON.parse(transacoesSalvas));
        }
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    };
    carregarTransacoes();
  }, []);

  const salvarTransacoes = async (novasTransacoes) => {
    try {
      setTransacoes(novasTransacoes); // Atualiza o estado
      await AsyncStorage.setItem('transacoes', JSON.stringify(novasTransacoes));
      console.log('Transacoes atuais:', transacoes);
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
    }
  };

  const adicionarTransacao = async (novaTransacao) => {
    const novasTransacoes = [...transacoes, novaTransacao];
    await salvarTransacoes(novasTransacoes);
  };

  const editarTransacao = async (transacaoEditada) => {
    const novasTransacoes = transacoes.map((t) =>
      t.id === transacaoEditada.id ? transacaoEditada : t
    );
    await salvarTransacoes(novasTransacoes);
  };

  const excluirTransacao = async (id, callback) => {
  const novasTransacoes = transacoes.filter((t) => t.id !== id);
  await salvarTransacoes(novasTransacoes);
  if (callback) callback(novasTransacoes);
};

  return (
    <TransacaoContext.Provider
      value={{ transacoes, adicionarTransacao, editarTransacao, excluirTransacao }}
    >
      {children}
    </TransacaoContext.Provider>
  );
}