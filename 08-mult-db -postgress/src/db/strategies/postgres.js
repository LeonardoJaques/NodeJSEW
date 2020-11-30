const ICrud = require('./../strategies/interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._herois = null;
    this._connect();
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

  _connect() {
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
  }

  async defineModel() {
    this._herois = driver.define(
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
        tableName: 'tb_herois',
        freezeTablename: false,
        timestamps: false,
      }
    );
    await Herois.sync();
  }

  create(item) {
    console.log('Item salvo no postgres');
  }
}

module.exports = Postgres;
