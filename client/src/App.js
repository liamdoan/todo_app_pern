import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { baseUrl } from './utils/api';
import Spinner from './component/Spinner';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState('');
    const [desc, setDesc] = useState('');

    const [todoEditing, setTodoEditing] = useState(null);

    const [editingText, setEditingText] = useState('');
    const [editingDesc, setEditingDesc] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await axios.get(`${baseUrl}/get`);
                setTodos(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    // SUBMIT
    const addTask = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${baseUrl}/save`, { task: todo, description: desc });

            setTodos([...todos, res.data]);
            setTodo('');
            setDesc('');
        } catch (error) {
            console.error(error);
        }
    };

    // EDIT/UPDATE
    const editTask = async (id) => {
        try {
            const res = await axios.put(`${baseUrl}/update/${id}`, { task: editingText, description: editingDesc });
            const updatedTodos = todos.map((todo) =>
                todo.id === id
                    ? {
                          ...todo,
                          task: res.data.updatedTodo.task,
                          description: res.data.updatedTodo.description,
                          updatedAt: res.data.updatedTodo.updatedAt,
                      }
                    : todo
            );
            setTodos(updatedTodos);
            // reset
            setTodoEditing(null);
            setEditingText('');
            setEditingDesc('');
        } catch (error) {
            console.error(error);
        }
    };

    // CANCEL EDITING/UPDATING
    const cancelEditTask = () => {
        setTodoEditing(null);
        setEditingText('');
        setEditingDesc('');
    };

    // DELETE
    const deleteTask = async (id) => {
        try {
            await axios.delete(`${baseUrl}/delete/${id}`);
            const updatedTodos = [...todos].filter((todo) => todo.id !== id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error(error);
        }
    };

    // TOGGLE COMPLETE
    const toggleCompleted = async (id) => {
        try {
            const res = await axios.put(`${baseUrl}/toggle/${id}`);
            const updatedTodos = todos.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: res.data.updatedTodo.isCompleted } : todo
            );
            setTodos(updatedTodos);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="wrapper">
            <h1 data-testid="app-title">My Tasks</h1>
            {/*FORM*/}
            <form className="todo-form" onSubmit={addTask}>
                <div className="input-column">
                    <input
                        type="text"
                        placeholder="Task"
                        onChange={(e) => setTodo(e.target.value)}
                        value={todo}
                        className="todo-input"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                        className="desc-input"
                    />
                </div>
                <button className="submit-button" type="submit" aria-label="add task button">
                    Add Tasks
                </button>
            </form>
            {loading ? (
                <Spinner />
            ) : (
                todos.map((todo) => (
                    <div className="todo-row" key={todo.id}>
                        {todoEditing === todo.id ? (
                            <div className="input-edit-wrap">
                                <input
                                    className="input-edit-task"
                                    type="text"
                                    onChange={(e) => setEditingText(e.target.value)}
                                    value={editingText}
                                />
                                <input
                                    className="input-edit-desc"
                                    type="text"
                                    onChange={(e) => setEditingDesc(e.target.value)}
                                    value={editingDesc}
                                />
                            </div>
                        ) : (
                            <div className="input-show">
                                <p className="input-show-name">{todo.task}</p>
                                <p className="input-show-desc">{todo.description}</p>
                                <p className="input-show-time">
                                    <span className="span-time">
                                        Created at: {new Date(todo.createdAt).toLocaleString()}
                                    </span>
                                    <br />
                                    <span className="span-time">
                                        Updated at: {new Date(todo.updatedAt).toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        )}
                        {/* 'todo' is changable */}
                        <div className="buttons">
                            {todoEditing === todo.id ? (
                                <>
                                    <button
                                        data-testid={`submit-edit-btn-${todo.id}`}
                                        className="submit-edit-btn"
                                        aria-label="submit edit task button"
                                        onClick={() => editTask(todo.id)}
                                    >
                                        Submit Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => cancelEditTask()}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        data-testid={`checkbox-${todo.id}`}
                                        type="checkbox"
                                        onChange={() => toggleCompleted(todo.id)}
                                        checked={todo.isCompleted}
                                        className="check-complete"
                                    />
                                    <button
                                        data-testid={`edit-btn-${todo.id}`}
                                        className="edit-btn"
                                        aria-label="edit task button"
                                        onClick={() => {
                                            setTodoEditing(todo.id);
                                            setEditingText(todo.task);
                                            setEditingDesc(todo.description);
                                        }}
                                    >
                                        Edit Tasks
                                    </button>
                                    <button
                                        data-testid={`delete-btn-${todo.id}`}
                                        className="delete-btn"
                                        onClick={() => deleteTask(todo.id)}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default App;

//Test client side

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
//         isCompleted: false
//     }
//     setTodos([...todos].concat(newTodo))
//     setTodo("")
//     setDesc("")
// };

// // TOGGLE COMPLETE
// function toggleComplete(id) {
//     const updatedTodos = [...todos].map((todo) => {
//         if (todo.id === id) {
//             todo.completed = !todo.completed;
//         }
//         return todo;
//     });
//     setTodos(updatedTodos);
// }

// // DELETE
// function deleteTodo(id) {
//     const updatedTodos = [...todos].filter(todo => todo.id !== id)
//     setTodos(updatedTodos)
//make deleted task disappear on screen
// }

// // EDIT TODO
// function editTodo(id) {
//     const updatedTodos = [...todos].map(todo => {
//         if(todo.id === id ) {
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
