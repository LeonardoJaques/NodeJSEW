const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env === 'prod' || env === 'dev', 'a env é inválida, ou dev ou prod');
const configPath = join('./config/', `.env.${env}`);
require('dotenv').config({ path: configPath });

const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodbStrategy');
const PostgresDB = require('./db/strategies/postgres/postgresStrategy');
const HeroisSchema = require('./db/strategies/mongodb/schemas/heroisSchemas');
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');

const HapiSwagger = require('hapi-swagger');
const Vison = require('@hapi/vision');
const Inert = require('@hapi/inert');
const JWT_KEY = process.env.JWT_KEY;

const HapiJwt = require('hapi-auth-jwt2');

const app = Hapi.Server({ port: process.env.PORT, host: 'localhost' });
app.validator(Joi);
function mapRoutes(instance, methods) {
  return methods.map((methods) => instance[methods]());
}

async function main() {
  const connection = await MongoDB.connect();
  const contextMongoDb = new Context(new MongoDB(connection, HeroisSchema));

  const connectionPostgres = await PostgresDB.connect();
  const model = await PostgresDB.defineModel(connectionPostgres, UsuarioSchema);
  const contextPostgres = new Context(
    new PostgresDB(connectionPostgres, model)
  );

  const swaggerOptions = {
    info: {
      title: 'API Herois - #CursoNodeBR',
      version: 'v1.0',
    },
    // lang: 'pt',
  };

  await app.register([
    HapiJwt,
    Vison,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_KEY,
    // options: {
    //   expiresIn: 20
    // }
    validate: async (dado, request) => {
      const [result] = await contextPostgres.read({
        username: dado.username.toLowerCase(),
        id: dado.id,
      });
      if (!result) {
        return {
          isValid: false, // caso não valido é falso
        };
      }

      // verificar no banco se o usuário continua ativo.
      // verificar no banco se o usuário continua pagando.

      return {
        isValid: true, // caso não valido é falso
      };
    },
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroRoute(contextMongoDb), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_KEY, contextPostgres), AuthRoute.methods()),
  ]);

  await app.start();
  console.log('Servidor rodando na porta', app.info.port);
  return app;
}

module.exports = main();
