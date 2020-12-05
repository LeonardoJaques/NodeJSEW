// npm i hapi
// npm i hapi-swagger
// npx install-peerdeps hapi-swagger
// npm install @hapi/inert
// npm install @hapi/vision

const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchemas');
const HeroRoute = require('./routes/heroRoutes');

const HapiSwagger = require('hapi-swagger');
const Vison = require('@hapi/vision');
const Inert = require('@hapi/inert');

const app = Hapi.Server({ port: 5000, host: 'localhost' });
app.validator(Joi);

function mapRoutes(instance, methods) {
  return methods.map((methods) => instance[methods]());
}

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroisSchema));

  const swaggerOptions = {
    info: {
      title: 'API Herois - #CursoNodeBR',
      version: 'v1.0',
    },
    // lang: 'pt',
  };

  await app.register([
    Vison,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
      
    },
  ]);

  app.route(mapRoutes(new HeroRoute(context), HeroRoute.methods()));

  await app.start();
  console.log('Servidor rodando na porta', app.info.port);
  return app;
}

module.exports = main();
