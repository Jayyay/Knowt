import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import { Card, CardText, CardHeader, CardTitle, CardMedia} from 'material-ui/Card';
import { Link } from 'react-router-dom';
import EditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import Paper from 'material-ui/Paper';
const React = require('react');

const style = {
  marginTop: 50,
  marginBottom: 50,
};

const buttonStyle = {
  margin: 15,
  marginTop: 50,
  marginBottom: 50,
  height: 50,
  width: 150,
};

const iconStyles = {
  color: 'white',
};

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
  }

  render() {
    const customIcon = (
      <div>
        <EditorIcon style={iconStyles} />
        <b> K N O W T </b>
      </div>
    );

    return (
      <MuiThemeProvider>
        <div>
          <AppBar title={customIcon} titleStyle={{ textAlign: 'center' }} showMenuIconButton={false} />
          <Card className="container"style={style}>
            <CardMedia
             overlay={            <div><RaisedButton label="Register" primary style={buttonStyle} containerElement={<Link to="/register" />}/>
                                  <RaisedButton label="Login" primary style={buttonStyle} containerElement={<Link to="/login" />}/></div>}
                                  style={style}
            >
            <img src="/resources/img/background.png" />
            </CardMedia>

          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}


export default LandingPage;
