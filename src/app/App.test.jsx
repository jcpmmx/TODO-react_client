import React from 'react';
import ReactDOM from 'react-dom';

import TODOApp from './App';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TODOApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
