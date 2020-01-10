const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'chris',
        password: 'chris',
        database: 'smart-brain'
    }
});

db.select().from('users').then(data => {
    console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'Christian',
            email: 'christian_lehr@outlook.de',
            password: '4444',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {

    if (correctCredentials(req)) {
        res.json(database.users[0]);
    }
    if (wrongCredentials(req)) {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name } = req.body;

    db('users')
        .returning('*')
        .insert({
            name: name,
            email: email,
            joined: new Date()
        }).then(users => {
            res.json(users[0])
        })
        .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    db.select().from('users')
        .where({ 'id': id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            }
            res.status(404).json('Not found');
        })
        .catch(err => res.status(400).json('error getting user'));
})


app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'));
})


app.listen('3000', () => {
    console.log('app is running on port 3000');
})

function correctCredentials(req) {
    const request = req.body;
    const firstUser = database.users[0];

    return request.email === firstUser.email
        && request.password === firstUser.password;
}

function wrongCredentials(req) {
    return !correctCredentials(req);
}

