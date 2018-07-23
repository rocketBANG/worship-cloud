import * as React from 'react';
import { Route, Redirect, withRouter, RouteProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import { LoginService } from '../../services/LoginService';

interface IProps {
    loginService: LoginService
}

interface IState {
    Component: React.ComponentClass;
    routerProps: RouteProps
}

const ProtectedRoute = withRouter(observer(class extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);
        let { component, loginService, match, location, history, ...routerProps  } = props; 
        this.state = {
            Component: component,
            routerProps
        }
    }

    public render() {
        let {Component, routerProps } = this.state;
        let { IsLoggedIn } = this.props.loginService;

        return (
           <Route {...routerProps} render={props => 
                IsLoggedIn ? (
                <Component {...props}/>
                )
                : (<Redirect to ={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />)
           }/>
        );
    }
}));

export { ProtectedRoute };
