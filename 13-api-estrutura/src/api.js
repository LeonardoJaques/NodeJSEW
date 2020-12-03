const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchemas');
const HeroRoute = require('./routes/heroRoutes');

const app = Hapi.Server({ port: 5000, host: 'localhost' });

function mapRoutes(instance, methods) {
  return methods.map((methods) => instance[methods]());
}

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroisSchema));

  
  app.route([...mapRoutes(new HeroRoute(context), HeroRoute.methods())]);

  await app.start();
  console.log('Servidor rodando na porta', app.info.port);
  return app;
}

module.exports = main();
