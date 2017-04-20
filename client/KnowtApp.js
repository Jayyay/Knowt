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
      items: this.props.store.load(),
      displayName: 'blah',
      form: null,
    };
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


  save(items) {
    this.props.store.save(items);
    // this.snapshot();
    this.setState({items: items});
  },

  _forms: {
      text: function(data) {
        return (
          <NoteForm resetForm={this.resetForm}
                        create={this.create}
                        update={this.update}
                        data={data} />
        );
      },
    },

    formCreator: function(type) {
       return function(data) {
         console.log(this._forms[type].call(this, data));
         this.setState({form: this._forms[type].call(this, data)});
       }.bind(this);
     },

     newItem: function(type) {
       return this.formCreator(type).bind(null, {});
     },

  resetForm() {
    this.setState({ form: null });
  },

  create(itemData) {
    itemData.id = utils.nextId(this.state.items);
    this.save(this.state.items.concat([itemData]));
    this.resetForm();
  },

  edit(itemData) {
    this.formCreator(itemData.type)(itemData);
  },

  update(updatedItem) {
    this.save(this.state.items.map((item) => {
      if (item.id === updatedItem.id) { return updatedItem; }
      return item;
    }));
    this.resetForm();
  },

  remove(itemData) {
    this.save(this.state.items.filter(data => itemData !== data));
  },

  move(fromIndex, toIndex) {
    // permut don't mutate array, return a new array
    const items = utils.permut(this.state.items, fromIndex, toIndex);
    this.save(items);
  },

  render() {
    return (
      <div>
        <Header displayName={this.state.displayName} />
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
