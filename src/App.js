import './App.css';
import React, {useState, useEffect} from "react";

function App() {
  return (
    <div className="App">
        <h1 style={{textAlign:"center"}}>Task Flow</h1>
        <TaskFlow/>
    </div>
  );
}

let timeout;

function TaskFlow() {
    const [tasks, setTasks] = useState([]);
    const [curTask, setCurTask] = useState(null);

    const addNewTask = (task) => {
        const newTasks = [...tasks, task];
        setTasks(newTasks);
        pickTask(newTasks);
    };

    const removeTask = (task) => {
        const newTasks = [...tasks.filter((t)=> t.title !== task.title)];
        setTasks(newTasks);
        pickTask(newTasks);
    };

    const editTask = (task) => {
        const newTasks = [...tasks.filter((t)=> t.title !== task.title), task];
        setTasks(newTasks);
        pickTask(newTasks);
    };

    const importTasks = (importedTasks) => {
        const newTasks = [...tasks, ...importedTasks];
        setTasks(newTasks);
        pickTask(newTasks);
    };

    function pickTask(tasks){
        clearTimeout(timeout);
        const eligibleTasks = tasks.filter((t) => t.date < new Date()).sort((a, b)=> a.urgency - b.urgency);
        if(0 < eligibleTasks.length) {
            setCurTask(eligibleTasks[0]);
        }else{
            setCurTask(null);
            if (0 < tasks.length) {
                const closest = Math.min(...tasks.map(t => t.date.getTime()));
                timeout = setTimeout(()=>pickTask(tasks), closest - new Date().getTime() + 500);
            }
        }
    }


    return(
    <div className="grid-container">
        <div className="AddTask">
            <AddTask addNewTask={addNewTask}/>
        </div>
        <div className="CurTask">
            {curTask ? <CurrentTask task={curTask} editTask={editTask} /> : <></>}
        </div>
        <div className="TaskList">
            <TaskList tasks={tasks} removeTask={removeTask} importTasks={importTasks}/>
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
        addNewTask({title, urgency, description, date: new Date()});
        setTitle("");
        setUrgency("");
        setDescription("");
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

function CurrentTask({task, editTask}){
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

    useEffect(() => {
        setTitle(task.title);
        setUrgency(task.urgency);
        setDescription(task.description);
        setScheduledMinLater(30);
    }, [task]);

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

            <label htmlFor="postpone">Schedule later:</label><br/>
            <input type="number" placeholder="How long to postpone in minutes" name="postpone" id="postpone" required
                   value={scheduledMinLater} onChange={event => setScheduledMinLater(parseInt(event.target.value))} /><br/><br/>

            <input type="submit" value="Submit" />
        </form>
    </>
    )
}

const exportToJson = (object)=>{
    let filename = "TaskFlow-export.json";
    let contentType = "application/json;charset=utf-8;";
    object = object.map(task =>{ return {title: task.title, urgency: task.urgency, description: task.description }});
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        let blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(object)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        let a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(object));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

function TaskList(props){
    const tasks = props.tasks;
    const removeTask = props.removeTask;
    const importTasks = props.importTasks;

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

    const importJSON = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            let cardsToImport = JSON.parse(e.target.result);
            cardsToImport.forEach(task => task.date = new Date());
            importTasks(cardsToImport)
        };
    };

    return(
    <>
        <button onClick={() => exportToJson(tasks)}>
            Export
        </button>
        <label htmlFor="avatar">Import: </label>
        <input type="file" id="avatar" name="import" accept=".json" onChange={importJSON}/>
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
    </>
    )
}

export default App;
