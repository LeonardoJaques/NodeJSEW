const assert = require('assert');
const api = require('./../api');
let app = {};

describe('Auth test suite', function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it('deve obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'walle',
        password: '1234',
      },
    });

    console.log('result', result.payload);

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepStrictEqual(statusCode, 200);
    assert.ok(JSON.stringify(dados.token).length > 10);
  });
});
