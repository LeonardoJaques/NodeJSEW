const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');

const failAction = (request, headers, erro) => {
  throw erro;
};
class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Deve listar herois',
        notes: 'Pode paginar resultados e filtrar por nome',
        validate: {
          // playLoad -> body
          // headers -> header
          // param  -> na URL:id
          // query -> ?skip=10&limit=100
          failAction,
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100),
          },
        },
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query;
          // const query = nome ? { nome: { $regex: `.*${nome}*.` } } : {};
          const query = nome ? { nome: { $regex: `.*${nome}.*` } } : {};
          return this.db.read(nome ? query : {}, skip, limit);
        } catch (error) {
          console.log('Deu Rum!!!', error);

          return Boom.internal();
        }
      },
    };
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Deve cadastrar heroi',
        notes: 'Deve cadastrar herois por nome e poder',
        validate: {
          failAction,
          payload: {
            nome: Joi.string().required().min(3).max(60),
            poder: Joi.string().required().min(2).max(60),
          },
        },
      },
      handler: async (request) => {
        try {
          const { nome, poder } = request.payload;

          const result = await this.db.create({
            nome,
            poder,
          });

          return {
            message: 'Heroi cadastrado com sucesso!',
            _id: result._id,
          };
        } catch (error) {
          console.error('DEU RUIM!!!', error);
          return Boom.internal();
        }
      },
    };
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        tags: ['api'],
        description: 'Deve atualizar heroi por id',
        notes: 'Pode atualiazar qualquer campo',
        validate: {
          failAction,
          payload: {
            nome: Joi.string().max(100),
            poder: Joi.string().max(30),
          },
          params: {
            id: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        try {
          const payload = request.payload;
          const id = request.params.id;
          const result = await this.db.update(id, payload);
          if (result.nModified !== 1) {
            return Boom.preconditionFailed('ID não encontrado!');
          }
          return result;
        } catch (error) {
          console.error('DEU RUIM!', error);
          return Boom.internal();
        }
      },
    };
  }

  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      config: {
        tags: ['api'],
        description: 'Deve remover heroi por ID.',
        notes: 'O ID precisa ser válido.',
        validate: {
          failAction,
          params: {
            id: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const result = await this.db.delete(id);
          if (result.n !== 1) {
            return Boom.preconditionFailed('Não foi possivel remover o item');
          }
          return {
            message: 'Herois removido com sucesso!',
          };
        } catch (error) {
          console.error('DEU RUIM!', error);
          return Boom.internal();
        }
      },
    };
  }
}

module.exports = HeroRoutes;
