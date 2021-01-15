const express = require('express');
const router = express.Router();
const User = require('../models/User');

let userList = [
    new User({
        my_id: 1,
        firstName: 'John',
        lastName: 'Burbesis',
        email: 'John123@mymail.com'
    }),
    new User({
        my_id: 2,
        firstName: 'Maria',
        lastName: 'Veskouki',
        email: 'marakigtp@mymail.com'
    }),
    new User({
        my_id: 3,
        firstName: 'Sifsa',
        lastName: 'Ropt',
        email: 'siptar@mymail.com'
    })
];

router.get('/', (req, res) =>{
    res.send(userList);
});

router.get('/:userId', (req, res) =>{
    const userId = Number(req.params.userId);
    const lookup = userList.filter(user => user.my_id === userId);
    res.json(lookup[0]);
});

function verifyBody(body){
    return (body.firstName && body.lastName && body.email);
}

router.post('/', (req, res) => {
    if(!verifyBody(req.body)){
        res.send('give all fields: firstName, lastName, email');
        return;
    }

    const user = new User({
        my_id: userList[userList.length - 1].my_id + 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });

    //save this new user to the database
    /* ?? */
    userList.push(user);
    res.json(user);
});

router.put('/:userId', (req, res) => {
    if(!verifyBody(req.body)){
        res.send('give all fields: firstName, lastName, email');
        return;
    }

    const userId = Number(req.params.userId);
    //update this user on the database
    /* ?? */
    let found = false;
    let thisUser;
    userList.forEach(user => {
        if(user.my_id === userId){
            thisUser = user;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            found = true;
        }
    });
    if(!found){
        res.send(`There is no user with id = ${userId}`);
        return;
    }
    
    res.json(thisUser);
});

router.delete('/:userId', (req, res) => {
    const userId = Number(req.params.userId);
    //delete this user from the database
    /* ?? */

    userList = userList.filter(user => user.my_id !== userId);

    res.json(userList);
});

module.exports = router;