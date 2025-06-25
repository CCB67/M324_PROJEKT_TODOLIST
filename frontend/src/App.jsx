import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Initialdaten vom Backend holen
    fetch('http://localhost:8080/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Fehler beim Laden der Tasks:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskDescription.trim()) return;

    const newTask = {
      description: taskDescription.trim(),
      done: false,
    };

    // Optional: An Backend senden
    fetch('http://localhost:8080/api/tasks', {
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

  // Löschen-Handler: entfernt aus State und ruft DELETE-API auf
  const handleDelete = (id) => {
    // State aktualisieren
    setTasks((prev) => prev.filter((t) => t.id !== id));

    // Optional: Backend informieren
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'DELETE',
    }).catch((err) =>
      console.error('Fehler beim Löschen der Aufgabe:', err)
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="/src/assets/react.svg" className="App-logo" alt="logo" />
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
                {task.description}
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
