const React = require('react');
const { render } = require('react-dom');
const EntryPage = require('./components/EntryPage.js').default;
const Main = require('./main.js').default;
import { browserHistory, Router } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
injectTapEventPlugin();
class App extends React.Component {
  render() {
    return <div> <EntryPage /> </div>;
  }
}

render(<App />, document.getElementById('reactRoot'));

// const React = require('react');
// const ReactDOM = require('react-dom');
// const Main = require('./components/Main.js').default;
//
// ReactDOM.render(
//   <Main />,
//   document.getElementById('reactRoot')
// );
