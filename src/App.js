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

    const addNewTask = (task) =>{
        setTasks([...tasks, task]);
    };

    return(
    <div className="grid-container">
        <div className="AddTask">
            <AddTask addNewTask={addNewTask}/>
        </div>
        <div className="CurTask">

        </div>
        <div className="TaskList">

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
export default App;
