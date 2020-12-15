import './App.css';
import React, {useState, useEffect, useCallback} from "react";

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
    const [curTask, setCurTask] = useState(null);

    const addNewTask = (task) => setTasks([...tasks, task]);

    const removeTask = (task) => {
        setTasks(tasks.filter((t)=> t.title !== task.title));
        setCurTask(null)
    };

    const editTask = (task) => {
        setTasks([...tasks.filter((t)=> t.title !== task.title), task]);
        setCurTask(null)
    };

    const pickTask = useCallback(() =>{
        const eligibleTasks = tasks.filter((t) => t.date < new Date());
        eligibleTasks.sort((a, b)=> a.priority - b.priority);
        setCurTask(eligibleTasks[0]);
    },[tasks]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!curTask){
                pickTask()
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [curTask, pickTask]);

    return(
    <div className="grid-container">
        <div className="AddTask">
            <AddTask addNewTask={addNewTask}/>
        </div>
        <div className="CurTask">
            {curTask ? <CurrentTask task={curTask} editTask={editTask} /> : <></>}
        </div>
        <div className="TaskList">
            <TaskList tasks={tasks} removeTask={removeTask}/>
        </div>
    </div>
    )
}

function AddTask(props){
    const addNewTask = props.addNewTask;

    const [title, setTitle] = useState("");
    const [urgency, setUrgency] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        addNewTask({title, urgency, description, date: new Date()})
    };

    return(
    <>
        <form onSubmit={handleSubmit}>
            <h2>Add Task</h2>

            <label htmlFor="title">Title:</label><br/>
            <input placeholder="Enter Title" name="title" id="title" required
                   value={title} onChange={event => setTitle(event.target.value)} /><br/>

            <label htmlFor="urgency">Urgency:</label><br/>
            <input type="number" placeholder="Enter urgency(1-4)" name="urgency" id="urgency" required
                   value={urgency} onChange={event => setUrgency(parseInt(event.target.value))} /><br/>
            <div>
                <label htmlFor="description">Description:</label><br/>
                <textarea placeholder="Enter description" rows="4" cols="50" name="description" id="description" required
                          value={description} onChange={event => setDescription(event.target.value)} />
            </div><br/><br/>
            <input type="submit" value="Submit" />
        </form>
    </>
    )
}

function CurrentTask(props){
    const task = props.task;
    const editTask = props.editTask;

    const [title, setTitle] = useState(task.title);
    const [urgency, setUrgency] = useState(task.urgency);
    const [description, setDescription] = useState(task.description);
    const [scheduledMinLater, setScheduledMinLater] = useState(30);

    const handleSubmit = (event) => {
        event.preventDefault();
        const scheduleDate = new Date();
        scheduleDate.setMinutes(scheduleDate.getMinutes() + scheduledMinLater);
        editTask({title, urgency, description, date: scheduleDate})
    };

    return(
    <>
        <form onSubmit={handleSubmit}>
            <h2>Current Task</h2>

            <label htmlFor="title">Title:</label><br/>
            <input placeholder="Enter Title" name="title" id="title" required
                   value={title} onChange={event => setTitle(event.target.value)} /><br/>

            <label htmlFor="urgency">Urgency:</label><br/>
            <input type="number" placeholder="Enter urgency(1-4)" name="urgency" id="urgency" required
                   value={urgency} onChange={event => setUrgency(parseInt(event.target.value))} /><br/>

            <div>
                <label htmlFor="description">Description:</label><br/>
                <textarea placeholder="Enter description" rows="4" cols="50" name="description" id="description" required
                          value={description} onChange={event => setDescription(event.target.value)} /><br/>
            </div>

            <label htmlFor="urgency">Schedule later:</label><br/>
            <input type="number" placeholder="Enter urgency(1-4)" name="urgency" id="urgency" required
                   value={scheduledMinLater} onChange={event => setScheduledMinLater(parseInt(event.target.value))} /><br/><br/>

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
