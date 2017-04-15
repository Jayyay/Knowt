import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const React = require('react');
const userAccessor = require('../../accessor/userAccessor.js');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  componentDidMount() {
    this.login();
  }

  async login() {
    const res = await userAccessor.loginAsync(this.state.username, this.state.password);
    if (res.status === 'success') {
      console.log('Login successful');
       // change page
    } else {
      console.log('There is an error');
       // error handling
    }
  }

  handleClick(event) {
    this.login();
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Login"
            />
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              onChange={(event, newValue) => this.setState({ username: newValue })}
            />
            <br />
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange={(event, newValue) => this.setState({ password: newValue })}
            />
            <br />
            <RaisedButton label="Submit" primary style={style} onClick={event => this.handleClick(event)} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const style = {
  margin: 15,
};


export default Login;
