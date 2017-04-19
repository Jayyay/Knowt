const React = require('react');
const KnowtApp = require('./KnowtApp');
const { render } = require('react-dom');
var KeptStore = require('./store');
var store = new KeptStore();

class App extends React.Component {
  render() {
    return <div> <KnowtApp store={store}/> </div>;
  }
}

render(<App />, document.getElementById('reactRoot'));
