import * as React from 'react';
import './App.css';

import { BrowserRouter, Route } from 'react-router-dom'

import Viewer from './pages/Viewer';

import { Toolbar } from './components/Toolbar';
import Editor from './pages/Editor';
import SermonEditor from './pages/SermonEditor';

import Presenter from './pages/Presenter';
import { SettingsPage } from './pages/SettingsPage';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/viewer" component={Viewer} />

          <Route exact={true} path='/editor' component={Toolbar} />
          <Route exact={true} path='/presenter' component={Toolbar} />
          <Route exact={true} path='/settings' component={Toolbar} />
          <Route exact={true} path='/sermoneditor' component={Toolbar} />
          <Route exact={true} path='/' component={Toolbar} />

          <Route exact={true} path="/" component={Editor} />
          <Route path="/editor" component={Editor} />
          <Route path="/sermoneditor" component={SermonEditor} />

          <Route path="/presenter" component={Presenter} />

          <Route path="/settings" component={SettingsPage} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
