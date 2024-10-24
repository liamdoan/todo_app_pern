import React, {useState} from 'react'
import './App.css';


const App = () => {
    let time = String(new window.Date());
    let date = time.slice(0,25);

    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState("");
    const [desc, setDesc] = useState("");

    const [todoEditing, setTodoEditing] = useState(null);

    const [editingText, setEditingText] = useState("");
    const [editingDesc, setEditingDesc] = useState("");

    // SUBMIT
    function handleSubmit(e) {
        e.preventDefault();

        const newTodo = {
        id: new Date().getTime(),
        // better to have id when working with multiple object
        timeCreate: "Created at: " + date,
        timeUpdate: "",
        text: todo,
        description: desc,
        completed: false
        }
        setTodos([...todos].concat(newTodo))
        setTodo("")
        setDesc("")
    };

    // TOGGLE COMPLETE
    function toggleComplete(id) {
        const updatedTodos = [...todos].map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed
        }
        return todo
        })
        setTodos(updatedTodos)
    }

    // EDIT TODO
    function editTodo(id) {
        const updatedTodos = [...todos].map(todo => {
        if(todo.id === id ) {
            todo.text = editingText
            todo.description = editingDesc
            todo.timeUpdate = "Update at: " + date
        }
        return todo
        })
        setTodos(updatedTodos)
        // reset
        setTodoEditing(null)
        setEditingText("")
        setEditingDesc("")
    }

    // DELETE
    function deleteTodo(id) {
        const updatedTodos = [...todos].filter(todo => todo.id !== id)
        setTodos(updatedTodos)
    }

    return (
        <div className="wrapper">
            <h1>Tasks for today</h1>
            {/*FORM*/}
            <form className="todo-form" onSubmit={handleSubmit}>
                <div className="input-column">
                <input type="text" 
                        placeholder="What to do"
                        onChange={(e) => setTodo(e.target.value)}
                        value={todo}
                        className="todo-input"/>
                <input type="text" 
                        placeholder="Description"
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                        className="desc-input"/>
                </div>
                <button className="submit-button" 
                        type="submit"
                        >
                        Add Tasks
                </button>
            </form>
            {/*LIST*/}
            {todos.map(todo => 
                <div className="todo-row" 
                        key={todo.id}>
                    {
                    todoEditing === todo.id 
                    ? 
                    <div className="input-edit-wrap">  
                        <input type="text" 
                            onChange={(e) => setEditingText(e.target.value)} 
                            value={editingText}/>
                        <input type="text" 
                            onChange={(e) => setEditingDesc(e.target.value)} 
                            value={editingDesc}/>
                    </div>
                    : 
                    <div className="input-show">
                        <p className="input-show-name">{todo.text}</p>
                        <p className="input-show-desc">{todo.description}</p>
                        <p className="input-show-time">
                            <span className="span-time">{todo.timeCreate}</span>
                        </p>
                        <p className="input-show-time">
                        <span className="span-time">{todo.timeUpdate}</span>
                        </p>
                    </div>
                    }
                    {/* 'todo' is changable */}
                    <div className="buttons">
                        <input 
                            type="checkbox" 
                            onChange={() => toggleComplete(todo.id)}
                            checked={todo.completed}
                            className="check-complete"
                        />
                        {
                            todoEditing === todo.id 
                            ?   <button 
                                    className="submit-edit-btn" 
                                    onClick={() => editTodo(todo.id)}
                                >
                                    Submit Edit
                                </button>
                            :   <button 
                                    className="edit-btn" 
                                    onClick={() => setTodoEditing(todo.id)}
                                >
                                    Edit Tasks
                                </button>
                        }
                        <button 
                            className="delete-btn" 
                            onClick={() => deleteTodo(todo.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App;
