require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Fruit = require('./models/fruit');
app.use(express.urlencoded({ extended: false }))


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs");
});

app.post('/fruits', async(req, res) => {
    console.log(req.body)
    try {
        if (req.body.isReadyToEat === "on") {
            req.body.isReadyToEat = true;
        } else {
            req.body.isReadyToEat = false;
        }
        await Fruit.create(req.body);
        res.redirect("/fruits");
    } catch (err) {

        console.log(err);
        res.send('failed to create')

    }

});

app.get('/fruits', async(req, res) => {

    try {
        const fruits = await Fruit.find();
        res.send(fruits);
    } catch (err) {
        console.log(err);
        res.send('failed to get all fruits');
    }


});
app.listen(3000, () => {
    console.log('server is running!!!!');
});