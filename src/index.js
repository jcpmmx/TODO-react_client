import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

const API_ENDPOINT_URL = 'https://todo-jcpmmx-flaskbe.herokuapp.com/api/todoitems';
const API_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}


function _getJSONOrLogError(response) {
  if (response.ok) return response.json();
  console.log('Error ' + response.statusText);
}


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

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  render() {
    var deleteIcon = <i className="far fa-trash-alt" title="Delete this" onClick={ this.deleteItem.bind(this) }></i>;
    return (
      <li 
        className={ this.state.data.completed ? 'completed' : '' }
        onClick={ this.toggleItem.bind(this) }
        title={ this.state.data.completed ? 'Mark as undone' : 'Done? Mark it!' }
      >{ this.state.data.name } { deleteIcon }</li>
    );

  }

  toggleItem() {
    this.props.toggleItem(this.state.data.id, this.state.data.completed).then(data => this.setState({data}));
  }

  deleteItem(e) {
    e.stopPropagation();
    this.props.deleteItem(this.state.data.id);
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
      ts: (new Date()).toString(),  // To force a `status` refresh
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
      .catch(e => console.log('Server error: ', e.message));
  }

  async toggleItem(itemId, itemCompleted) {
    return fetch(API_ENDPOINT_URL + '/' + itemId, {
      method: 'PUT',
      headers: API_HEADERS,
      body: JSON.stringify({completed: !itemCompleted}),
    })
      .then(response => _getJSONOrLogError(response))
      .then(data => data)
      .catch(e => console.log('Server error: ', e.message));
  }

  async deleteItem(itemId) {
    return fetch(API_ENDPOINT_URL + '/' + itemId, {
      method: 'DELETE',
      headers: API_HEADERS,
    })
      .then(response => _getJSONOrLogError(response))
      .then(_ => this.setState({items: this.state.items.filter(item => itemId === item.id)}))
      .catch(e => console.log('Server error: ', e.message));
  }

  refreshStatus() {
    var total = this.state.items.length;
    var completed = this.state.items.filter(item => item.completed).length;
    this.setState({status: total + ' items, ' + completed + ' completed'});
  }

}


ReactDOM.render(
  <TODOApp />,
  document.getElementById('react')
);
