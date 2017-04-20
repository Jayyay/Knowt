const React = require('react');
const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
});

const Note = React.createClass({
  render() {
    return (
      <div className="text-entry">
        <div
          className="text-entry-text"
          dangerouslySetInnerHTML={{ __html: marked(this.props.data||'') }}
        />
      </div>
    );
  },
});

module.exports = Note;
