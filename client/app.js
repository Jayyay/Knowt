import Spinner from 'react-spinner-material';
import React from 'react';
import KnowtApp from './KnowtApp';
import { render } from 'react-dom';
import { HashRouter as Router, Route, IndexRoute } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const KeptStore = require('./store');
const store = new KeptStore();
const userAccessor = require('../accessor/userAccessor.js');
const Loginscreen = require('./containers/Loginscreen.js').default;
const LandingPage = require('./components/LandingPage.js').default;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
      isLoggedIn: userAccessor.isLoggedIn(),
      isRedirectedFromExternalLogin: userAccessor.isRedirected(),
    };
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    const loginPage = [];
    loginPage.push(<Loginscreen parentContext={this} checkLoggedIn={this.checkLoggedIn} />);
    this.setState({
      loginPage,
    });
  }

  checkLoggedIn(state, name) {
    this.setState({ displayName: name });
    this.setState({ isLoggedIn: state });
  }

  logout() {
    userAccessor.logout();
    this.setState({ isLoggedIn: userAccessor.isLoggedIn() });
  }
  componentDidMount() {
    if (this.state.isRedirectedFromExternalLogin) {
      userAccessor.loginWithAccessToken();
    }
  }

  render() {
    if (this.state.isRedirectedFromExternalLogin) {
      return (
        <div>
          <Spinner
            width={30}
            height={40}
            spinnerColor={'#458'}
            spinnerWidth={2}
            show
          />
        </div>
      );
    }
    if (!this.state.isLoggedIn) {
      return (
        <MuiThemeProvider>
          <Router>
            <div>
              <Route exact path="/" component={LandingPage} />
              <Route path="/login" component={Loginscreen} />
            </div>
          </Router>
        </MuiThemeProvider>
      );
    }
    return <div> <KnowtApp store={store} displayName={this.state.displayName} logout={this.logout} /> </div>;
  }
}

render(<App />, document.getElementById('reactRoot'));
