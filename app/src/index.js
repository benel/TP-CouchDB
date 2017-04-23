import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/user/:user" component={App} />
      <Route path="/hashtag/:hashtag" component={App} />
    </div>
  </Router>,
  document.getElementById('root')
);
