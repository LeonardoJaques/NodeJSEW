const { obterPessoas } = require("./service");

/*
  const item = {
    nome: 'Leo',
    idade: 11,
  }
  const {nome, idade} = item
  console.log(nome, idade)

*/

Array.prototype.meuFilter = function (callback) {
  const lista = [];
  for (index in this) {
    const item = this[index];
    const result = callback(item, index, this);
    //0, "", null, undefined === false
    if (!result) continue;
    lista.push(item);
  }
  return lista;
};

async function main() {
  try {
    const { results } = await obterPessoas("a");

    // const familiaLars = results.filter(function (item) {
    //   /* por padrão precisa retornar um booleano
    //    para informar se deve manter ou remover da lista
    //    false => remove da lista
    //    true => mantem
    //    não encontrou = -1
    //    encontrou = possição no Array
    //   */
    //   const result = item.name.toLowerCase().indexOf(`lars`) !== -1;
    //   return result;
    // });

    const familiaLars = results.meuFilter((item, index, lista) => {
      console.log(`Index:${index}`, lista.length);
      return item.name.toLowerCase().indexOf(`lars`) !== -1;
    });

    const names = familiaLars.map((pessoas) => pessoas.name);
    console.log(names);
  } catch (error) {
    console.error("Falha Critica", error);
  }
}

main();
