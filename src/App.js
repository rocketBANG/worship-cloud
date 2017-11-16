import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux'
import songApp from './store/reducers'
import './App.css';
import Editor from './Editor'
import Presenter from './Presenter'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'  
import thunkMiddleware from 'redux-thunk'
import {Provider} from 'react-redux'
  

class App extends Component {
    constructor(props) {
        super(props);

        this.store = createStore(songApp, applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
        ));

        const unsubscribe = this.store.subscribe(() =>
            console.log(this.store.getState())
        )
        
    }

    render() {
        return (
            <Provider store={this.store}>
                <Router>            
                    <div className="App">
                        <Route exact path="/" component={Editor}/>
                        <Route path="/editor" component={Editor}/>
                        <Route path="/presenter" component={Presenter}/>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
