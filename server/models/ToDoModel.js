const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ToDo', ToDoSchema);
