import * as React from 'react';
import './App.css';

import { BrowserRouter, Route } from 'react-router-dom'

import Viewer from './pages/Viewer';

import { Toolbar } from './components/Toolbar';
import Editor from './pages/Editor';
import SermonEditor from './pages/SermonEditor';

import Presenter from './pages/Presenter';
import { SettingsPage } from './pages/SettingsPage';
import { Popup } from './components/general/Popup';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { LoginService } from './services/LoginService';

class App extends React.Component {

    private loginService;

    constructor(props) {
        super(props);

        this.loginService = new LoginService();        
    }

    public render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Popup />
                    <Route path="/viewer" component={Viewer} />

                    <Route exact={true} path='/editor' render={(props) => <Toolbar {...props} loginService={this.loginService} />} />
                    <Route exact={true} path='/presenter' render={(props) => <Toolbar {...props} loginService={this.loginService} />} />
                    <Route exact={true} path='/settings' render={(props) => <Toolbar {...props} loginService={this.loginService} />} />
                    <Route exact={true} path='/sermoneditor' render={(props) => <Toolbar {...props} loginService={this.loginService} />} />
                    <Route exact={true} path='/' render={(props) => <Toolbar {...props} loginService={this.loginService} />} />

                    <ProtectedRoute exact path="/" component={Editor} loginService={this.loginService} />
                    <ProtectedRoute path="/editor" component={Editor} loginService={this.loginService} />
                    <Route path="/sermoneditor" component={SermonEditor} />

                    <Route path="/presenter" component={Presenter} />

                    <Route path="/settings" component={SettingsPage} />

                    <Route path="/login" render={props => 
                        <LoginPage loginService={this.loginService} {...props}/>
                    }/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
