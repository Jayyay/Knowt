const utils = require('../utils');
const React = require('react');
const KnowtColumns = require('./KnowtColumns');

const KnowtItems = React.createClass({

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
    // if (!this.props.items.length) {
    //   return (
    //     //DefaultContent
    //   );
    // }

    return (
      <div className="kept-list">
        {
        utils
          .range(this.state.columns)
          .map(function (_, index) {
            const colItems = this.props.items.filter(function (item, i) {
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
                move={this.props.move}
              />
            );
          }, this)
      }
      </div>
    );
  },
});

module.exports = KnowtItems;
