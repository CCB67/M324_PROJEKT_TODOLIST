import logo from './logo.svg';
import './App.css';
import React from 'react';
/**
 * ==================================
 * Gemeinsames Basisprojekt: ToDo-App
 * ==================================
 * Die Todo-App basiert auf einem React-JS Frontend und Rest-API mit Springboot-Framework (Deploy on JAR -> Docker).
 *
 * Execute and build information:
 *  - Frontend Start: npm start  (Terminalbefehl im Frontend Verzeichnis)
 *  - Backend Start: EE Eclipse-Projekt -> maven build -> spring-boot:run oder JAR auf docker mit Java 8 oder höher
 *  - Browser: http://localhost:3000 für Frontend; http://localhost:8080/ für Backend
 *
 * Aktuelle Featureliste:
 *  - Singlepage App
 *  - neues Todo in Textfeld eingeben, submit zum Speichern und direkt als Liste in der Eingabereihenfolge anzeigen
 *  - Speicherung zunächst nur "In memory"
 *  - im Moment nur ein Text Eingabefeld für die ToDo Beschreibung
 *  - alle offenen Todos werden als Liste angezeigt, jedes Todo hat einen Button zum "abschliessen" und
 *    werden dabei definitiv und ohne Bestätigung direkt gelöscht
 *
 * Mögliche Erweiterungen für die Lernenden:
 *  - Persistent storage (das MySQL Plugin ist im Spring-Framework bereits integriert)
 *  - Deadlines (duedate)
 *  - nicht löschen sondern mit Status (open, done) mit evtl. Anzeigefilter
 *  - Sortieren nach Deadline
 *  - Desing Verbesserungen
 *  - ...
 */
class App extends React.Component {

 /** The constructor is called when mounting App (see index.js).
  ** It sets up the initial state of the component (see below).
  ** The argument props will not be 'undefined' if in index.js App is instantiated with i.e.:
  **    const todoList = [{title: 'Task 1'}, {title: 'Task 2'}];
  **    ReactDOM.render(<App todos={todoList} />, document.getElementById('root'));).
  **
  ** It sets the component's initial state using the this.state object (see below).
  ** It will set the initial value of its todos property and will set its task property to "":
  **   todos: is an array of todos (todo list) and its value is either an empty array (if props.todos is undefined) or the value of props.todos. **(
  **   task:  is a string that holds the value of the input field.
  **
  ** The attribute state is a predefined term in React. It refers to the internal data storage for a React component.
  ** In React, state is used to store and manage component-level data that can change and affect the component's behavior and render output.
  ** The state can be updated using the setState method and accessed within the component using this.state.
  ** Note: state should only be modified using setState and should not be directly mutated.
  **       Direct mutations to state can cause unexpected behavior and bugs in the component.
  */
  constructor(props) {
    super(props);      // ensure that the constructor of the parent class (React.Component) is properly called.
    this.state = {
      todos: typeof props.todos === 'undefined' ? [] : props.todos,
      taskdescription: ""
    };
    // **( Remark:
    // If props.todos is of the type undefined, the expression typeof props.todos === 'undefined' will return true,
    // and the value of todos will be set to an empty array [] otherwise todos will be set to the value of props.todos.
    // By using this check, the component can accept an optional todos prop, or use an empty array as a default value.
  }

 /** Is called when ever the html input field value below changes to update the component's state.
  ** This is, because the submit should not take the field value directly.
  ** The task property in the state is used to store the current value of the input field as the user types into it.
  ** This is necessary because React operates on the principle of state and props, which means that a component's state
  ** determines the component's behavior and render.
  ** If we used the value directly from the HTML form field, we wouldn't be able to update the component's state and react to changes in the input field.
  */
  handleChange = event => {
    this.setState({ taskdescription: event.target.value });
  }

 /** Is called when the html form is submitted. It sends a POST request to the API endpoint '/tasks' and updates the component's state with the new todo.
  ** In this case a new taskdecription is added to the actual list on the server.
  */
  handleSubmit = event => {
    event.preventDefault();
    console.log("Sending task description to Spring-Server: "+this.state.taskdescription);
    fetch("http://localhost:8080/tasks", {  // API endpoint (the complete URL!) to save a taskdescription
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ taskdescription: this.state.taskdescription }) // both 'taskdescription' are identical to Task-Class attribute in Spring
    })
    .then(response => {
      console.log("Receiving answer after sending to Spring-Server: ");
      console.log(response);
      // window.location.href = "/"; // refresh window -> forces call of componentDidMount() to display the actual new list (with "flashing"!)
      // Alternative solution to the upper line without refresh "flashing":
      // add the new Task to list (temporary solution to show it immediately):
      //const newTodos = this.state.todos.slice(); // creates a copy of the current todos state, which returns a shallow copy of the array.
      //newTodos.push({taskdescription: this.state.taskdescription});    // pushes the new task object to the copy of the todos state array using the task.task attribute.
      this.setState({
        todos: [...this.state.todos, {taskdescription: this.state.taskdescription}]
      });          // updates the component state with the new todos array.
      this.setState({taskdescription: ""});             // clear input field, preparing it for the next input
    })
    .catch(error => console.log(error))
  }

 /** Is called when the component is mounted (after any refresh or F5).
  ** It updates the component's state with the fetched todos from the API Endpoint '/'.
  */
  componentDidMount() {
    fetch("http://localhost:8080")    // API endpoint (the complete URL!) to get a taskdescription-list
      .then(response => response.json())
      .then(data => {
        console.log("Receiving task list data from Spring-Server: ");
        console.log(data);
        this.setState({todos: data});  // set the whole list at once
      })
      .catch(error => console.log(error))
  }

 /** Is called when the Done-Butten is pressed. It sends a POST request to the API endpoint '/delete' and updates the component's state with the new todo.
  ** In this case if the task with the unique taskdecription is found on the server, it will be removed from the list.
  */
  handleClick = taskdescription => {
    console.log("Sending task description to delete on Spring-Server: "+taskdescription);
    fetch(`http://localhost:8080/delete`, { // API endpoint (the complete URL!) to delete an existing taskdescription in the list
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ taskdescription: taskdescription })
    })
    .then(response => {
      console.log("Receiving answer after deleting on Spring-Server: ");
      console.log(response);
      window.location.href = "/";
    })
    .catch(error => console.log(error))
  }

  /**
   * render all task lines
   * @param {*} todos : Task list
   * @returns html code snippet
   */
  renderTasks(todos) {
    return (
      <ul>
        {todos.map((todo, index) => (
          <li key={todo.taskdescription}>
            {"Task " + (index+1) + ": "+ todo.taskdescription}
            <button onClick={this.handleClick.bind(this, todo.taskdescription)}>Done</button>
          </li>
        ))}
      </ul>
    );
  }

 /** It returns the JSX code that describes the UI of the component.
  ** It renders the header, form, and todo list.
  */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>
            ToDo Liste
          </h1>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.taskdescription}
              onChange={this.handleChange}
            />
            <button type="submit">Absenden</button>
          </form>
          <div>
            {this.renderTasks(this.state.todos)}
          </div>
        </header>
      </div>
    );
  }

}

export default App;
