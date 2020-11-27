/* TODO
  [x] 0 Obter um usúario
  [x] 1 Obter número de telefone de um usuário apartir do seu Id
  [x] 2 Obter o endereço do usuário pelo Id
*/

//importamos o módulo interno do node.js

const { promises } = require("fs");
const util = require("util");
const obterEnderecoAsync = util.promisify(obterEnderecao);

function obterUsuario() {
  //quando der algum problema -> reject (Error)
  //quando for um sucesso -> Resolve
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(() => {
      // return reject(new Error("Deu Ruim!!!"));
      return resolve({
        id: 1,
        nome: "Aladin",
        dataNascimento: new Date(),
      });
    }, 1000);
  });
}

function obterTelefone(idUsuario) {
  return new Promise(function resolverPromise(resolve, reject) {
    setTimeout(() => {
      return resolve({
        telefone: "2199002",
        ddd: 21,
      });
    }, 2000);
  });
}

function obterEnderecao(idUsuario, callBack) {
  setTimeout(() => {
    return callBack(null, {
      rua: "dos bobos",
      numero: 0,
    });
  }, 2000);
}

//adicionar a palavra Async na função -> automaticamente ela retornará um Promise
main();
async function main() {
  try {
    console.time("medida-promise");

    const usuario = await obterUsuario();
    // const telefone = await obterTelefone(usuario.id);
    // const endereco = await obterEnderecoAsync(usuario.id);

    const resultado = await Promise.all([
      obterTelefone(usuario.id),
      obterEnderecoAsync(usuario.id),
    ]);

    const endereco = resultado[1];
    const telefone = resultado[0];

    console.log(`
         Nome: ${usuario.nome},
         Telefone: (${telefone.ddd}) ${telefone.telefone}
         Endereço: ${endereco.rua}, ${endereco.numero}
    `);

    console.timeEnd("medida-promise");
  } catch (error) {
    console.log("Deu Ruim", error);
  }
}

// const usuarioPromise = obterUsuario();
// // para manipular o sucesso usa-se a função .then
// // para manipular erros .catch

// usuarioPromise
//   .then((usuario) => {
//     return obterTelefone(usuario.id).then(function resolverTelefone(result) {
//       return {
//         usuario: {
//           nome: usuario.nome,
//           id: usuario.id,
//         },
//         telefone: result,
//       };
//     });
//   })
//   .then((resultado) => {
//     const endereco = obterEnderecoAsync(resultado.usuario.id);
//     return endereco
//       .then(function resolverEndereco(result) {
//         return {
//           usuario: resultado.usuario,
//           telefone: resultado.telefone,
//           endereco: result,
//         };
//       })
//       .then((resultado) => {
//         console.log(`
//         Nome: ${resultado.usuario.nome}
//         Endereço: ${resultado.endereco.rua}, ${resultado.endereco.numero}
//         Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}

//       `);
//       });
//   })
//   .then((resultado) => {
//     console.log("Resultado", resultado);
//   })
//   .catch((error) => console.error("Deu Ruim!", error));

// function resolverUsuario(erro, usuario) {
//   console.log("usuario", usuario);
// }
// obterUsuario(function resolverUsuario(error, usuario) {
//   if (error) {
//     //null || "" || 0 === false
//     console.error("DEU RUIM! no USUARIO", error);
//     return;
//   }
//   obterTelefone(usuario.id, function resolverTelefone(error1, telefone) {
//     if (error1) {
//       //null || "" || 0 === false
//       console.error("DEU RUIM! no TELEFONE", error);
//       return;
//     }

//     obterEnderecao(usuario.id, function resolverEndereco(error2, endereco) {
//       if (error2) {
//         //null || "" || 0 === false
//         console.error("DEU RUIM! no ENDEREÇO", error);
//         return;
//       }
//       console.log(`
//       Nome: ${usuario.nome},
//       Endereço: ${endereco.rua}, ${endereco.numero},
//       Telefone: (${telefone.ddd}) ${telefone.telefone}
//     `);
//     });
//   });
// });
//const telefone = obterTelefone(usuario.id);

// console.log("telefone", telefone);
