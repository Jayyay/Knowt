import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'react-prop-types';

const React = require('react');
const userAccessor = require('../../accessor/userAccessor.js');

const style = {
  margin: 15,
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      open: false,
      message: '',
    };
  }
  // componentDidMount() {
  //   this.login();
  // }

  // this.handleOpen = this.handleOpen.bind(this);
  // this.handleClose = this.handleClose.bind(this);

  async login() {
    const res = await userAccessor.loginAsync(this.state.username, this.state.password);
    if (res.status === 'success') {
      this.setState({ message: 'Login Successful!' });
      this.handleOpen();
      this.props.checkLoggedIn(true, res.data.displayName);

       // change page
    } else {
      this.setState({ message: 'Login Failed.' });
      this.handleOpen();
       // error handling
    }
  }

  handleClick(event) {
    this.login();
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose(event) {
    this.setState({ open: false });
  }

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary
        onClick={event => this.handleClose(event)}
      />,
    ];

    return (
      <div>
        <MuiThemeProvider>
          <div>
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
            <Dialog
             title={this.state.message}
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
            </Dialog>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

Login.propTypes = {
  checkLoggedIn: React.PropTypes.func.isRequired,
};


export default Login;
