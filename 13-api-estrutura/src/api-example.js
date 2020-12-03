const Hapi = require('@hapi/hapi');
const Context = require('./../src/db/strategies/base/contextStrategy');
const MongoDB = require('./../src/db/strategies/mongodb/mongodb');
const HeroisSchema = require('./../src/db/strategies/mongodb/schemas/heroisSchemas');
const app = Hapi.Server({ port: 5000, host: 'localhost' });

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroisSchema));

  app.route([
    {
      path: '/herois',
      method: 'GET',
      handler: (request, head) => {
        return context.read();
      },
    },
  ]);

  await app.start();
  console.log('Servidor rodando na porta', app.info.port);
}

main();
