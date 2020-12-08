const ICrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');
class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.error('Deu Ruim!!!', error);
      return false;
    }
  }

  static async connect() {
    const connection = await new Sequelize(
      'heroes',
      'leonardjaques01',
      'minhasenhasecreta',
      {
        host: 'localhost',
        dialect: 'postgres',
        quoteIndenfiers: false,
        operatorsAliases: 0,
        logging: false,
      }
    );
    return connection;
  }

  static async defineModel(connection, schema) {
    const model = connection.define(
      schema.name,
      schema.schema,
      schema.opitions
    );
    await model.sync();
    return model;
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item, { raw: true });
    return dataValues;
  }

  async read(item = {}) {
    return this._schema.findAll({ where: item, raw: true });
  }

  async update(id, item, upsert = false) {
    const fn = upsert ? 'upsert' : 'update';
    const result = await this._schema[fn](item, { where: { id: id } });
    return result;
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._schema.destroy({ where: query });
  }
}

module.exports = Postgres;
