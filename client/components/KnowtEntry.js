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
import {List, ListItem} from 'material-ui/List';
import _ from 'lodash';

class KnowtEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deleteOpen: false,
      shareOpen: false,
      dataSource: [],
      shareUserName: '',
    };
    this.handleShareOpen = this.handleShareOpen.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserSharedList = this.getUserSharedList.bind(this);
    this.extractAllUsers = this.extractAllUsers.bind(this);
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
  }

  componentWillMount() {
    this.getAllUsers();
  }

  async getAllUsers() {
    const res = await userAccessor.getAllUsersByQueryAsync(null);
    this.setState({ dataSource: this.extractAllUsers(res.data) });
  }

  getUserSharedList() {
    userList = [];
    if (itemData.sharing) {
      _.forEach(this.extractAllUsers(itemData.sharing), (user) => {
        userList.push(<ListItem primaryText={user.toString()} />);
      });
    } else {
      userList.push(<ListItem primaryText="No shared users!" />);
    }
    return userList;
  }

  extractAllUsers(data) {
    const userList = [];
    _.forEach(data, (user) => {
      userList.push(user.username);
    });
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
    ReactDOM.findDOMNode(this).classList.add('fade');
    this.timeout = setTimeout(() => {
      ReactDOM.findDOMNode(this).classList.remove('fade');
      this.props.remove(this.props.itemData);
    }, 250); // .fade has a 250ms animation
  }

  handleClickShare() {
    this.props.share(this.props.itemData, this.state.shareUserName);
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

  handleDeleteOpen() {
    this.setState({ deleteOpen: true });
  }

  handleShareOpen() {
    this.setState({ shareOpen: true });
  }

  handleClose() {
    this.setState({ deleteOpen: false });
    this.setState({ shareOpen: false });
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
        label="Ok"
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
        label="Ok"
        primary
        onTouchTap={this.handleClickShare}
      />,
    ];

    return (
      <MuiThemeProvider>
        <div>
          <Dialog
            actions={deleteActions}
            modal={false}
            open={this.state.deleteOpen}
            onRequestClose={this.handleClose}
          >
          Delete Note?
        </Dialog>
          <Dialog
            actions={deleteActions}
            modal={false}
            open={this.state.shareOpen}
            onRequestClose={this.handleClose}
          >
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
                  <ListItem primaryText="Shared Users" leftIcon={<SharedUsers />} primaryTogglesNestedList nestedItems={this.getUserSharedList} />
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
