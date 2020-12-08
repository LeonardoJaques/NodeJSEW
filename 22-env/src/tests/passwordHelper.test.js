const assert = require('assert');
const PassworldHelper = require('./../helpers/passwordHelper');

const SENHA = 'jaques.projetos@outlook.com';
const HASH = '$2b$04$PiEw9MW3rvbM7/JLaNfQU.nmPbwUbVu1iEzA2KSTNqBVKc4yiM9o2';

describe('UserHelper test suite', function () {
  // it('', async () => {});
  it('Deve gerar um hash apartir de uma senha', async () => {
    const result = await PassworldHelper.hashPassword(SENHA);
    assert.ok(result.length > 10);
  });

  it('Deve comparar uma senha e seu hash', async () => {
    const result = await PassworldHelper.comparePassword(SENHA, HASH);
    assert.ok(result, true);
  });
});
