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
const React = require('react');
const userAccessor = require('../../accessor/userAccessor.js');

const cardStyle = {
  marginTop: 50,
  marginBottom: 50,
  height: 400,
};

const style = {
  margin: 15,
};

const iconStyles = {
  color: 'white',
  marginTop: 11,
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
      this.props.checkLoggedIn(true);
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
    const actions = [
      <FlatButton
        label="Ok"
        primary
        onClick={event => this.handleClose(event)}
      />,
    ];

    return (
      <MuiThemeProvider>
        <div>
          <AppBar title={customIcon} titleStyle={{ textAlign: 'center' }} showMenuIconButton={false} />
          <Card className="container" style={cardStyle}>
            <CardTitle title="Login" />
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
              <br />
              <RaisedButton label="Login" primary style={style} onClick={event => this.handleClick(event)} />
            or
            <RaisedButton label="Login With NetID" primary style={style} onClick={event => userAccessor.loginWithNetId()} />
              <br />
              <p><b>Don't have an account?</b></p>
              <RaisedButton label="Register" primary style={style} containerElement={<Link to="/register" />} />
              <Dialog
                title={this.state.message}
                actions={actions}
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


export default Login;
