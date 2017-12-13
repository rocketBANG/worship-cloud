import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux'
import songApp from './store/reducers'
import './style/App.css';
import Editor from './pages/Editor'
import Presenter from './pages/Presenter'
import { BrowserRouter, Route } from 'react-router-dom'  
import thunkMiddleware from 'redux-thunk'
import {Provider} from 'react-redux'
  

class App extends Component {
    constructor(props) {
        super(props);

        this.store = createStore(songApp, applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
        ));

        // const unsubscribe = 
        this.store.subscribe(() =>
            console.log(this.store.getState())
        )

        this.handleWindowClose = this.handleWindowClose.bind(this);
        
    }

    handleWindowClose(event) {
        if(this.store.getState().backend.isPosting !==0 ) {
            event.preventDefault();
            return event.returnValue = 'Are you sure you want to leave? You have unsaved changes';
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleWindowClose);
    }
    
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleWindowClose);
    }    

    render() {
        return (
            <Provider store={this.store}>
                <BrowserRouter>            
                    <div className="App">
                        <Route exact path="/" component={Editor}/>
                        <Route path="/editor" component={Editor}/>
                        <Route path="/presenter" component={Presenter}/>
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
