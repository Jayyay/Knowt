const React = require('react');
const { render } = require('react-dom');
const Main = require('./main.js').default;

class App extends React.Component {
  render() {
    return <div> <Main /> </div>;
  }
}

render(<App />, document.getElementById('reactRoot'));
