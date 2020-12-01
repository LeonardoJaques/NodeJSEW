const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new MongoDB());
describe('MongoDB Suite de testes', () => {
  beforeEach(async () => {
    await context.connect();
  });
  // it('', async function () {});
  it('Verificar Conexão', async function () {
    const result = await context.isConnected();
    console.log('result', result);
    const expected = 'connected';

    assert.deepStrictEqual(result, expected);
  });
});
