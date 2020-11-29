const { get } = require("axios");

const URL = `https://swapi.dev/api/people`;

async function obterPessoas(nome) {
  const url = `${URL}/?search=${nome}&format=json`;
  const result = await get(url);
  // console.log(JSON.stringify(result.data));
  return result.data.results.map(mapearPessoas);
}

function mapearPessoas(item) {
  return {
    nome: item.name,
    peso: item.height,
  };
}

module.exports = {
  obterPessoas,
};
