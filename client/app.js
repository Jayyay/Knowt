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

  checkLoggedIn(state) {
    this.setState({ isLoggedIn: state });
    console.log(this.state.isLoggedIn);
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <div className="Main">
          {this.state.loginPage}
        </div>
      );
    }
    return <div> <KnowtApp store={store} /> </div>;
  }
}

render(<App />, document.getElementById('reactRoot'));
