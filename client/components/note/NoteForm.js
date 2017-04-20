const React = require('react');
const Modal = require('react-bootstrap-modal');
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const NoteForm = React.createClass({
  getInitialState() {
    return {
      title: this.titleSplitter(this.props.data.content),
      text: this.contentSplitter(this.props.data.content),
      open: true,
    };
  },

  titleSplitter(str){
    if(str==undefined){
      return undefined;
    }
    return str.substring(0, str.indexOf("*%(&"));
  },

  contentSplitter(str){
    if(str==undefined){
      return undefined;
    }
    return str.substring(str.indexOf("*%(&")+4, str.length);
  },

  handleCancel() {
    this.setState({ show: false });
    this.props.resetForm();
  },

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  },

  handleChangeText(event) {
    this.setState({ text: event.target.value });
  },

  handleSubmit() {
    const rawId = this.refs.id.value;
    const process = (this.props.data.id!=null) ? this.props.update : this.props.create;
    process({
      type: 'text',
      id: (this.props.data.id!=null)? this.props.data.id : null,
      title: this.refs.title.value.trim(),
      text: this.refs.text.value.trim(),
    });
    this.setState({ show: false });
  },

  componentDidMount() {
    // FIXME: reimplement this once https://github.com/facebook/jest/issues/75
    //        is fixed.
    // this.getDOMNode().querySelector("textarea").focus();
  },

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <MuiThemeProvider>
        <Dialog
          title="Create Note"
          actions={actions}
          modal
          open={this.state.open}
          onRequestClose={this.handleCancel}
        >
          <form role="form" onSubmit={this.handleSubmit}>
            <div className="modal-body">
              <input type="hidden" ref="id" defaultValue={this.props.data.id || ''} />
              <div className="form-group">
                <input
                  ref="title" type="text" className="form-control"
                  placeholder="Title" value={this.state.title || ''}
                  onChange={this.handleChangeTitle}
                />
              </div>
              <div className="form-group">
                <textarea
                  ref="text" className="form-control"
                  placeholder="Text (accept markdown contents)…"
                  value={this.state.text || ''} rows="8" required
                  onChange={this.handleChangeText}
                />
              </div>
            </div>
          </form>
        </Dialog>
      </MuiThemeProvider>
    );
  },
});

module.exports = NoteForm;
