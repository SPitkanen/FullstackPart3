const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const info = (length) => {
        return(`
            <div>
                <p>Phonebook has info for ${length} people</p>
                <p>${new Date()}</p>
            </div>
        `)
    }
    response.send(info(persons.length))
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.send(`<p>${person.number}</p>`)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}

const checkBody = (body) => {
    if (!body.name) {
        return 'Name missing'
    }

    if (!body.number) {
        return 'Number missing'
    }

    if (persons.find(person => person.name === body.name)) {
        return 'Name already exists'
    }

    if (persons.find(person => person.number === body.number)) {
        return 'Number already exists'
    }
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const message = checkBody(body)
    if (message) {
        return response.status(400).json({
            error: message
        }) 
    }

    const person = {
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateId(),
    }

    persons = persons.concat(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
