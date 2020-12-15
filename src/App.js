import './App.css';
import React, {useState} from "react";

function App() {
  return (
    <div className="App">
        <h1 style={{textAlign:"center"}}>Task Flow</h1>
        <TaskFlow/>
    </div>
  );
}

function TaskFlow() {
    const [tasks, setTasks] = useState([]);

    const addNewTask = (task) => setTasks([...tasks, task]);

    const removeTask = (task)=> setTasks(tasks.filter((t)=> t.title !== task.title));

    return(
    <div className="grid-container">
        <div className="AddTask">
            <AddTask addNewTask={addNewTask}/>
        </div>
        <div className="CurTask">

        </div>
        <div className="TaskList">
            <TaskList tasks={tasks} removeTask={removeTask}/>
        </div>
    </div>
    )
}

function AddTask(props){
    const addNewTask = props.addNewTask;

    const [title, setTitle] = useState([]);
    const [urgency, setUrgency] = useState([]);
    const [description, setDescription] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        addNewTask({title, urgency, description, date: new Date()})
    };

    return(
    <>
        <form onSubmit={handleSubmit}>
            <h2>Add Task</h2>

            <label htmlFor="title"><b>Title</b></label>
            <input placeholder="Enter Title" name="title" id="title" required
                   value={title} onChange={event => setTitle(event.target.value)} />

            <label htmlFor="urgency"><b>Urgency</b></label>
            <input type="number" placeholder="Enter urgency(1-4)" name="urgency" id="urgency" required
                   value={urgency} onChange={event => setUrgency(event.target.value)} />

            <label htmlFor="description"><b>Description</b></label>
            <textarea placeholder="Enter description" rows="4" cols="50" name="description" id="description" required
                      value={description} onChange={event => setDescription(event.target.value)} />

            <input type="submit" value="Submit" />
        </form>
    </>
    )
}

function TaskList(props){
    const tasks = props.tasks;
    const removeTask = props.removeTask;

    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
    };

    return(
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Urgency</th>
                <th>Time</th>
                <th>Description</th>
                <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {tasks.map(t=>
                <tr key={t.title}>
                    <td>{t.title}</td>
                    <td>{t.urgency}</td>
                    <td>{convertTime12to24(t.date.toLocaleTimeString())}</td>
                    <td>{t.description}</td>
                    <td><button onClick={()=>removeTask(t)}>❌</button></td>
                </tr>
            )}
            </tbody>
        </table>
    )
}

export default App;
