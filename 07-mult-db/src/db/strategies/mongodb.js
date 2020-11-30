const ICrud = require('../strategies/interfaces//interfaceCrud');

class MongoDB extends ICrud {
  constructor() {
    super();
  }

  create(item) {
    console.log('Item salvo no mongoDB');
  }
}

module.exports = MongoDB;
