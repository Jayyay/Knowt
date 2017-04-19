import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import { Card, CardText, CardHeader, CardTitle } from 'material-ui/Card';
import EditorIcon from 'material-ui/svg-icons/editor/mode-edit';

const React = require('react');
const Login = require('../components/Login.js').default;
const Register = require('../components/Register.js').default;

const style = {
  marginTop: 50,
  marginBottom: 50,
};

const iconStyles = {
  color: 'white',
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
      titleLabel: 'Login',
    };
  }
  componentWillMount() {
    const loginscreen = [];
    loginscreen.push(<Login parentContext={this} appContext={this.props.parentContext} checkLoggedIn={this.props.checkLoggedIn} />);
    const loginmessage = 'Not Registered yet? \n Click here to register!';
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
      loginmessage = 'Already registered? \n Click here to login!';
      this.setState({
        loginscreen,
        loginmessage,
        buttonLabel: 'Login',
        titleLabel: 'Register',
        isLogin: false,
      });
    } else {
      const loginscreen = [];
      loginscreen.push(<Login parentContext={this} checkLoggedIn={this.props.checkLoggedIn} />);
      loginmessage = 'Not Registered yet? \n Click here to register!';
      this.setState({
        loginscreen,
        loginmessage,
        buttonLabel: 'Register',
        titleLabel: 'Login',
        isLogin: true,
      });
    }
  }

  render() {
    const customIcon = (
      <div>
        <EditorIcon style={iconStyles} />
        <b> K N O W T </b>
      </div>
    );

    return (
      <div className="loginscreen">
        <MuiThemeProvider>
          <div>
            <AppBar title={customIcon} titleStyle={{ textAlign: 'center' }} showMenuIconButton={false} />
            <Card className="container" style={style}>
              <CardTitle title={this.state.titleLabel} />
              {this.state.loginscreen}
              <div>
                {this.state.loginmessage}
                <div>
                  <RaisedButton label={this.state.buttonLabel} primary style={style} onClick={event => this.handleClick(event)} />
                </div>
              </div>
            </Card>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

Loginscreen.propTypes = {
  checkLoggedIn: React.PropTypes.func.isRequired,
};

export default Loginscreen;
