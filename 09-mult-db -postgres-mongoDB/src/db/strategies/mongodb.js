const ICrud = require('./interfaces/interfaceCrud');
const Mongoose = require('mongoose');
const STATUS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};
class MongoDB extends ICrud {
  constructor() {
    super();
    this._herois = null;
    this._driver = null;
  }

  async isConnected() {
    const state = STATUS[this._driver.readyState];
    if (state === 'connected') return state;

    if (state !== 'connecting') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[this._driver.readyState];
  }

  defineModel() {
    heroisSchema = new Mongoose.Schema({
      nome: {
        type: String,
        required: true,
      },
      poder: {
        type: String,
        required: true,
      },
      insertedAt: {
        type: Date,
        default: new Date(),
      },
    });

    this._herois = Mongoose.model('heroi', heroisSchema);
  }

  connect() {
    Mongoose.connect(
      'mongodb://leonardojaques:minhasenhasecreta@localhost:27017/herois',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (error) {
        if (!error) return;
        console.log('Falha na conexão!', error);
      }
    );
    const connection = Mongoose.connection;
    this._driver = connection;
    connection.once('open', () => console.log('Database rodando.'));
  }

  async create(item) {
    const resultCadastrar = await model.create({
      nome: 'Batman',
      poder: 'dinheiro',
    });
    console.log('Result Cadastrar', resultCadastrar);
  }
}

module.exports = MongoDB;
