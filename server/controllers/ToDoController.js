const ToDoModel = require('../database/models/ToDoModel');

//get all todos
module.exports.getToDos = async (req, res) => {
    // res.send("helllo") //test if routes works
    const toDos = await ToDoModel.find();
    res.send(toDos);
};

//create a new todo
module.exports.saveToDo = async (req, res) => {
    const {task, description} = req.body;

    ToDoModel.create({task, description})
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
    const {task, description} = req.body;

    ToDoModel.findByIdAndUpdate(id, {task, description}, {new: true})
    .then((updatedTodo) => res.send({message: 'Task updated!', updatedTodo}))
    .catch((err) => {
        console.log(err);
        res.send({error: err, msg: "Something is wrong!"})
    })
};

//toggle
module.exports.toggleCompleted = (req, res) => {
    const { id } = req.params;

    ToDoModel.findByIdAndUpdate(
        id,
        [{ $set: { isCompleted: { $not: "$isCompleted" } } }], // Toggle isCompleted using aggregation pipeline
        { new: true }
    )
        .then((updatedTodo) => {
            if (!updatedTodo) {
                return res.status(404).send({ message: 'Task not found' });
            }
            res.send({ message: 'Task toggled!', updatedTodo });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ error: err, msg: "Something went wrong!" });
        });
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


//------------
// module.exports.toggleCompleted = (req, res) => {
//     const { id } = req.params;

//     // First, find the document to get the current state of `isCompleted`
//     ToDoModel.findById(id)
//         .then((todo) => {
//             if (!todo) {
//                 return res.status(404).send({ message: 'Task not found' });
//             }

//             // Flip the value of `isCompleted`
//             todo.isCompleted = !todo.isCompleted;

//             // Save the updated document
//             return todo.save();
//         })
//         .then((updatedTodo) => res.send({ message: 'Task updated', updatedTodo }))
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send({ error: err, msg: "Something went wrong!" });
//         });
// };
