const React = require('react');
const KnowtEntry = require('./KnowtEntry').default;

const KnowtColumns = React.createClass({
  render() {
    return (
      <div className="kept-columns">{
        this.props.items.map((itemData, index) => {
          const key = index * this.props.columns + this.props.column;

          return (<KnowtEntry
            key={key}
            itemData={itemData}
            edit={this.props.edit}
            remove={this.props.remove}
            update={this.props.update}
            share={this.props.share}
            move={this.props.move}
          />);
        })
      }</div>
    );
  },
});

module.exports = KnowtColumns;
