import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!localStorage) return;
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      const parsedTodos = JSON.parse(localTodos);
      if (Array.isArray(parsedTodos)) {
        setTasks(parsedTodos);
      } else {
        setTasks([]);
      }
    }
  }, []);

  function persistData(newList) {
    localStorage.setItem("todos", JSON.stringify(newList));
  }

  function inputHandle(event) {
    setTodoValue(event.target.value);
  }

  function addTask() {
    if (!todoValue) return;
    const newTaskList = [
      ...tasks,
      {
        text: todoValue,
        complete: false,
      },
    ];
    setTasks(newTaskList);
    persistData(newTaskList);
    setTodoValue("");
  }

  function completeTask(index) {
    const newTaskList = tasks.map((task, i) =>
      i === index ? { ...task, complete: !task.complete } : task
    );
    setTasks(newTaskList);
    persistData(newTaskList);
  }

  function deleteTask(index) {
    const newTaskList = tasks.filter((task, i) => i !== index);
    setTasks(newTaskList);
    persistData(newTaskList);
  }

  function editTask(index) {
    setTodoValue(tasks[index].text);
    deleteTask(index);
  }
  function moveUp(index) {
    if (index > 0) {
      const newTaskList = [...tasks];
      [newTaskList[index - 1], newTaskList[index]] = [
        newTaskList[index],
        newTaskList[index - 1],
      ];
      setTasks(newTaskList);
      persistData(newTaskList);
    }
  }

  function moveDown(index) {
    if (index < tasks.length - 1) {
      const newTaskList = [...tasks];
      [newTaskList[index], newTaskList[index + 1]] = [
        newTaskList[index + 1],
        newTaskList[index],
      ];
      setTasks(newTaskList);
      persistData(newTaskList);
    }
  }

  function getFiltered() {
    if (filter === "All") return tasks;
    if (filter === "Completed") return tasks.filter((task) => task.complete);
    if (filter === "Pending") return tasks.filter((task) => !task.complete);
    return [];
  }

  return (
    <>
      <h1>Todo-list</h1>
      <div className="inputs">
        <input
          type="text"
          placeholder="Enter Task"
          onChange={inputHandle}
          value={todoValue}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <div className="filters">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
      </div>
      <div className="list">
        <ul>
          {getFiltered().map((task, index) => (
            <li key={index}>
              <span>{task.text}</span>
              <div className="task-action">
                <button onClick={() => completeTask(index)}>
                  {task.complete ? "Undo" : "Complete"}
                </button>
                <button onClick={() => editTask(index)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
                <button onClick={() => moveUp(index)}>Up</button>
                <button onClick={() => moveDown(index)}>Down</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
