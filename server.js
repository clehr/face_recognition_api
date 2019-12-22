const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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

    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });

    if (!found) {
        return res.status(404).json("not found");
    }
})


app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });

    if (!found) {
        return res.status(404).json("not found");
    }
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

