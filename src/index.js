import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';

process.env.CI = false;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
