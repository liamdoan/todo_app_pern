const ToDoModel = require('../models/ToDoModel');

//get all todos
module.exports.getToDos = async (req, res) => {
    // res.send("helllo") //test if routes works
    const toDos = await ToDoModel.find();
    res.send(toDos);
};

//create a new todo
module.exports.saveToDo = async (req, res) => {
    const {task} = req.body;

    ToDoModel.create({task})
    .then((data) => {
        console.log("new task saved!")
        res.status(201).send(data);
    }).catch((err) => {
        console.log(err);
        res.send({error: err, msg: "Something is wrong!"})
    })
};

//update a todo
module.exports.updateToDo = (req, res) => {
    const {id} = req.params;
    const {task} = req.body;

    ToDoModel.findByIdAndUpdate(id, {task})
    .then(() => res.send('Task updated'))
    .catch((err) => {
        console.log(err);
        res.send({error: err, msg: "Something is wrong!"})
    })
};

//delete a todo
module.exports.deleteToDo = (req, res) => {
    const {id} = req.params;

    ToDoModel.findByIdAndDelete(id)
    .then(() => res.send('Task deleted!'))
    .catch((err) => {
        console.log(err);
        res.send({error: err, msg: "Something is wrong!"})
    })
};
