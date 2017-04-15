// const React = require('react');
// const { render } = require('react-dom');
// const Main = require('./components/main.js');
//
// class App extends React.Component {
//   render() {
//     return <div> <Main /> </div>;
//   }
// }
//
// render(<App />, document.getElementById('reactRoot'));

const React = require('react');
const ReactDOM = require('react-dom');
const Main = require('./components/main.js').default;

ReactDOM.render(
  <Main />,
  document.getElementById('reactRoot')
);
