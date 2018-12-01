import React from 'react';


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


export default TODOForm;