//@ts-check

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import songApp from './store/reducers'
import thunkMiddleware from 'redux-thunk'
import {Provider} from 'react-redux'

ReactDOM.render(
    <App />
    , document.getElementById('root'));
registerServiceWorker();