const React = require('react');
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class signUpForm extends React.Component {

  render() {
    return (
      <Card>
        <form action="/">
          <h2 className="card-heading">Sign Up</h2>
          {this.errors.summary && <p className="error-message">{this.errors.summary}</p>}

          <div className="field-line">
            <TextField
              floatingLabelText="Name"
              name="name"
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Email"
              name="email"
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Password"
              type="password"
              name="password"
            />
          </div>

          <div className="button-line">
            <RaisedButton type="submit" label="Create New Account" primary />
          </div>

          <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
        </form>
      </Card>
    );
  }
}


export default signUpForm;
