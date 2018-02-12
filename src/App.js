import React, { Component } from 'react';
import './style/App.css';
import Editor from './pages/Editor'
import Presenter from './pages/Presenter'
import { BrowserRouter, Route } from 'react-router-dom'  
import Viewer from './pages/Viewer';
import { Toolbar } from './components/Toolbar';
import SermonEditor from './pages/SermonEditor';

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
                    <Route path="/viewer" component={Viewer}/>

                    <Route exact path='/editor' component={Toolbar}/>
                    <Route exact path='/presenter' component={Toolbar}/>
                    <Route exact path='/sermoneditor' component={Toolbar}/>
                    <Route exact path='/' component={Toolbar}/>

                    <Route exact path="/" component={Editor}/>
                    <Route path="/editor" component={Editor}/>
                    <Route path="/sermoneditor" component={SermonEditor}/>

                    <Route path="/presenter" component={Presenter}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
