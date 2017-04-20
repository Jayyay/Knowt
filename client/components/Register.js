import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const React = require('react');
const Login = require('./Login.js').default;
const userAccessor = require('../../accessor/userAccessor.js');

const style = {
  margin: 15,
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      displayName: '',
      email: '',
      password: '',
    };
  }

  async register() {
    const self = this;
    console.log(this.state.username, this.state.password, this.state.displayName, this.state.email);
    const res = await userAccessor.signUpAsync(this.state.username, this.state.password, this.state.displayName, this.state.email);
    if (res.status === 'success') {
      const loginscreen = [];
      loginscreen.push(<Login parentContext={this} />);
      const loginmessage = 'Not Registered yet? Click here to register!';
      self.props.parentContext.setState({ loginscreen,
        loginmessage,
        buttonLabel: 'Register',
        isLogin: true,
      });
       // change page
    } else {
       // TODO: error handling, surface some error message would be preferred.
      console.log('Register Failed!');
    }
  }

  handleClick(event) {
    this.register();
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <TextField
              hintText="Enter your User Name"
              floatingLabelText="User Name"
              onChange={(event, newValue) => this.setState({ username: newValue })}
            />
            <br />
            <TextField
              hintText="Enter your Display Name"
              floatingLabelText="Display Name"
              onChange={(event, newValue) => this.setState({ displayName: newValue })}
            />
            <br />
            <TextField
              hintText="Enter your Email"
              type="email"
              floatingLabelText="Email"
              onChange={(event, newValue) => this.setState({ email: newValue })}
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

export default Register;
