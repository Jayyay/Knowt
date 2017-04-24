import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import FlatButton from 'material-ui/FlatButton';
import EditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import AccountIcon from 'material-ui/svg-icons/action/build';
import SignOutIcon from 'material-ui/svg-icons/action/exit-to-app';
const React = require('react');
const userAccessor = require('../../accessor/userAccessor.js');


const styles = {
  title: {
    cursor: 'pointer',
  },
};

const iconStyles = {
  color: 'white',
  marginLeft: 15,
  marginTop: 5,
};


class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const customIcon = (
      <div>
        <b style={styles.title}> K N O W T </b>
        <EditorIcon style={iconStyles} />
      </div>
    );

    const buttonStyle = {
      backgroundColor: 'transparent',
      color: 'white',
      margin: '5px',
    };

    const accountButton = (
      <IconMenu
        iconButtonElement={
          <FlatButton
            label={this.props.displayName}
            icon={<AccountCircle />}
            style={buttonStyle}
          />
          }
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem primaryText="Sign out" leftIcon={<SignOutIcon />} onTouchTap={this.props.logout}/>
      </IconMenu>
    );
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={customIcon}
            iconElementRight={accountButton}
            onLeftIconButtonTouchTap={this.props.openMenu}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
export default Header;
