const Postgres = require('../db/strategies/postgres/postgres');
const Context = require('../db/strategies/base/contextStrategy');
const assert = require('assert');
const HeroiSchema = require('../db/strategies/postgres/schemas/heroisSchemas');
const { strictEqual, deepStrictEqual } = require('assert');
const MOCK_HEROI_CADASTRAR = { nome: 'Gaviao Negro', poder: 'Flechas' };
const MOCK_HEROI_ATUALIZAR = { nome: 'Super Chock', poder: 'Raios' };

let context = {};
describe('Postgres Strategy', function () {
  this.timeout(Infinity);
  this.beforeAll(async function () {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroiSchema);

    context = new Context(new Postgres(connection, model));

    await context.delete();
    await context.create(MOCK_HEROI_ATUALIZAR);
    await context.create(MOCK_HEROI_CADASTRAR);
  });
  it('Postgres SQL Connection', async function () {
    const result = await context.isConnected();
    assert.strictEqual(result, true);
  });

  it('Cadastrar', async () => {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.id;

    assert.strictEqual(result.nome, MOCK_HEROI_CADASTRAR.nome);
    assert.strictEqual(result.poder, MOCK_HEROI_CADASTRAR.poder);
  });

  it('Listar', async () => {
    const [result] = await context.read(MOCK_HEROI_CADASTRAR);
    delete result.id;
    deepStrictEqual(result.nome, MOCK_HEROI_CADASTRAR.nome);
  });

  it('Atualizar', async function () {
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
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepStrictEqual(result, 1);
  });
});
