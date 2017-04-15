import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

const React = require('react');
const Login = require('../components/Login').default;
const Register = require('../components/Register').default;

const style = {
  margin: 15,
};

class Loginscreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginscreen: [],
      loginmessage: '',
      buttonLabel: 'Register',
      isLogin: true,
    };
  }
  componentWillMount() {
    const loginscreen = [];
    loginscreen.push(<Login parentContext={this} appContext={this.props.parentContext} />);
    const loginmessage = 'Not registered yet, Register Now';
    this.setState({
      loginscreen,
      loginmessage,
    });
  }

  handleClick(event) {
    // console.log("event",event);
    let loginmessage;
    if (this.state.isLogin) {
      const loginscreen = [];
      loginscreen.push(<Register parentContext={this} />);
      loginmessage = 'Already registered.Go to Login';
      this.setState({
        loginscreen,
        loginmessage,
        buttonLabel: 'Login',
        isLogin: false,
      });
    } else {
      const loginscreen = [];
      loginscreen.push(<Login parentContext={this} />);
      loginmessage = 'Not Registered yet.Go to registration';
      this.setState({
        loginscreen,
        loginmessage,
        buttonLabel: 'Register',
        isLogin: true,
      });
    }
  }

  render() {
    return (
      <div className="loginscreen">
        {this.state.loginscreen}
        <div>
          {this.state.loginmessage}
          <MuiThemeProvider>
            <div>
              <RaisedButton label={this.state.buttonLabel} primary style={style} onClick={event => this.handleClick(event)} />
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default Loginscreen;
