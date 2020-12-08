const assert = require('assert');
const api = require('./../api');
const Context = require('./../db/strategies/base/contextStrategy');
const PostgresDB = require('./../db/strategies/postgres/postgres');
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema');

let app = {};
const USER = {
  username: 'WallE',
  password: '123',
};

const USER_DB = {
  username: USER.username.toLowerCase(),
  password: '$2b$04$Hu8kD7OL1WhSWuIimqHycubfCgcMF1F.hhQHVB5t70WwyHi/JUz6W',
};

describe('Auth test suite', function () {
  this.beforeAll(async () => {
    app = await api;

    const connectionPostgres = await PostgresDB.connect();
    const model = await PostgresDB.defineModel(
      connectionPostgres,
      UsuarioSchema
    );
    const postgresModel = new Context(
      new PostgresDB(connectionPostgres, model)
    );
    await postgresModel.update(null, USER_DB, true);
  });

  it('Deve obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: USER,
    });

    const statusCode = result.statusCode;
    const dados = result.payload;

    assert.deepStrictEqual(statusCode, 200);
    assert.ok(JSON.parse(dados).token.length > 10);
  });

  it('Deve retornar não autorizado ao tentar obter um login errado', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'Super Gêmos',
        password: 'ativar 123',
      },
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepStrictEqual(statusCode, 401);
    assert.deepStrictEqual(dados.error, 'Unauthorized');
  });
});
