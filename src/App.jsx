import React from 'react';

import { API_ENDPOINT_URL, API_HEADERS } from './config';
import { _getJSONOrLogError } from './utils';


class TODOForm extends React.Component {

  constructor(props) {
    super(props);
    this.newItemInput = React.createRef();
  }

  render() {
    return (
      <div id="todo_form">
        <form onSubmit={ this.addItem.bind(this) } autoComplete="off">
          <input id="todo_new" type="text" placeholder="Anything pending?" ref={this.newItemInput} />
        </form>
      </div>
    );
  }

  addItem(e) {
    e.preventDefault();
    this.props.addItem(this.newItemInput.current.value);
    this.newItemInput.current.value = '';
  }

}


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


class TODOApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      status: 'No items yet',
    };
  }

  componentDidMount() {
    this.getItems();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.items !== this.state.items) {
      this.refreshStatus();
    }
  }

  render() {
    return (
      <div id="todo_app">
        <h1><i className="far fa-check-circle"></i> TODO</h1>
        <p>
          Type and hit Enter to create a new item.<br />
          Click an item to toggle it, or click on <i className="far fa-trash-alt"></i> to delete it.
        </p>
        <TODOForm addItem={ this.addItem.bind(this) } />
        <TODOList
          items={ this.state.items }
          toggleItem={ this.toggleItem.bind(this) }
          deleteItem={ this.deleteItem.bind(this) }
        />
        <p id="todo_status">{ this.state.status }</p>
      </div>
    );
  }

  getItems() {
    this.setState({status: 'Loading...'});
    fetch(API_ENDPOINT_URL, {headers: API_HEADERS})
      .then(response => _getJSONOrLogError(response))
      .then(responseJson => this.setState({items: responseJson, status: 'Done'}));
  }

  async addItem(name) {
    fetch(API_ENDPOINT_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({name: name}),
    })
      .then(response => _getJSONOrLogError(response))
      .then(data => this.setState({items: [data].concat(this.state.items)}))
      .catch(e => console.log(e.message));
  }

  async toggleItem(itemId, itemCompleted) {
    return fetch(API_ENDPOINT_URL + '/' + itemId, {
      method: 'PUT',
      headers: API_HEADERS,
      body: JSON.stringify({completed: !itemCompleted}),
    })
      .then(response => _getJSONOrLogError(response))
      .then(data => this.setState({items: this.state.items.map((item) => item.id === data.id ? data : item)}))
      .catch(e => console.log(e.message));
  }

  async deleteItem(itemId) {
    return fetch(API_ENDPOINT_URL + '/' + itemId, {
      method: 'DELETE',
      headers: API_HEADERS,
    })
      .then(response => _getJSONOrLogError(response))
      .then(_ => this.setState({items: this.state.items.filter(item => itemId !== item.id)}))
      .catch(e => console.log(e.message));
  }

  refreshStatus() {
    var total = this.state.items.length;
    var completed = this.state.items.filter(item => item.completed).length;
    this.setState({status: total + ' items, ' + completed + ' completed'});
  }

}


export default TODOApp;