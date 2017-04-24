import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'react-prop-types';
import EditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import IconButton from 'material-ui/IconButton';
import { Card, CardText, CardHeader, CardTitle } from 'material-ui/Card';
import { Link } from 'react-router-dom';
const Login = require('../components/Login.js').default;
const React = require('react');
const userAccessor = require('../../accessor/userAccessor.js');

const cardStyle = {
  marginTop: 50,
  marginBottom: 50,
  height: 550,
};

const style = {
  margin: 15,
};

const iconStyles = {
  color: 'white',
  marginTop: 11,
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      displayName: '',
      email: '',
      password: '',
      open: false,
      message: '',
      status: false,
      errorText: '',
      passwordCheck: '',
    };
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }
  // componentDidMount() {
  //   this.login();
  // }

  // this.handleOpen = this.handleOpen.bind(this);


  async register() {
    const res = await userAccessor.signUpAsync(this.state.username, this.state.password, this.state.displayName, this.state.email);
    if (res.status === 'success') {
      this.setState({ message: 'Registration Successful!' });
      this.setState({ status: true });
      this.handleOpen();
    } else {
      // TODO: error handling, surface some error message would be preferred.
      this.setState({ message: 'Registration Failed.' });
      this.setState({ status: false });
      this.handleOpen();
    }
  }

  handleClick(event) {
    this.register();
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose(event) {
    this.setState({ open: false });
  }

  getComponent() {
    if (this.state.status) {
      return (<FlatButton
        label="Ok!"
        containerElement={<Link to="/" />}
        onClick={event => this.handleClose(event)}
      />);
    }
    return (<FlatButton
      label="Ok."
      onClick={event => this.handleClose(event)}
    />);
  }

  validateEmail(input) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return regularExpression.test(input);
  }

  validatePassword(input){
    const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    return reg.test(input);
  }

  render() {
    const customIcon = (
      <div>
        <FlatButton
          label="K N O W T"
          labelPosition="after"
          labelStyle={{ fontSize: '30px', fontWeight: 'bold' }}
          primary
          icon={<EditorIcon />}
          style={iconStyles}
          containerElement={<Link to="/" />}
        />

      </div>
    );

    return (
      <MuiThemeProvider>
        <div>
          <AppBar title={customIcon} titleStyle={{ textAlign: 'center' }} showMenuIconButton={false} />
          <Card className="container" style={cardStyle}>
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
                errorText={this.state.errorText}
                onChange={(event, newValue) => {
                  this.setState({ email: newValue });
                  if (!this.validateEmail(newValue)) {
                    this.setState({ errorText: 'Invalid Email' });
                  }else{
                    this.setState({errorText: ''});
                  }
                }
                }
              />
              <br />
              <TextField
                type="password"
                hintText="Enter your Password"
                floatingLabelText="Password"
                errorText={this.state.passwordCheck}
                onChange={(event, newValue) => {
                  this.setState({ password: newValue });
                  if (!this.validatePassword(newValue)) {
                    this.setState({ passwordCheck: 'Minimum 8 characters at least 1 Alphabet, 1 Number and 1 Special Character.' });
                  }else{
                    this.setState({passwordCheck: ''});
                  }
                }
              }
              />
              <br />
              <br />
              <RaisedButton label="Register" primary style={style} onClick={event => this.handleClick(event)} disabled={!(this.state.errorText==='')||!(this.state.passwordCheck==='')} />
              <br />
              <p><b>Already have an account?</b></p>
              <RaisedButton label="Login" primary style={style} containerElement={<Link to="/login" />} />
              <Dialog
                title={this.state.message}
                actions={this.getComponent()}
                modal
                open={this.state.open}
                onRequestClose={this.handleClose}
              />
            </div>
          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}

Login.propTypes = {
  checkLoggedIn: React.PropTypes.func.isRequired,
};


export default Register;
