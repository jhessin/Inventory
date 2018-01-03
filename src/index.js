import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-firebase';
import firebaseApp from './firebase';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider firebaseApp={firebaseApp}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
