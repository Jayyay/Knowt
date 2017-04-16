import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';


const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    // margin: '16px 32px 16px 0',
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
};

class LeftMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleToggle = this.handleToggle .bind(this);
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <RaisedButton
            label="Toggle Drawer"
            onTouchTap={this.handleToggle}
          />
          // <Paper style={style.paper}>
            <Drawer docked={false} onRequestChange={this.handleToggle} open={this.state.open}>
              <MenuItem primaryText="Preview" leftIcon={<RemoveRedEye />} />
              <MenuItem primaryText="Share" leftIcon={<PersonAdd />} />
              <MenuItem primaryText="Get links" leftIcon={<ContentLink />} />
              <Divider />
              <MenuItem primaryText="Make a copy" leftIcon={<ContentCopy />} />
              <MenuItem primaryText="Download" leftIcon={<Download />} />
              <Divider />
              <MenuItem primaryText="Remove" leftIcon={<Delete />} />
            </Drawer>
          // </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default LeftMenu;
