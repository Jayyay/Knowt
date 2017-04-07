const React = require('react');
const userAccessor = require('../../accessor/userAccessor');
import { Card, CardTitle } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
    <div>Name: {this.state.displayName}</div>
    // <Card className="container">
    //   <CardTitle title="Knowt" subtitle="Welcome!" />
    // </Card>
    );
  }
}

const style = {
  margin: 15,
};

module.exports = Main;
