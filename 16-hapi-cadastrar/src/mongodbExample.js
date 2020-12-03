const Mongoose = require('mongoose');

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
connection.once('open', () => console.log('Database rodando.'));

// setTimeout(() => {
//   const state = connection.readyState;
//   console.log('state', state);
// }, 1000);

/* Connection ready state
0 = disconnected
1 = connected
2 = connecting
3 = disconnecting
*/

const heroisSchema = new Mongoose.Schema({
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

const model = Mongoose.model('heroi', heroisSchema);

async function main() {
  const resultCadastrar = await model.create({
    nome: 'Batman',
    poder: 'dinheiro',
  });
  console.log('Result Cadastrar', resultCadastrar);

  const listItem = await model.find();
  console.log('items', listItem);
}

main();
