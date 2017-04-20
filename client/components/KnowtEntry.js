const React = require('react');
const GlyphiconLink = require('./GlyphiconLink');
const Note = require('./note/Note.js');
const Panel = require('react-bootstrap').Panel;
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
const Draggable = require('react-draggable');
import ReactDOM from 'react-dom';
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
    ReactDOM.findDOMNode(this).classList.add('fade');
    this.timeout = setTimeout(() => {
      ReactDOM.findDOMNode(this).classList.remove('fade');
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

    const style = {
  height: 200,
  width: 300,
  margin: 20,
  display: 'inline-block',
};

    return (
      <MuiThemeProvider>
      <Draggable>
      <Paper style={style} zDepth={2}>
      <Card>
        <CardHeader
          title = {this.props.itemData.title || 'Untitled'}
          />
        <CardText>
          {this.getComponent(this.props.itemData)}
        </CardText>
      </Card>
      <CardActions>
         <FlatButton label="Edit" onTouchTap={this.handleClickEdit} />
         <FlatButton label="Delete" onTouchTap={this.handleClickDelete} />
       </CardActions>
      </Paper>
      </Draggable>
      </MuiThemeProvider>
    );
  },
});

module.exports = KnowtEntry;
