const React = require('react');
const userAccessor = require('../accessor/userAccessor');

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: 'blah',
    };
  }

  componentDidMount() {
    this.login();
  }

  async login() {
    const res = await userAccessor.loginAsync('jay', 'jay123');
    if (res.status === 'success') {
      this.setState({
        displayName: res.data.displayName,
      });
    } else {
      // error handling
    }
  }

  render() {
    return <div>Name: {this.state.displayName}</div>;
  }
}

module.exports = Main;
