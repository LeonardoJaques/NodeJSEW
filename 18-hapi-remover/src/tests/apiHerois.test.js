const assert = require('assert');
const api = require('../api');

const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Bionica',
};

const MOCK_HEROI_ATUALIZAR = {
  nome: 'Ghost Rider',
  poder: 'Olhar da penitência',
};

let app = {};
let MOCK_ID = '';
describe('Suite de teste api Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: JSON.stringify(MOCK_HEROI_ATUALIZAR),
    });

    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
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

  it('Não deve cadastrar com payload errado', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      payload: {
        NAME: 'Flash',
      },
    });
    const payload = JSON.parse(result.payload);
    assert.deepStrictEqual(result.statusCode, 400);
    assert.ok(payload.message.search('"nome" is required') !== -1);
  });

  it('Atualizar PATCH - /herois/{id}', async () => {
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${MOCK_ID}`,
      payload: {
        nome: 'Ghost Riders',
        poder: 'Olhar da penitência',
      },
    });
    assert.deepStrictEqual(result.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(result.payload).nModified, 1);
  });

  it('Atualizar PATCH - /herois:id - Não deve atualizar id incorreto!', async () => {
    const _id = '5fcbb6f9f54cf81a0607df90';
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${_id}`,
      payload: JSON.stringify({ poder: 'Olhar da penitência' }),
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    const expected = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'ID não encontrado!',
    };

    assert.deepStrictEqual(statusCode, 412);
    assert.deepStrictEqual(dados, expected);
  });

  it('Remover DELETE - herois/{id}', async () => {
    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/${MOCK_ID}`,
    });
    const statusCode = result.statusCode;

    assert.ok(statusCode, 200);
    assert.deepStrictEqual(
      JSON.parse(result.payload).message,
      'Herois removido com sucesso!'
    );
  });

  it('Remover DELETE - herois/:id - não deve remover', async () => {
    const _id = '5fcbb6f9f54cf81a0607df90';

    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/${_id}`,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    const expected = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Não foi possivel remover o item',
    };

    assert.ok(statusCode, 412);
    assert.deepStrictEqual(dados, expected);
  });

  it('Remover DELETE - herois/:id - não deve remover com ID_INVALIDO', async () => {
    const _id = 'ID_INVALIDO';

    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/${_id}`,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    const expected = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
    };

    assert.ok(statusCode, 500);
    assert.deepStrictEqual(dados, expected);
  });
});
