const utils = require('../utils');
const React = require('react');
const KnowtColumns = require('./KnowtColumns');
const Resize = require('../mixins/Resize');
const KnowtItems = React.createClass({
   mixins:[Resize],
  getInitialState() {
    return {
      columns: 1,
      columnsWidth: 300,
    };
  },

  onResize(event) {
    console.log(event, event.target.innerWidth);
    let col = 1;
    if (this.state.columnsWidth > 0) {
      col = Math.floor(event.target.innerWidth / this.state.columnsWidth);
    }

    this.setState({ columns: col });
  },

  render() {
    return (
      <div className="kept-list">
        {
        utils
          .range(this.state.columns)
          .map(function a(_, index) {
            const colItems = this.props.items.filter(
              function b(item, i) {
              return i % this.state.columns === index;
            }, this);

            return (
              <KnowtColumns
                items={colItems}
                column={index}
                columns={this.state.columns}
                edit={this.props.edit}
                remove={this.props.remove}
                update={this.props.update}
                share={this.props.share}
                allUsers={this.props.allUsers}
                unShare={this.props.unShare}
              />
            );
          }, this)
      }
      </div>
    );
  },
});

module.exports = KnowtItems;
