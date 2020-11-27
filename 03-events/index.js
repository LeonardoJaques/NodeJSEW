const EventEmmiter = require("events");
class MeuEmissor extends EventEmmiter {}

const meuEmissor = new MeuEmissor();
const nomeEvento = "usuario:click";

meuEmissor.on(nomeEvento, function (click) {
  console.log("um usuario clicou", click);
});

// meuEmissor.emit(nomeEvento, "na barra de rolagem");
// meuEmissor.emit(nomeEvento, "no okay");

// let count = 0;
// setInterval(function name(params) {
//   meuEmissor.emit(nomeEvento, "no okay " + count++);
// }, 1000);

const stdin = process.openStdin();
function main() {
  return new Promise((resolve, reject) => {
    stdin.addListener("data", (value) => {
      // console.log(`Você digitou: ${value.toString().trim()}`);
      return resolve(value);
    });
  });
}

main().then((resultado) => {
  console.log("resultado", resultado.toString());
});
