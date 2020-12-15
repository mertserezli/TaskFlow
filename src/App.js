import './App.css';
import React from "react";

function App() {
  return (
    <div className="App">
        <h1 style={{textAlign:"center"}}>Task Flow</h1>
        <TaskFlow/>
    </div>
  );
}

function TaskFlow() {
    return(
    <div className="grid-container">
        <div className="AddTask">

        </div>
        <div className="CurTask">

        </div>
        <div className="TaskList">

        </div>
    </div>
    )
}

export default App;
