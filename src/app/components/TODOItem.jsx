import React from 'react';


class TODOItem extends React.Component {

  render() {
    var deleteIcon = <i className="far fa-trash-alt" title="Delete this" onClick={ this.deleteItem.bind(this) }></i>;
    return (
      <li 
        className={ this.props.data.completed ? 'completed' : '' }
        onClick={ this.toggleItem.bind(this) }
        title={ this.props.data.completed ? 'Mark as undone' : 'Done? Mark it!' }
      >{ this.props.data.name } { deleteIcon }</li>
    );

  }

  toggleItem() {
    this.props.toggleItem(this.props.data.id, this.props.data.completed);
  }

  deleteItem(e) {
    e.stopPropagation();
    this.props.deleteItem(this.props.data.id);
  }

}


export default TODOItem;
