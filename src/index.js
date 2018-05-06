import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import axios from 'axios';

window.axios = axios;
axios.defaults.baseURL = 'http://localhost:8000';
// if(process.env.NODE_ENV === 'production') {
//   axios.defaults.withCredentials = true;
//   axios.defaults.baseURL = 'https://api.bitimulate.com';
// }

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
