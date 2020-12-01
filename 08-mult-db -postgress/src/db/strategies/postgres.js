const ICrud = require('./../strategies/interfaces/interfaceCrud');
const Sequelize = require('sequelize');
class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._herois = null;
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.error('Deu Ruim!!!', error);
      return false;
    }
  }

  async connect() {
    this._driver = new Sequelize(
      'heroes',
      'leonardjaques01',
      'minhasenhasecreta',
      {
        host: 'localhost',
        dialect: 'postgres',
        quoteIndenfiers: false,
        operatorsAliases: 0,
      }
    );
    await this.defineModel();
  }

  async defineModel() {
    this._herois = this._driver.define(
      'herois',
      {
        id: {
          type: Sequelize.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true,
        },
        nome: {
          type: Sequelize.STRING,
          required: true,
        },
        poder: {
          type: Sequelize.STRING,
          required: true,
        },
      },
      {
        tableName: 'TB_HEROIS',
        freezeTablename: false,
        timestamps: false,
      }
    );
    await this._herois.sync();
  }

  async create(item) {
    const { dataValues } = await this._herois.create(item, { raw: true });
    return dataValues;
  }

  async read(item = {}) {
    return this._herois.findAll({ where: item, raw: true });
  }

  async update(id, item) {
    console.log('id', id);
    const result = await this._herois.update(item, { where: { id: id } });
    console.log('result', result);
    return result;
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._herois.destroy({ where: query });
  }
}

module.exports = Postgres;
