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
import SharedIcon from 'material-ui/svg-icons/social/people';
import PrivateIcon from 'material-ui/svg-icons/social/person';

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
    this.handleToggle = this.handleToggle.bind(this);
    this.getMyNotes = this.getMyNotes.bind(this);
    this.getAllNotes = this.getAllNotes.bind(this);
    this.getSharedNotes = this.getSharedNotes.bind(this);
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  getAllNotes(){
    this.props.getNotes(null);
  }

 getMyNotes(){
   this.props.getMyNotes(null);
 }

 getSharedNotes(){
   this.props.getSharedNotes(null)
 }
  // <MenuItem primaryText="All Notes" leftIcon={<CheckBox />} onTouchTap={this.props.getNotes(null)} />
  // <MenuItem primaryText="My Notes" leftIcon={<PrivateIcon />} onTouchTap={this.props.getMyNotes(null)} />
  // <MenuItem primaryText="Shared Notes" leftIcon={<SharedIcon />}onTouchTap={this.props.getSharedNotes(null)} />

  render() {
    return (
      <MuiThemeProvider>
        <div>
            <Drawer docked={false} onRequestChange={this.props.openMenu} open={this.props.menuState} containerStyle={{ height: 'calc(100% - 64px)', top: 64 }}>
              <MenuItem primaryText="New note" leftIcon={<NoteAdd />} onTouchTap={this.props.newItem("text")} />
              <Divider />
              <MenuItem primaryText="All Notes" leftIcon={<CheckBox />} onTouchTap={this.getAllNotes} />
              <MenuItem primaryText="My Notes" leftIcon={<PrivateIcon />} onTouchTap={this.getMyNotes} />
              <MenuItem primaryText="Shared With Me" leftIcon={<SharedIcon />}onTouchTap={this.getSharedNotes } />
            </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default LeftMenu;
