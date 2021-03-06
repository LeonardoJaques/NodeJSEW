const ICrud = require('../interfaces/interfaceCrud');
const Mongoose = require('mongoose');
const STATUS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};
class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState];
    if (state === 'connected') return state;

    if (state !== 'connecting') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[this._connection.readyState];
  }

  static connect() {
    console.log('MONGODB_URL', process.env.MONGODB_URL);
    Mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      function (error) {
        if (!error) return;
        console.log('Falha na conexão!', error);
      }
    );
    const connection = Mongoose.connection;
    connection.once('open', () => console.log('Database rodando.'));
    return connection;
  }

  create(item) {
    return this._schema.create(item);
  }

  read(item, skip = 0, limit = 10) {
    return this._schema.find(item).limit(limit).skip(skip);
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
