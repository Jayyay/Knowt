const React = require('react');
const userAccessor = require('../accessor/userAccessor');
const noteAccessor = require('../accessor/noteAccessor');
const Header = require('./components/Header.js').default;
const LeftMenu = require('./components/LeftMenu.js').default;
const NotesComponent = require('./NotesComponent.js').default;
const KeptApp = require('./components/KeptApp.js');
const KeptStore = require('./store');
const store = new KeptStore();

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: 'blah',
      notes: [],
    };
  }

  componentDidMount() {
    this.login();
  }

  async login() {
    const res = await userAccessor.loginAsync('jay', 'jay123');
    if (res.status === 'success') {
      this.setState({
        displayName: res.data.displayName,
      });
      const noteRes = await noteAccessor.getNotesByQueryAsync({});
      this.setState({
        notes: noteRes.data,
      });
    } else {
      // error handling
    }
  }

  render() {
    return (
      <div>
        <Header displayName={this.state.displayName}/>
        <LeftMenu />
        <KeptApp store={store} />
        <div> Name: {this.state.displayName} </div>
        <div> NoteCount: {this.state.notes.length}</div>
      </div>
    );
  }
}

export default Main;