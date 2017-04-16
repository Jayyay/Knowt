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
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    this.register();
  }

  async register() {
    const self = this;
    const res = await userAccessor.signUpAsync(this.state.first_name, this.state.password, this.state.last_name, this.state.email);
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
       // error handling
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
              hintText="Enter your First Name"
              floatingLabelText="First Name"
              onChange={(event, newValue) => this.setState({ first_name: newValue })}
            />
            <br />
            <TextField
              hintText="Enter your Last Name"
              floatingLabelText="Last Name"
              onChange={(event, newValue) => this.setState({ last_name: newValue })}
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
