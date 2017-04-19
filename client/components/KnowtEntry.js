const React = require('react');
const GlyphiconLink = require('./GlyphiconLink');
const Note = require('./note/Note.js');
const Panel = require('react-bootstrap').Panel;


const KnowtEntry = React.createClass({

  _components: {
    text: function(itemData) {
          return (<Note data={itemData} />);
        },
  },

  getComponent(data) {
    return this._components["text"].call(this, data);
  },

  handleClickEdit() {
    this.props.edit(this.props.itemData);
  },

  handleClickDelete() {
    if (!confirm('Are you sure?')) { return; }
    this.getDOMNode().classList.add('fade');
    this.timeout = setTimeout(() => {
      this.getDOMNode().classList.remove('fade'); // just don't ask.
      this.props.remove(this.props.itemData);
    }, 250); // .fade has a 250ms animation
  },

  handleDragStart(event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', this.props.key);
  },

  handleDragEnter(event) {
    event.preventDefault();
  },

  handleDragLeave(event) {
    this.unhighlight();
    event.preventDefault();
  },

  handleOnDragOver(event) {
    event.preventDefault();
    this.highlight();
  },

  handleOnDrop(event) {
    event.preventDefault();
    this.unhighlight();
    const newIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
    this.props.move(newIndex, this.props.key);
  },

  highlight() {
    this.getDOMNode().querySelector('.panel').classList.add('targetted');
  },

  unhighlight() {
    this.getDOMNode().querySelector('.panel').classList.remove('targetted');
  },

  render() {
    const panelHeader = (
      <h3>
        {this.props.itemData.title || 'Untitled'}
        <GlyphiconLink className="delete" href="#" glyph="trash" onClick={this.handleClickDelete} />
        <GlyphiconLink className="edit" href="#" glyph="edit" onClick={this.handleClickEdit} />
      </h3>
    );
    return (
      <div
        className="kept-panel"
        onDragStart={this.handleDragStart}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleOnDragOver}
        onDrop={this.handleOnDrop}
        onDragLeave={this.handleDragLeave}
        draggable="true"
      >
        <Panel bsStyle="primary" header={panelHeader}>
          {this.getComponent(this.props.itemData)}
        </Panel>
      </div>
    );
  },
});

module.exports = KnowtEntry;
