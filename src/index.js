//@ts-check

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import songApp from './store/reducers'
import thunkMiddleware from 'redux-thunk'

// function reqListener () {
//   console.log(this.responseText);
// }

// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener);
// oReq.open("GET", "http://128.199.145.41:5000/songs");
// oReq.withCredentials = true;
// oReq.setRequestHeader("Authorization", "Basic " + btoa("admin:late4tea2"))
// oReq.send(null);
var store = createStore(songApp, applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
));

ReactDOM.render(
    <App store={store} />
    , document.getElementById('root'));
registerServiceWorker();