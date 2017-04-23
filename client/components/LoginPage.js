import React from 'react';
import KnowtApp from '../KnowtApp';
import { render } from 'react-dom';
import { HashRouter as Router, Route, IndexRoute } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const KeptStore = require('././../store');
const store = new KeptStore();
const userAccessor = require('../../accessor/userAccessor.js');
const Login = require('../components/Login.js').default;
import { Card, CardText, CardHeader, CardTitle } from 'material-ui/Card';

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: userAccessor.isLoggedIn(),
    };
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {

  }

  checkLoggedIn(state) {
    this.setState({ isLoggedIn: state });
  }

  logout() {
    userAccessor.logout();
    this.setState({ isLoggedIn: userAccessor.isLoggedIn() });
  }

  componentDidMount() {

  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <Login checkLoggedIn={this.checkLoggedIn}/>
      );
    }
    return <div> <KnowtApp store={store} logout={this.logout} /> </div>;
  }
}

export default LoginPage;
