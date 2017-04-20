const React = require('react');
const KnowtApp = require('./KnowtApp');
const { render } = require('react-dom');
const KeptStore = require('./store');
const store = new KeptStore();
const userAccessor = require('../accessor/userAccessor.js');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const Loginscreen = require('./containers/Loginscreen.js').default;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
      isLoggedIn: false,
      displayName: '',
    };
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
  }

  componentWillMount() {
    const loginPage = [];
    loginPage.push(<Loginscreen parentContext={this} checkLoggedIn={this.checkLoggedIn} />);
    this.setState({
      loginPage,
    });
  }


  checkLoggedIn(state, name) {
      console.log("This is the name passed in " + name);
    this.setState({ displayName : name });
    this.setState({ isLoggedIn: state });
    console.log("This is the name " + this.state.displayName);
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <div className="Main">
          {this.state.loginPage}
        </div>
      );
    }
    return <div> <KnowtApp store={store} displayName={this.state.displayName} /> </div>;
  }
}

render(<App />, document.getElementById('reactRoot'));
