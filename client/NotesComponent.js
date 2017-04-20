const React = require('react');

// Module requires
const ToDoItem = require('./components/ToDoItem').default;
const AddItem = require('./components/AddItem').default;

// Create a component
class NotesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { todos: ['wash up', 'eat some cheese', 'take a nap'] };
    this.onDelete = this.onDelete.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  // Custom functions
  onDelete(item) {
    const updatedTodos = this.state.todos.filter((val, index) => item !== val);
    this.setState({
      todos: updatedTodos,
    });
  }

  onAdd(item) {
    const updatedTodos = this.state.todos;
    updatedTodos.push(item);
    this.setState({
      todos: updatedTodos,
    });
  }

  render() {
    let todos = this.state.todos;
    todos = todos.map((item, index) => (<ToDoItem key={index} item={item} onDelete={this.onDelete} />));
    return (
      <div id="todo-list">
        <p>The busiest people have the most leisure...</p>
        <ul>{todos}</ul>
        <AddItem onAdd={this.onAdd} />
      </div>
    );
  }

}

export default NotesComponent;
