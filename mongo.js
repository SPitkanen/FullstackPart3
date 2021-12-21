const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give arguments')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://santeripitkanen:${password}@cluster0.5xi9m.mongodb.net/personsdb?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (number == null && name == null) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(response => {
        console.log('Added: ', name, ' number: ', number, ' to phonebook')
        mongoose.connection.close()
    })
}