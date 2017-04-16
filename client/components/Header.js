import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import FlatButton from 'material-ui/FlatButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
const React = require('react');
const userAccessor = require('../../accessor/userAccessor.js');
injectTapEventPlugin();

const styles = {
  title: {
    cursor: 'pointer',
  },
};

class Header extends React.Component {

  render() {
    const buttonStyle = {
      backgroundColor: 'transparent',
      color: 'white',
      margin: '5px',
    };

    const accountButton = (
      <IconMenu
        iconButtonElement={
          <FlatButton
            label="User Name"
            icon={<AccountCircle />}
            style={buttonStyle}
          />
          }
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem primaryText="Account Settings" />
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" />
      </IconMenu>
    );
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span style={styles.title}>K n o w t</span>}
            iconElementRight={accountButton}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
export default Header;
