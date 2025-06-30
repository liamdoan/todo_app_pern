const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//get all todos
module.exports.getToDos = async (req, res) => {
    // res.send("helllo") //test if routes works
    try {
        const toDos = await prisma.toDo.findMany();
        res.send(toDos);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Failed to fetch tasks!"
        })
    }
};

//create a new todo
module.exports.saveToDo = async (req, res) => {
    const {task, description} = req.body;

    try {
        const newTodo = await prisma.toDo.create({
            data: {task, description}
        });

        console.log("new task saved!");
        res.status(201).send(newTodo);
    } catch (error) {
        console.error(error);
        res.send({error: error, msg: "Something is wrong creating a new task!"});
    }
};

//update a todo
module.exports.updateToDo = async (req, res) => {
    const {id} = req.params;
    const {task, description} = req.body;

    try {
        const updatedTodo = await prisma.toDo.update({
            where: {id},
            data: {task, description}
        })

        res.send({message: 'Task updated!', updatedTodo})
    } catch (error) {
        console.error(error);
        res.send({error: error, msg: "Something is wrong updating this task!"})
    }
};

//toggle
module.exports.toggleCompleted = async (req, res) => {
    // prisma doesnt have buil into toggle operator like mongo's aggregation pipeline
    // so, need to fetch current value
    // then, flip current value

    const { id } = req.params;

    try {
        const currentTodo = await prisma.toDo.findUnique({
            where: {id}
        })

        if (!currentTodo) {
            return res.status(500).send({message: "No task found!"})
        };

        const updatedTodo = await prisma.toDo.update({
            where:  {id},
            data: {
                isCompleted: !currentTodo.isCompleted
            }
        })

        res.status(200).send({ message: 'Task toggled!', updatedTodo})
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, msg: "Something went wrong toggling this task!" });
    }
};

//delete a todo
module.exports.deleteToDo = async (req, res) => {
    const {id} = req.params;

    try {
        await prisma.toDo.delete({
            where: {id}
        });

        res.status(200).send('Task deleted!')
    } catch (error) {
        console.error(error);
        res.send({error: error, msg: "Something is wrong deleting this task!"})
    }
};
