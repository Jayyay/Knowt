import Spinner from 'react-spinner-material';
import React from 'react';
import KnowtApp from './KnowtApp';
import { render } from 'react-dom';

const KeptStore = require('./store');
const store = new KeptStore();
const userAccessor = require('../accessor/userAccessor.js');
const Loginscreen = require('./containers/Loginscreen.js').default;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
      isLoggedIn: userAccessor.isLoggedIn(),
      isRedirectedFromExternalLogin: userAccessor.isRedirected(),
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
    this.setState({ displayName : name });
    this.setState({ isLoggedIn: state });

  componentDidMount() {
    if (this.state.isRedirectedFromExternalLogin) {
      userAccessor.loginWithAccessToken();
    }
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
            show={true}
          />
        </div>
      );
    }
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
