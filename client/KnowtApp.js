const React = require('react');
const userAccessor = require('../accessor/userAccessor');
const noteAccessor = require('../accessor/noteAccessor');
const Header = require('./components/Header').default;
const LeftMenu = require('./components/LeftMenu').default;
import injectTapEventPlugin from 'react-tap-event-plugin';
const NoteForm = require('./components/note/NoteForm');
const KnowtItems = require('./components/KnowtItems');
const utils = require('./utils');

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
injectTapEventPlugin();
const KnowtApp = React.createClass({
  getInitialState() {
    return {
      items: [],
      form: null,
    };
  },

  componentDidMount() {
    this.getNotes(null);
  },
  /**
   * Provided for the UndoStack mixin.
   */
  getStateSnapshot() {
    return { items: this.state.items };
  },

  /**
   * Provided for the UndoStack mixin.
   */
  setStateSnapshot(snapshot) {
    this.setState(snapshot);
  },

  async getNotes(query) {
    const notes = await noteAccessor.getNotesByQueryAsync(query);
    if (notes.status === 'success') {
      this.setState({ items: notes.data });
      console.log("These are the state items in knowtapp: " + this.state.items);
      return notes;
    }else{
      console.log("there is an error in retreiving the notes");
    }
    return null;
  },

  async noteDelete(id) {
    await noteAccessor.deleteNoteAsync(id);
  },

  async noteEdit(id, content) {
    await noteAccessor.updateNoteAsync(id, content);
  },

  save(items) {
    this.props.store.save(items);
    // this.snapshot();
    this.setState({ items });
  },

  _forms: {
    text(data) {
      return (
        <NoteForm
          resetForm={this.resetForm}
          create={this.create}
          update={this.update}
          data={data}
        />
      );
    },
  },

  formCreator(type) {
    return function (data) {
      console.log(this._forms[type].call(this, data));
      this.setState({ form: this._forms[type].call(this, data) });
    }.bind(this);
  },

  newItem(type) {
    return this.formCreator(type).bind(null, {});
  },

  resetForm() {
    this.setState({ form: null });
  },

  async create(itemData) {
    itemData.id = utils.nextId(this.state.items);
    this.save(this.state.items.concat([itemData]));
    const res = await noteAccessor.createNoteAsync(itemData.title + "*%(&" + itemData.text);
    if (res.status === 'success') {
      this.getNotes(null);
    }
    this.resetForm();
  },

  edit(itemData) {
    this.formCreator("text")(itemData);
  },

  async update(updatedItem) {
    // this.save(this.state.items.map((item) => {
    //   if (item.id === updatedItem.id) { return updatedItem; }
    //   return item;
    // }));
    const res = await noteAccessor.updateNoteAsync(updatedItem.id, updatedItem.title + "*%(&" + updatedItem.text);
    if (res.status === 'success') {
      this.getNotes(null);
    }
    this.resetForm();
  },

  remove(itemData) {
    this.save(this.state.items.filter(data => itemData !== data));
    console.log(`Deleted: ${itemData.id}`);
    this.noteDelete(itemData.id);
  },

  move(fromIndex, toIndex) {
    // permut don't mutate array, return a new array
    const items = utils.permut(this.state.items, fromIndex, toIndex);
    this.save(items);
  },

  render() {
    return (
      <div>
        <Header displayName={this.props.displayName} />
        <LeftMenu newItem={this.newItem} />
        {this.state.form}
        <KnowtItems
          items={this.state.items}
          edit={this.edit}
          update={this.update}
          remove={this.remove}
          move={this.move}
        />
      </div>
    );
  },
});

module.exports = KnowtApp;
