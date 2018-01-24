import React, { Component } from 'react';
import './style/App.css';
import Editor from './pages/Editor'
import Presenter from './pages/Presenter'
import { BrowserRouter, Route } from 'react-router-dom'  
import Viewer from './pages/Viewer';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleWindowClose = this.handleWindowClose.bind(this);
        
    }

    handleWindowClose(event) {
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleWindowClose);
    }
    
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleWindowClose);
    }    

    render() {
        return (
            <BrowserRouter>            
                <div className="App">
                    <Route exact path="/" component={Editor}/>
                    <Route path="/editor" component={Editor}/>
                    <Route path="/presenter" component={Presenter}/>
                    <Route path="/viewer" component={Viewer}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
