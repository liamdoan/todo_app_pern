const router = require('express').Router();
const { getToDos, saveToDo, updateToDo, deleteToDo, toggleCompleted } = require('../controllers/ToDoController');

router.get('/get', getToDos);
router.post('/save', saveToDo);
router.put('/update/:id', updateToDo);
router.put('/toggle/:id', toggleCompleted);
router.delete('/delete/:id', deleteToDo);

module.exports = router;