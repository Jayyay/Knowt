const React = require('react');
const { render } = require('react-dom');
const injectTapEventPlugin = require('react-tap-event-plugin');
const getMuiTheme = require('material-ui/styles/getMuiTheme');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');
const { browserHistory, Router } = require ('react-router');
const routes = require('./routes.js');
const Main = require('./components/main.js');
// remove tap delay, essential for MaterialUI to work properly
// injectTapEventPlugin();

class App extends React.Component {
  render() {
    return <div> <Main /> </div>;
    // <MuiThemeProvider muiTheme={getMuiTheme()}>
    //     <Router history={browserHistory} routes={routes} />
    // </MuiThemeProvider>);
  }
}

render(<App />, document.getElementById('reactRoot'));

// const React = require('react');
// const { render } = require('react-dom');
// const Main = require('./main.js');
//
// class App extends React.Component {
//   render() {
//     return <div> <Main /> </div>;
//   }
// }
//
// render(<App />, document.getElementById('reactRoot'));
