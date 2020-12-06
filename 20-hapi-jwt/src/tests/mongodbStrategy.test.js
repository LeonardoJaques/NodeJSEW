const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchemas');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
  nome: 'Raio Negro',
  poder: 'Elétrico',
};
const MOCK_HEROI_DEFAULT = {
  nome: `Super Chock-${Date.now()}`,
  poder: 'Elétrico',
};
const MOCK_HEROI_ATUALIZAR = {
  nome: `Spider Man-${Date.now()}`,
  poder: 'Sentido Aranha',
};

let MOCK_HEROI_ID = '';

let context = {};

describe('MongoDB Suite de testes', function () {
  this.beforeAll(async () => {
    const connection = MongoDB.connect();
    context = new Context(new MongoDB(connection, HeroiSchema));

    await context.create(MOCK_HEROI_DEFAULT);
    const result = await context.create(MOCK_HEROI_ATUALIZAR);
    MOCK_HEROI_ID = result._id;
  });

  it('MongoDB NOSQL Connection', async () => {
    const result = await context.isConnected();
    const expected = 'connected';

    assert.deepStrictEqual(result, expected);
  });

  it('Cadastrar', async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
    assert.deepStrictEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });

  it('Listar', async () => {
    const [{ nome, poder }] = await context.read({
      nome: MOCK_HEROI_DEFAULT.nome,
    });
    const result = { nome, poder };
    assert.deepStrictEqual(result, MOCK_HEROI_DEFAULT);
  });
  // it('', async  () => {});
  it('Atualizar', async () => {
    const result = await context.update(MOCK_HEROI_ID, {
      nome: 'Chapolin',
    });
    assert.deepStrictEqual(result.nModified, 1);
  });

  it('Remover', async () => {
    const result = await context.delete(MOCK_HEROI_ID);
    assert.deepStrictEqual(result.n, 1);
  });
});
