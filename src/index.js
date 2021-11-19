import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Main from './Main';
import './style.css';

ReactDOM.render(
  //<React.StrictMode>
    <BrowserRouter>
      <Main />
    </BrowserRouter>,
  //</React.StrictMode>,

  document.getElementById('root')
);
