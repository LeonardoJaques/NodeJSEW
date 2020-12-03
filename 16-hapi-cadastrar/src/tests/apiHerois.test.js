const assert = require('assert');
const api = require('../api');

const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Bionica',
};

let app = {};
describe.only('Suite de teste api Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
  });
  it('Listar / herois', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/herois?skip=0&limit=10',
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepStrictEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it('Listar / herois - Deve retornar somente 3 registros', async () => {
    const TAMANHO_LIMITE = 3;
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepStrictEqual(statusCode, 200);
    assert.ok(dados.length === TAMANHO_LIMITE);
  });

  it('Listar / herois - Deve retornar erro de limit incorreto', async () => {
    const TAMANHO_LIMITE = 'aaa';
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
    });
    const erroResult = {
      statusCode: 400,
      error: 'Bad Request',
      message: '"limit" must be a number',
      validation: { source: 'query', keys: ['limit'] },
    };

    assert.deepStrictEqual(result.statusCode, 400);
    assert.deepStrictEqual(result.payload, JSON.stringify(erroResult));
  });

  it('Listar GET - /herois - Deve filtrar um item', async () => {
    const NAME = 'Spider Man-1606870384718';
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=1000&nome=${NAME}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.deepStrictEqual(dados[0].nome, NAME);
  });

  it('Cadastrar POST - /herois', async () => {
    const result = await app.inject({
      method: 'POST',
      url: `/herois`,
      payload: JSON.stringify(MOCK_HEROI_CADASTRAR),
    });
    // console.log('Result', result);
    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepStrictEqual(message, 'Heroi cadastrado com sucesso!');
  });
});
