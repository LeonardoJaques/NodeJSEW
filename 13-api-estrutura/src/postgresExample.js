// npm install sequelize pg-hstore pg



async function main() {
  
  // await Herois.create({
  //   nome: 'Lanterna Verde',
  //   poder: 'Anel',
  // });

  const result = await Herois.findAll({ raw: true, attributes: ['nome'] });
  console.log('result', result);
}

main();
