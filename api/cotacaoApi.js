export const getListaMoedas = async () => {
  const url = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json';
  const response = await fetch(url);
  const data = await response.json();
  return data.value;
};

export const getCotacao = async (moeda, dataCotacao) => {
  const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moeda}'&@dataCotacao='${dataCotacao}'&$top=1&$format=json`;
  const response = await fetch(url);
  const data = await response.json();
  return data.value;
};
