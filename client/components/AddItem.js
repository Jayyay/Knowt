const React = require('react');

class AddItem extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
      // Custom functions
  handleSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.refs.newItem.value);
  }

  render() {
    return (
      <form id="add-todo" onSubmit={this.handleSubmit}>
        <input type="text" required ref="newItem" />
        <input type="submit" value="Add Note" />
      </form>
    );
  }
}

export default AddItem;
