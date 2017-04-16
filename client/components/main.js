import injectTapEventPlugin from 'react-tap-event-plugin';
const React = require('react');

injectTapEventPlugin();

// import '../../public/css/style.css';
const Loginscreen = require('../containers/Loginscreen.js').default;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
    };
  }
  componentWillMount() {
    const loginPage = [];
    loginPage.push(<Loginscreen parentContext={this} />);
    this.setState({
      loginPage,
    });
  }
  render() {
    return (
      <div className="Main">
        {this.state.loginPage}
      </div>
    );
  }
}

export default Main;
