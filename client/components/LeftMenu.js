import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import NoteAdd from 'material-ui/svg-icons/action/note-add';
import CheckBox from 'material-ui/svg-icons/toggle/check-box';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import Tags from 'material-ui/svg-icons/action/turned-in-not';
import Settings from 'material-ui/svg-icons/action/settings';
import Help from 'material-ui/svg-icons/action/help';
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
            label="Menu"
            onTouchTap={this.handleToggle}
          />
          // <Paper style={style.paper}>
            <Drawer docked={false} onRequestChange={this.handleToggle} open={this.state.open} containerStyle={{height: 'calc(100% - 64px)', top: 64}}>
              <MenuItem primaryText="New note" leftIcon={<NoteAdd/>} />
              <MenuItem primaryText="To do" leftIcon={<CheckBox/>} />
              <Divider />
              <MenuItem primaryText="Tags" leftIcon={<Tags />} />
              <Divider />
              <MenuItem primaryText="Settings" leftIcon={<Settings />} />
              <MenuItem primaryText="Help" leftIcon={<Help />} />
            </Drawer>
          // </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default LeftMenu;
