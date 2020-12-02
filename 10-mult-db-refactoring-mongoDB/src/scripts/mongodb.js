// docker ps
// docker exec -it c697802a706d mongo -u leonardojaques -p minhasenhasecreta --authenticationDatabase herois


// databases
show dbs

// mudando o contexto para uma database
use herois

// mostra as tabelas(coleções)
show collections

db.herois.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento:'1959-05-01'
})

db.herois.find()
db.herois.find().pretty()

for (let i = 0; i <= 50000; i++) {
  db.herois.insert({
  nome: `Clone-${i}`,
  poder: 'Velocidade',
  dataNascimento:'1959-05-01'
})
}

db.herois.findOne()
db.herois.find().limit(1000).sort({ nome: -1 })
db.herois.find({}, { poder: 1, _id: 0 })



//create
db.herois.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1959-05-01'
})

//read
db.herois.find()

//update
db.herois.update({ _id: ObjectId("5fc672f8cb32ba7f4fda9291") }, {
  nome: 'Jay Garrick'
})

db.herois.update({ _id: ObjectId("5fc67407cb32ba7f4fda9679") }, { $set: { nome: 'Barry Allen' }})

// acresente um item se estiver errado cuidado!!!
db.herois.update({ _id: ObjectId("5fc67407cb32ba7f4fda9679") }, { $set: { name: 'Barry Allen' } })

// por padrão ele só altera o primeiro item encontrado
db.herois.update({ poder: 'Velocidade' }, { $set: { poder: 'Super Força' } })

//delete
db.herois.remove({})
db.herois.remove({ nome: 'Barry Allen'})



db.herois.findOne({ _id: ObjectId("5fc67407cb32ba7f4fda9679") })