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
    const iconButtonElement = (
      <IconButton
        touch
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon />
      </IconButton>
    );

    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem leftIcon={<InfoIcon />}>User Info</MenuItem>
        <MenuItem leftIcon={<UnshareIcon />}>Unshare</MenuItem>
      </IconMenu>
);
    if (this.props.itemData.sharing) {
      const noteId = this.props.itemData.id;
      console.log('*** itemData is defined');
      _.forEach(this.props.itemData.sharing, (user) => {

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
            onTouchTap={() => this.handleClickUnShare(noteId, user.id)}
            //*** this is the line causing trouble
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
              leftIcon={<AccountCircle />} rightIconButton={unShareButtonIcon}
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
    } else if (this.props.itemData.userId !== userAccessor.getId()) {
      const userName = this.idToUserName(this.props.itemData.userId);
      console.log(userName);
      // setTimeout(function(){userList.push(<ListItem primaryText={userName} />);}, 100);
      userList.push(<ListItem primaryText={userName.toString()} leftIcon={<AccountCircle />} rightIconButton={rightIconMenu} />);
    } else {
      userList.push(<ListItem primaryText="No shared users!" />);
    }
    return userList;
  }

  getComponent(itemData) {
    return <Note data={itemData} />;
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
    this.handleClose();
    this.props.share(this.props.itemData, this.state.shareUserName);
  }

  handleClickUnShare(noteId, userId, value) {
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
                <IconButton tooltip="Edit" onTouchTap={this.handleClickEdit}>
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
