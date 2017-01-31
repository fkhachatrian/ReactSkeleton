import 'babel-polyfill';
import './config/Config.js';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';

(function () {
  ReactDOM.render(<App />, document.getElementById('app'));
})();
