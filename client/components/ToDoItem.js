const React = require('react');

// Create TodoItem component
class ToDoItem extends React.Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }
  // Custom functions
  handleDelete() {
    this.props.onDelete(this.props.item);
  }

  render() {
    return (
      <li>
        <div className="todo-item">
          <span className="item-name" ref="thisItem">{this.props.item}</span>
          <span className="item-remove" onClick={this.handleDelete}> x </span>
        </div>
      </li>
    );
  }
}

export default ToDoItem;
