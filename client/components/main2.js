const React = require('react');
const userAccessor = require('../../accessor/userAccessor');
const Blueprint = require('@blueprintjs/core');
import { Card, CardTitle, CardText } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: 'blah',
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
    } else {
      // error handling
    }
  }

  render() {
    return (
      // <div>Name: {this.state.displayName}</div>;
    // <Card className="container">
    // <CardTitle title="Knowt" subtitle="Welcome!" />
    // </Card>
    // <nav className="pt-navbar pt-dark">
    //     <div className="pt-navbar-group pt-align-left">
    //       <div className="pt-navbar-heading">Blueprint</div>
    //       <input className="pt-input" placeholder="Search files..." type="text" />
    //     </div>
    //
    //   <div className="pt-navbar-group pt-align-right">
    //     <button className="pt-button pt-minimal pt-icon-home">Home</button>
    //     <button className="pt-button pt-minimal pt-icon-document">Files</button>
    //     <span className="pt-navbar-divider"></span>
    //     <button className="pt-button pt-minimal pt-icon-user"></button>
    //     <button className="pt-button pt-minimal pt-icon-notifications"></button>
    //     <button className="pt-button pt-minimal pt-icon-cog"></button>
    //   </div>
    // </nav>

    <ul className="pt-menu pt-elevation-1 pt-menu-height-small">
      <li className="pt-menu-header"><h6>Layouts</h6></li>
      <li><button type="button" className="pt-menu-item pt-icon-layout-auto">Auto</button></li>
      <li><button type="button" className="pt-menu-item pt-icon-layout-circle">Circle</button></li>
      <li><button type="button" className="pt-menu-item pt-icon-layout-grid">Grid</button></li>
      <li className="pt-menu-header"><h6>Views</h6></li>
      <li><button type="button" className="pt-menu-item pt-icon-history">History</button></li>
      <li><button type="button" className="pt-menu-item pt-icon-star">Favorites</button></li>
      <li><button type="button" className="pt-menu-item pt-icon-envelope">Messages</button></li>
    </ul>
    );
  }
}

module.exports = Main;
