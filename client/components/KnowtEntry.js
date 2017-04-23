const React = require('react');
const GlyphiconLink = require('./GlyphiconLink');
const Note = require('./note/Note.js');
const Panel = require('react-bootstrap').Panel;
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
const userAccessor = require('../../accessor/userAccessor.js');
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
const Draggable = require('react-draggable');
import ReactDOM from 'react-dom';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import Share from 'material-ui/svg-icons/social/person-add';
import SharedUsers from 'material-ui/svg-icons/social/group';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import _ from 'lodash';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import MenuItem from 'material-ui/MenuItem';
import InfoIcon from 'material-ui/svg-icons/action/info';
import UnshareIcon from 'material-ui/svg-icons/content/remove-circle-outline';
import { darkBlack } from 'material-ui/styles/colors';
import DropDownMenu from 'material-ui/DropDownMenu';
import ViewOnly from 'material-ui/svg-icons/action/visibility';

class KnowtEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deleteOpen: false,
      shareOpen: false,
      unShareOpen: false,
      dataSource: [],
      shareUserName: '',
      allUsers: [],
      dropDownValue: 1,
    };
    this.handleShareOpen = this.handleShareOpen.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserSharedList = this.getUserSharedList.bind(this);
    this.getComponent = this.getComponent.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClickShare = this.handleClickShare.bind(this);
    this.titleSplitter = this.titleSplitter.bind(this);
    this.contentSplitter = this.contentSplitter.bind(this);
    this.handleDeleteOpen = this.handleDeleteOpen.bind(this);
    this.handleShareOpen = this.handleShareOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.idToUserName = this.idToUserName.bind(this);
    this.extractAllUsers = this.extractAllUsers.bind(this);
    this.handleUnShareOpen = this.handleUnShareOpen.bind(this);
    this.handleClickUnShare = this.handleClickUnShare.bind(this);
    this.getPermissionComponent = this.getPermissionComponent.bind(this);
  }


  componentWillMount() {
    this.getAllUsers();
  }

  async getAllUsers() {
    const res = await userAccessor.getAllUsersByQueryAsync(null);
    // this.setState({ allUser: res.data });
    this.setState({ dataSource: this.extractAllUsers(res.data) });
  }

  async idToUserName(id) {
    const res = await userAccessor.getAllUsersByQueryAsync(null);
    const idToUserName = _.keyBy(res.data, 'id');
    console.log(idToUserName[id].username.toString());
    return idToUserName[id].username;
  }

  extractAllUsers(data) {
    const userList = [];
    _.forEach(data, (user) => {
      userList.push(user.username);
    });
    return userList;
  }

  getUserSharedList() {
    const userList = [];

    if (this.props.itemData.sharing || (this.props.itemData.userId !== userAccessor.getId())) {
      const noteId = this.props.itemData.id;
      console.log(`*** itemData is defined${this.props.itemData}`);
      let array = [];
      if (this.props.itemData.sharing) {
        array = this.props.itemData.sharing;
      } else {
        array.push(this.props.itemData);
      }

      _.forEach(array, (user) => {
        const userId = user.userId;
        console.log(`Foreach ${user}`);
        const unShareButtonIcon = (
          <IconButton
            touch
            tooltip="Unshare"
            tooltipPosition="bottom-left"
            onTouchTap={this.handleUnShareOpen}
          >
            <UnshareIcon />
          </IconButton>
        );

        const unShareActions = [
          <FlatButton
            label="Cancel"
            primary
            onTouchTap={this.handleClose}
          />,
          <FlatButton
            label="UnShare"
            primary
            onTouchTap={() => this.handleClickUnShare(noteId, userId)}
            //* ** this is the line causing trouble
          />,
        ];

        userList.push(
          <div>
            <ListItem
              primaryText={user.displayName}
              secondaryText={
                <div>
                  <span style={{ color: darkBlack }}>{user.email}</span><br />
                  {user.username}
                </div>
          }
              secondaryTextLines={2}
              leftIcon={this.getPermissionComponent(user.permission)} rightIconButton={unShareButtonIcon}
            />
            <Dialog
              title="Unshare Note"
              actions={unShareActions}
              modal
              open={this.state.unShareOpen}
              onRequestClose={this.handleClose}
            >
                                Are you sure?
                              </Dialog>
          </div>,
                            );
      });
    } else {
      userList.push(<ListItem primaryText="No shared users!" />);
    }
    return userList;
  }

  getComponent(itemData) {
    return <Note data={itemData} />;
  }

  getPermissionComponent(permission){
    if(permission==='VIEW' && this.props.itemData.userId === userAccessor.getId()){
      return <ViewOnly/>
    }
    return <AccountCircle/>
  }

  handleClickEdit() {
    this.props.edit(this.props.itemData);
  }

  handleClickDelete() {
    // if (!confirm('Are you sure?')) { return; }
    this.handleClose();
    ReactDOM.findDOMNode(this).classList.add('fade');
    this.timeout = setTimeout(() => {
      ReactDOM.findDOMNode(this).classList.remove('fade');
      this.props.remove(this.props.itemData);
    }, 250); // .fade has a 250ms animation
  }

  handleClickShare() {
    let permission = 'EDIT';
    this.handleClose();
    if (this.state.dropDownValue == 2) {
      permission = 'VIEW';
    }
    this.props.share(this.props.itemData, this.state.shareUserName, permission);
  }

  handleClickUnShare(noteId, userId) {
    console.log(`Note ID to be unshare ${noteId}`);
    console.log(`User ID to be unshare ${userId}`);
    this.handleClose();
    this.props.unShare(noteId, userId);
  }

  titleSplitter(str) {
    if (str == undefined) {
      return undefined;
    }
    return str.substring(0, str.indexOf('*%(&'));
  }

  contentSplitter(str) {
    if (str == undefined) {
      return undefined;
    }
    return str.substring(str.indexOf('*%(&') + 4, str.length);
  }

  handleUnShareOpen() {
    this.setState({ unShareOpen: true });
  }
  handleDeleteOpen() {
    this.setState({ deleteOpen: true });
  }

  handleShareOpen() {
    this.setState({ shareOpen: true });
  }

  handleClose() {
    this.setState({ deleteOpen: false });
    this.setState({ shareOpen: false });
    this.setState({ unShareOpen: false });
  }

  handleUpdateInput(value) {
    this.setState({ shareUserName: value });
  }

  render() {
    const style = {
      width: 300,
      margin: 20,
      display: 'inline-block',
    };

    const deleteActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        primary
        onTouchTap={this.handleClickDelete}
      />,
    ];

    const shareActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Share"
        primary
        onTouchTap={this.handleClickShare}
      />,
    ];

    return (
      <MuiThemeProvider>
        <div>

          <Dialog
            title="Delete Note"
            actions={deleteActions}
            modal
            open={this.state.deleteOpen}
            onRequestClose={this.handleClose}
          >
          Are you sure?
        </Dialog>
          <Dialog
            title="Share Note"
            actions={shareActions}
            modal
            open={this.state.shareOpen}
            onRequestClose={this.handleClose}
          >
            NetID Users: Add _NET_ID_USER behind the username. eg. at200_NET_ID_USER.
            <AutoComplete
              hintText="Type a username"
              filter={AutoComplete.fuzzyFilter}
              dataSource={this.state.dataSource}
              onUpdateInput={this.handleUpdateInput}
            />
            <br />
            <DropDownMenu value={this.state.dropDownValue} onChange={(event, index, value) => this.setState({ dropDownValue: value })}>
              <MenuItem value={1} primaryText="Edit" />
              <MenuItem value={2} primaryText="View" />
            </DropDownMenu>
          </Dialog>
          <Draggable>
            <Paper style={style} zDepth={2}>
              <Card>
                <CardTitle
                  title={this.titleSplitter(this.props.itemData.content) || 'Untitled'}
                />
                <CardText>
                  {this.getComponent(this.contentSplitter(this.props.itemData.content))}
                </CardText>
              </Card>
              <CardActions>
                <IconButton tooltip="Edit" onTouchTap={this.handleClickEdit} disabled={(this.props.itemData.permission === 'VIEW')}>
                  <Edit />
                </IconButton>
                <IconButton tooltip="Delete" onTouchTap={this.handleDeleteOpen}>
                  <Delete />
                </IconButton>
                <IconButton tooltip="Share" onTouchTap={this.handleShareOpen}>
                  <Share />
                </IconButton>
              </CardActions>
              <CardText>
                <List>
                  <ListItem primaryText="Shared Users" leftIcon={<SharedUsers />} primaryTogglesNestedList nestedItems={this.getUserSharedList()} />
                </List>
              </CardText>
            </Paper>
          </Draggable>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default KnowtEntry;
