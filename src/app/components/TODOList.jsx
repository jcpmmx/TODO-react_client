import React from 'react';

import TODOItem from './TODOItem';


class TODOList extends React.Component {
  render() {
    var items = this.props.items;
    return (
      <ul id="todo_list">
      { items.map(data => 
        <TODOItem
          key={ data.id }
          data={ data }
          toggleItem={ this.props.toggleItem }
          deleteItem={ this.props.deleteItem }
        />
      ) }</ul>
    );
  }
}


export default TODOList;