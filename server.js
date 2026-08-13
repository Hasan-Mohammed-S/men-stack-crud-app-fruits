require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();



const methodOverride = require("method-override"); // new
const morgan = require("morgan"); // new

app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

const Fruit = require('./models/fruit');
app.use(express.urlencoded({ extended: false }))


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Home Route
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Add Fruit Form
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs");
});

// Create Fruit
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

// Index Fruit (All Fruits)
app.get('/fruits', async(req, res) => {

    try {
        const fruits = await Fruit.find();
        res.render("fruits/index.ejs", { fruits });
    } catch (err) {
        console.log(err);
        res.send('failed to get all fruits');
    }
});

// Show Fruit (One Fruit)
app.get('/fruits/:fruitId', async(req, res) => {
    try {
        const fruit = await Fruit.findById(req.params.fruitId);
        res.render("fruits/show.ejs", { fruit });
    } catch (err) {
        console.log(err)
    }
});

// Delete Fruit
app.delete("/fruits/:fruitId", async(req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
});

// Edit Fruit Form
app.get("/fruits/:fruitId/edit",
    async(req, res) => {
        try {
            const fruit = await Fruit.findById(req.params.fruitId)
            res.render('fruits/edit.ejs', { fruit })
        } catch (err) {
            console.log(err)
        }
    })

// Update Fruit
app.put('/fruits/:fruitId', async(req, res) => {
    try {
        if (req.body.isReadyToEat === "on") {
            req.body.isReadyToEat = true;
        } else {
            req.body.isReadyToEat = false;
        }
        await Fruit.findByIdAndUpdate(req.params.fruitId, req.body)
        res.redirect(`/fruits/${req.params.fruitId}`);
    } catch (err) {
        console.log(err)
    }
})

app.listen(3000, () => {
    console.log('server is running!!!!');
});