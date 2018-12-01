import React from 'react';

import TODOForm from './components/TODOForm';
import TODOList from './components/TODOList';
import { API_ENDPOINT_URL, API_HEADERS } from './config';
import { getJSONOrLogError } from './utils';


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
      .then(response => getJSONOrLogError(response))
      .then(responseJson => this.setState({items: responseJson, status: 'Done'}));
  }

  async addItem(name) {
    fetch(API_ENDPOINT_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({name: name}),
    })
      .then(response => getJSONOrLogError(response))
      .then(data => this.setState({items: [data].concat(this.state.items)}))
      .catch(e => console.log(e.message));
  }

  async toggleItem(itemId, itemCompleted) {
    return fetch(API_ENDPOINT_URL + '/' + itemId, {
      method: 'PUT',
      headers: API_HEADERS,
      body: JSON.stringify({completed: !itemCompleted}),
    })
      .then(response => getJSONOrLogError(response))
      .then(data => this.setState({items: this.state.items.map((item) => item.id === data.id ? data : item)}))
      .catch(e => console.log(e.message));
  }

  async deleteItem(itemId) {
    return fetch(API_ENDPOINT_URL + '/' + itemId, {
      method: 'DELETE',
      headers: API_HEADERS,
    })
      .then(response => getJSONOrLogError(response))
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