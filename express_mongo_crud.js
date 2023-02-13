const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var TodoSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        required: true
    },
    taskName: {
        type: String,
        required: true
    },
    taskPriority: {
        type: Number,
        required: true
    },
    taskDependency: {
        type: Number,
        required: false
    },
});

var Todos = mongoose.model('todos', TodoSchema)

//Body Parser Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

mongoose
    .connect("mongodb://localhost:27017/taskCrud", { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/getall', async (req, res) => {
    try {
        var getData = await Todos.find()
        res.json(getData)
    } catch (err) {
        res.status(400).json()
    }

})
app.get('/get/:id', async (req, res) => {
    try {
        var getData = await Todos.findOne({ taskId: req.params.id })
        res.json(getData)
    } catch (err) {
        res.status(400).json()
    }

})


app.post('/insert', async (req, res) => {
    try {
        var newTask = new Todos({
            taskId: req.body.taskId,
            taskName: req.body.taskName,
            taskPriority: req.body.taskPriority

        });
        newTask.save()
            .then(task => {
                res.json(task)
            }).catch(err => {
                res.status(400).json({ error: err })

            })

    } catch (err) {
        res.status(400).json({ error: err })
    }

})

app.post('/update/:id', async (req, res) => {
    try {
        Todos.findOneAndUpdate({ taskId: req.params.id }, { $set: req.body }, { new: true })
            .then(async task => {
                res.json(task)
            }).catch(err => {
                res.status(400).json(err);
            })
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

app.get('/delete/:id', async (req, res) => {
    try {
        Todos.remove({ taskId: req.params.id })
            .then(async task => {
                res.json(task)
            }).catch(err => {
                res.status(400).json(err);
            })
    } catch (err) {
        res.status(400).json({ error: err })
    }
})


app.listen(5001, () => {
    console.log("SERVER STARTED")
})