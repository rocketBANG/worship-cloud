import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { LoginService } from '../services/LoginService';

interface IProps {
    loginService: LoginService
}

export const Toolbar = (props: IProps) => {
    const onLogout = () => {
        props.loginService.logout();
    }

    return (
        <div className='toolbar'>
            <ul>
                <li>
                    <NavLink to="/editor" activeClassName="selected">
                        Editor
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/presenter" activeClassName="selected">
                        Presenter
                    </NavLink>
                </li>
                <li>
                    <a href="/viewer" target='blank'>
                        Display
                    </a>
                </li>
                <li>
                    <NavLink to="/settings" activeClassName="selected">
                        Settings
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/sermoneditor" activeClassName="selected">
                        Sermon Editor
                    </NavLink>
                </li>
            </ul>
            <ul style={{float: 'right'}}>
                <li>
                    <a onClick={onLogout}>Logout</a>
                </li>
            </ul>
        </div>
    );
}
  
