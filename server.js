// Load packages
const express = require('express')
const mongo = require('mongodb').MongoClient

// Initializate app
const app = express()

// Connect MongoDB
const url = 'mongodb://localhost:27017'
let db, trips, expenses

mongo.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if(err) {
            console.log(err)
            return
        }
        console.log('mongo connected')
        db = client.db ('tripcost')
        trips = db.collection('trips')
        expenses = db.collection('expenses')
    }
)

// Use express.json() middleware
app.use(express.json())

// API endpoints
app.post('/trip', (req, res) => {
    const name = req.body.name
    trips.insertOne({ name: name}, (err, result) => {
        if(err) {
            console.log(err)
            res.status(500).json({ err: err })
            return
        }
        //console.log(result)
        res.status(200).json({ ok: true })
    })
})
app.get('/trips', (req, res) => {
    trips.find().toArray((err, items) => {
        if(err){
            console.log(err)
            res.status(500).json({ err: err})
            return
        }
        res.status(200).json({trips: items})
    })
})
app.post('/expense', (req, res) => {
    expenses.insertOne(
        {
            trip: req.body.trip,
            date: req.body.date,
            amount: req.body.amount,
            category: req.body.category,
            description: req.body.description
        },
        (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({ err: err })
                return
            }
            res.status(200).json({ ok: true })
        }
    )
})
app.get('/expenses', (req, res) => {
    expenses.find({trip: req.query.trip}).toArray((err, items) => {
        if(err){
            console.log(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ expenses: items })
    })
})

// for starting the server
app.listen(3000, () => console.log('Server ready'))