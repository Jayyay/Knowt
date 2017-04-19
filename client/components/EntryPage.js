
const React = require('react');
const Main = require('../main.js').default;
const userAccessor = require('../../accessor/userAccessor.js');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// import '../../public/css/style.css';
const Loginscreen = require('../containers/Loginscreen.js').default;

class EntryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
      isLoggedIn: false,
    };
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
  }
  componentWillMount() {
    const loginPage = [];
    loginPage.push(<Loginscreen parentContext={this} checkLoggedIn={this.checkLoggedIn} />);
    this.setState({
      loginPage,
    });
  }

  checkLoggedIn(state) {
    this.setState({ isLoggedIn: state });
    console.log(this.state.isLoggedIn);
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <div className="Main">
          {this.state.loginPage}
        </div>
      );
    }
    return (
      <div>
        <Main />
      </div>
    );
  }
}
export default EntryPage;
