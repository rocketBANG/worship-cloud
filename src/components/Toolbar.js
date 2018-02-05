import React from 'react'
import { NavLink } from 'react-router-dom'

export const Toolbar = () => (
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
        </ul>
    </div>
)
  
  
