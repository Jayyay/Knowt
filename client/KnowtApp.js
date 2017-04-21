const React = require('react');
const userAccessor = require('../accessor/userAccessor');
const noteAccessor = require('../accessor/noteAccessor');
const sharingAccessor = require('../accessor/sharingAccessor');
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
      allUsers: [],
      mode: 'All',
      menuState: false,
    };
  },

  componentWillMount() {
    this.getAllUsers();
    console.log('I should be called first');
  },

  componentDidMount() {
    console.log(`from app.js ${this.state.allUsers}`);
    if (this.state.mode == 'All') {
      this.getNotes(null);
    } else if (this.state.mode == 'Private') {
      this.getMyNotes(null);
    } else if (this.state.mode == 'Shared') {
      this.getSharedNotes(null);
    }
    console.log('I should be called second');
  },

  async getAllUsers() {
    const res = await userAccessor.getAllUsersByQueryAsync(null);
    if (res.status === 'success') {
      this.setState({ allUsers: res.data });
    }
    console.log(`from app.js getallusers${this.state.allUsers}`);
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
    const notesSharedWithMe = await sharingAccessor.getNotesSharedWithMeByQueryAsync(query);
    if (notes.status === 'success') {
      const allNotes = notes.data.concat(notesSharedWithMe.data);
      this.setState({ items: allNotes });
      this.setState({ mode: 'All' });
      console.log(`These are the state items in knowtapp: ${this.state.items}`);
      return notes;
    }
    console.log('there is an error in retreiving the notes');

    return null;
  },

  async getMyNotes(query) {
    const notes = await noteAccessor.getNotesByQueryAsync(query);
    if (notes.status === 'success') {
      this.setState({ items: notes.data });
      this.setState({ mode: 'Private' });
      return notes;
    }
    console.log('there is an error in retreiving the notes');

    return null;
  },

  async getSharedNotes(query) {
    const notes = await sharingAccessor.getNotesSharedWithMeByQueryAsync(query);
    if (notes.status === 'success') {
      this.setState({ items: notes.data });
      this.setState({ mode: 'Shared' });
      console.log(`These are the state items in knowtapp: ${this.state.items}`);
      return notes;
    }
    console.log('there is an error in retreiving the notes');

    return null;
  },

  async noteEdit(id, content) {
    await noteAccessor.updateNoteAsync(id, content);
  },

  userNameToId(userName) {
    const usernameToUser = _.keyBy(this.state.allUsers, 'username');
    return usernameToUser[userName].id;
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
    const res = await noteAccessor.createNoteAsync(`${itemData.title}*%(&${itemData.text}`);
    if (res.status === 'success') {
      this.getNotes(null);
    }
    this.resetForm();
  },

  async share(itemData, userName, permission) {
    const userId = this.userNameToId(userName);
    const id = itemData.id;
    const res = await sharingAccessor.shareNoteWithUserAsync(id, userId, permission);
    if (res.status === 'success') {
      this.getNotes(null);
    }
  },

  async unShare(noteId, userId) {
    const res = await sharingAccessor.stopSharingNoteWithUserAsync(noteId, userId);
    if (res.status === 'success') {
      this.getNotes(null);
    }
  },

  edit(itemData) {
    this.formCreator('text')(itemData);
  },

  async update(updatedItem) {
    this.save(this.state.items.map((item) => {
      if (item.id === updatedItem.id) { return updatedItem; }
      return item;
    }));
    const res = await noteAccessor.updateNoteAsync(updatedItem.id, `${updatedItem.title}*%(&${updatedItem.text}`);
    if (res.status === 'success') {
      this.getNotes(null);
    }
    this.resetForm();
  },

  async remove(itemData) {
    this.save(this.state.items.filter(data => itemData !== data));
    // console.log(`Deleted: ${itemData.id}`);
    const res = noteAccessor.deleteNoteAsync(itemData.id);
    if (res.status === 'success') {
      this.getNotes(null);
    }
  },

  move(fromIndex, toIndex) {
    // permut don't mutate array, return a new array
    const items = utils.permut(this.state.items, fromIndex, toIndex);
    this.save(items);
  },

  openMenu(){
    this.setState({menuState:!this.state.menuState});
  },

  render() {
    return (
      <div>
        <Header displayName={this.props.displayName} logout={this.props.logout} openMenu={this.openMenu}/>
        <LeftMenu newItem={this.newItem} getNotes={this.getNotes} getMyNotes={this.getMyNotes} getSharedNotes={this.getSharedNotes} openMenu = {this.openMenu} menuState={this.state.menuState}/>
        {this.state.form}
        <KnowtItems
          items={this.state.items}
          edit={this.edit}
          update={this.update}
          remove={this.remove}
          allUsers={this.allUsers}
          share={this.share}
          unShare={this.unShare}
        />
      </div>
    );
  },
});

module.exports = KnowtApp;
