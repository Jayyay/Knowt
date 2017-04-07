const React = require('react');
const Blueprint = require('@blueprintjs/core');

class NoteExample extends React.Component {

  render() {
    return (

    <div className="pt-card pt-elevation-0 pt-interactive">
      <h5>Note Title</h5>
      <textarea rows="4" cols="50">
        This is where your type your notes
      </textarea>
    </div>
    );
  }
}

module.exports = NoteExample;
