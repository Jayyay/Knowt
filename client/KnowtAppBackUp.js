const React = require('react');
const userAccessor = require('../accessor/userAccessor');
const noteAccessor = require('../accessor/noteAccessor');
const Header = require('./components/Header').default;
const LeftMenu = require('./components/LeftMenu').default;

const NoteForm = require('./components/note/NoteForm');
const KnowtItems = require('./components/KnowtItems');
const utils = require('./utils');

class KnowtApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: 'blah',
      items: [],
      form: [],
    };
  }

  forms(type, data) {
    if (type === 'text') {
      return this.createText(data);
    }
    return null;
  }

  createText(data) {
    return (<NoteForm resetForm={this.resetForm} create={this.create} update={this.update} data={data} />);
  }


  save(items) {
    // save the times;
  }

  formCreator(type, data) {
    this.setState({ form: this.forms[type].call(this, data) });
  }

  newItem(type) {
    this.formCreator(type, {});
  }

  resetForm() {
    this.setState({ form: null });
  }

  create(itemData) {
    itemData.id = utils.nextId(this.state.items);
    this.save(this.state.items.concat([itemData]));
    this.resetForm();
  }


  edit(itemData) {
    this.formCreator(itemData.type)(itemData);
  }

  update(updatedItem) {
    this.save(this.state.items.map((item) => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    }));
    this.resetForm();
  }

  remove(itemData) {
    this.save(this.state.items.filter(data => itemData !== data));
  }

  move(fromIndex, toIndex) {
    // permut don't mutate array, return a new array
    const items = utils.permut(this.state.items, fromIndex, toIndex);

    this.save(items);
  }

  render() {
    return (
      <div>
        <Header displayName={this.state.displayName} />
        <LeftMenu newItem={this.newItem} />
        {this.state.form}
        <KnowtItems
          items={this.state.items}
          newItem={this.newItem}
          edit={this.edit}
          update={this.update}
          remove={this.remove}
          move={this.move}
        />
      </div>
    );
  }
}

export default KnowtApp;
