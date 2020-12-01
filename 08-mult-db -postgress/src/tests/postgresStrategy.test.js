const assert = require('assert');
const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
  nome: 'Gavião Negro',
  poder: 'Flechas',
};

const MOCK_HEROI_ATUALIZAR = {
  nome: 'Super Chock',
  poder: 'Raios',
};

const context = new Context(new Postgres());

describe('Postgres Strategy', function () {
  this.timeout(Infinity);
  before(async function () {
    await context.connect();
    await context.delete()
    await context.create(MOCK_HEROI_ATUALIZAR);

  });
  it('Postgres SQL Connection', async function () {
    const result = await context.isConnected();
    assert.strictEqual(result, true);
  });

  it('Cadastrar', async function () {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.id;
    assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('Litar', async function () {
    const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    delete result.id;
    // pegar a primeira posição
    // const posicaoZero = result[0]
    // const [posicao1, posicao2] = ['esse é o 1', 'esse é o 2' ]

    assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('atualizar', async function () {
    const [itemAtualizar] = await context.read({
      nome: MOCK_HEROI_ATUALIZAR.nome,
    });
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: 'Raio Negro',
    };
    const [result] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({
      id: itemAtualizar.id,
    });
    assert.deepStrictEqual(result, 1);
    assert.deepStrictEqual(itemAtualizado.nome, novoItem.nome);
    /*
      No javaScript temos uma tecnica chamada rest/spreed que é um metodo usados
      para realiza o merge de objetos ou sepera-los
      {
        nome: 'Batman',
        poder:'Dinheiro'
      }
      {
        dataNascimento: '1998-01-01'
      }
      //Final
      {
        nome: 'Batman'
        poder: 'Dinheiro'
        dataNascimento: '1998-01-01'
      }
    */
  });

  it('Remover por id', async function () {
    const [item] = await context.read({})
    const result = await context.delete(item.id)
    assert.deepStrictEqual(result, 1)
  });
});
