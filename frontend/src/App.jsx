import { useState, useEffect } from 'react';
import './App.css';
import logo from "./assets/react.svg";

const API_BASE = 'http://localhost:4000/api/tasks';

function App() {
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Initialdaten vom Backend holen
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Fehler beim Laden der Tasks:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskDescription.trim()) return;

    const newTask = {
      taskdescription: taskDescription.trim(),
      done: false,
    };

    // Optional: An Backend senden
    fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((createdTask) => {
        setTasks((prev) => [...prev, createdTask]);
        setTaskDescription('');
      })
      .catch((err) => {
        console.error('Fehler beim Erstellen der Aufgabe:', err);
        // Fallback für Testbetrieb ohne Backend:
        setTasks((prev) => [...prev, { ...newTask, id: Date.now() }]);
        setTaskDescription('');
      });
  };

  const handleDelete = (id) => {
    // Zustand sofort aktualisieren
    setTasks(prev => prev.filter(t => t.id !== id));

    // REST-Delete am Server auslösen
    fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Löschen fehlgeschlagen: Status ${res.status}`);
        }
      })
      .catch(err => console.error('Fehler beim Löschen der Aufgabe:', err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>ToDo Liste</h1>
        <form className="todo-form" onSubmit={handleSubmit}>
          <label htmlFor="taskdescription">Neues Todo anlegen:</label>
          <input
            id="taskdescription"
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <button type="submit">Absenden</button>
        </form>
        <div>
          <ul className="todo-list">
            {tasks.map((task) => (
              <li key={task.id} className="todo-item">
                {task.taskdescription}
                <button
                  onClick={() => handleDelete(task.id)}
                  aria-label="Löschen"
                  className="delete-button"
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
