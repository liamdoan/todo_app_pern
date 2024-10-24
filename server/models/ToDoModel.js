const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ToDo', ToDoSchema);
