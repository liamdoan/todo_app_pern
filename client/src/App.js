import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css';
import { baseUrl } from './utils/api';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState("");
    const [desc, setDesc] = useState("");

    const [todoEditing, setTodoEditing] = useState(null);

    const [editingText, setEditingText] = useState("");
    const [editingDesc, setEditingDesc] = useState("");

    useEffect(() => {
        axios.get(`${baseUrl}/get`)
        .then ((res) => {
            console.log(res.data)
            setTodos(res.data)
        })
    }, [])

    // SUBMIT
    const addTask = () => {
        axios
        .post(`${baseUrl}/save`, {task: todo, description: desc})
        .then ((res) => {
            console.log(res.data);
            setTodo("");
            setDesc("");
        })
    }

    // TOGGLE COMPLETE
    function toggleComplete(_id) {
        const updatedTodos = [...todos].map(todo => {
            if (todo._id === _id) {
                todo.completed = !todo.completed
            }
            return todo
        })
        setTodos(updatedTodos)
    }

    // EDIT/UPDATE
    const editTask = (id) => {
        axios
        .put(`${baseUrl}/update/${id}`, {task: editingText, description: editingDesc})
        .then((res) => {
            console.log(res.data);
            const updatedTodos = todos.map(todo => 
                todo._id === id ? { ...todo, task: res.data.updatedTodo.task, description: res.data.updatedTodo.description, updatedAt: res.data.updatedTodo.updatedAt } : todo
            );
            setTodos(updatedTodos)
            // reset
            setTodoEditing(null)
            setEditingText("")
            setEditingDesc("")
        })
    }

    // CANCEL EDITING/UPDATING
    const cancelEditTask = () => {
        setTodoEditing(null)
        setEditingText("")
        setEditingDesc("")
    }

    // DELETE
    const deleteTask = (id) => {
        axios
        .delete(`${baseUrl}/delete/${id}`)
        .then((res) => {
            console.log(res.data);
            const updatedTodos = [...todos].filter(todo => todo._id !== id)
            setTodos(updatedTodos)
        })
    }

    return (
        <div className="wrapper">
            <h1>Tasks for today</h1>
            {/*FORM*/}
            <form className="todo-form" onSubmit={addTask}>
                <div className="input-column">
                <input type="text" 
                        placeholder="Task"
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
                        key={todo._id}
                >
                    {
                    todoEditing === todo._id 
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
                            <p className="input-show-name">{todo.task}</p>
                            <p className="input-show-desc">{todo.description}</p>
                            <p className="input-show-time">
                                <span className="span-time">Created at: {new Date(todo.createdAt).toLocaleString()}</span>
                            </p>
                            <p className="input-show-time">
                            <span className="span-time">Updated at: {new Date(todo.updatedAt).toLocaleString()}</span>
                            </p>
                        </div>
                    }
                    {/* 'todo' is changable */}
                    <div className="buttons">
                        {
                            todoEditing === todo._id 
                            ?   
                                <>
                                    <button 
                                        className="submit-edit-btn" 
                                        onClick={() => editTask(todo._id)}
                                    >
                                        Submit Edit
                                    </button>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => cancelEditTask()}
                                        >
                                            Cancel
                                    </button>
                                </>
                            :   
                                <>
                                    <input 
                                        type="checkbox" 
                                        onChange={() => toggleComplete(todo._id)}
                                        checked={todo.completed}
                                        className="check-complete"
                                    />
                                    <button 
                                        className="edit-btn" 
                                        onClick={() => {
                                            setTodoEditing(todo._id)
                                            setEditingText(todo.task); // keep current text
                                            setEditingDesc(todo.description); // keep current desc
                                        }}
                                    >
                                        Edit Tasks
                                    </button>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => deleteTask(todo._id)}
                                        >
                                            Delete
                                    </button>
                                </>
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default App;

    // let time = String(new window.Date());
    // let date = time.slice(0,25);

    // // SUBMIT
    // function handleSubmit(e) {
    //     e.preventDefault();

    //     const newTodo = {
    //         id: new Date().getTime(),
    //         // better to have id when working with multiple object
    //         timeCreate: "Created: " + date,
    //         timeUpdate: "",
    //         text: todo,
    //         description: desc,
    //         completed: false
    //     }
    //     setTodos([...todos].concat(newTodo))
    //     setTodo("")
    //     setDesc("")
    // };

    // // DELETE
    // function deleteTodo(_id) {
    //     const updatedTodos = [...todos].filter(todo => todo._id !== _id)
    //     setTodos(updatedTodos)
            //make deleted task disappear on screen
    // }

    // // EDIT TODO
    // function editTodo(id) {
    //     const updatedTodos = [...todos].map(todo => {
    //         if(todo._id === id ) {
    //             todo.text = editingText
    //             todo.description = editingDesc
    //             todo.timeUpdate = "Updated: " + date
    //         }
    //         return todo
    //     })
    //     setTodos(updatedTodos)
    //     // reset
    //     setTodoEditing(null)
    //     setEditingText("")
    //     setEditingDesc("")
    // }