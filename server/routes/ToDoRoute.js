const router = require('express').Router();
const { getToDo, saveToDo } = require('../controllers/ToDoController');

router.get('/', getToDo);
router.post('/save', saveToDo);


module.exports = router;