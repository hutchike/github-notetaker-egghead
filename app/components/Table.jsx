var React = require('react');

var classNames = require('classnames');

var Table = React.createClass({
  propTypes: {
    header: React.PropTypes.object,
    data: React.PropTypes.object,
    sortColumn: React.PropTypes.string,
    sortDirection: React.PropTypes.string,
    changeSort: React.PropTypes.func,
    columns: React.PropTypes.array
  },

  getInitialState: function() {
    var initialSelected;

    if (this.props.sortColumn) {
      initialSelected = _.where(this.props.columns, { name: this.props.initialSelected })
    } else {
      initialSelected = this.props.columns[0];
    }

    initialSelected.sort = this.props.sortDirection || 'asc';

    return {
      selected: initialSelected
    };
  },

  _buildHeaderSpan: function() {
    var tds;

    if (this.props.header) {
      tds = this.props.header.map(function(item) {
        return <td colspan={ item.cols }>{ item.name }</td>;
      });
    }

    return tds;
  },

  _buildColumnHeader: function() {
    return this.props.columns.map(function(col) {
      var sel = this.state.selected,
          classes = classNames({
            'selected': col.name === sel.name,
            [sel.sort]: sel.sort && col.name === sel.name,
            [col.className]: col.className
          });

      return <th className={ classes } onClick={ this._columnClicked.bind(this, col) }>{ col.displayName || col.name }</th>;
    });
  },

  _buildRow: function(data) {
    return this.props.column.map(function(col, key) {
      var colData = data[col.name],
          className = colData.className,
          inerts;

      if (col.customComponent) {
        inerts = <col.customComponent col={ col } data={ data } />;
      } else {
        inerts = <span className={ className }>{ colData.value }</span>;
      }

      return (
        <td key={ col.name + '-' + key }>{ inerts }</td>
      );
    });
  },

  _buildRows: function() {
    return this.props.data.map(function(row) {
      return <tr>{ this._buildCols(row) }</tr>;
    });
  },

  _columnClicked: function(col) {
    var columnData = _.clone(col);

    if (this.state.selected.name === col.name) {
      columnData.sort = this.state.selected.sort === 'desc' ? 'asc' : 'desc';
    } else {
      columnData = _.merge({}, col, columnData, { sort: 'asc' });
    }

    this.setState({ selected: columnData }, function() {
      if (this.props.changeSort) {
        this.props.changeSort(columnData)
      }
    }.bind(this));

    // any other function, like sorting, will need the col meta data.
  },

  render: function() {
    var header = this._buildHeaderSpan(),
        rows = this._buildRows(),
        colHeader = this._buildColumnHeader();

    return (
      <table className="cui-table">
        <thead>
          <tr className="cui-table-header-colspan">
            { header}
          </tr>
          <tr className="cui-table-header-cols">
            { colHeader }
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    );
  }
});

module.exports = Table;
