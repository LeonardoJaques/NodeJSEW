const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb');
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

const context = new Context(new MongoDB());
describe('MongoDB Suite de testes', () => {
  before(async () => {
    await context.connect();
    await context.create(MOCK_HEROI_DEFAULT);
    const result = await context.create(MOCK_HEROI_ATUALIZAR);
    MOCK_HEROI_ID = result._id;
  });

  it('Verificar Conexão', async () => {
    const result = await context.isConnected();
    console.log('result', result);
    const expected = 'connected';

    assert.deepStrictEqual(result, expected);
  });

  it('Cadastar', async () => {
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
