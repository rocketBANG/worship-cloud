import * as React from 'react'
import { LoginService } from '../services/LoginService';
import { Redirect } from 'react-router-dom';
import { observer } from '../../node_modules/mobx-react';

interface IState {
    username: string,
    password: string,
    triedLogin: boolean,
    autoLogin: boolean
}

interface IProps {
    loginService: LoginService,
    location: {
        state: {
            from: string
        }
    }
}

@observer
export class LoginPage extends React.Component<IProps, IState> {

    public state = {
        username: undefined,
        password: undefined,
        triedLogin: false,
        autoLogin: true
    }

    public async tryAutoLogin() {
        let sucess = await this.props.loginService.setup();
        if(sucess) return;

        this.setState({autoLogin: false})
    }

    private updateInput = (event) => {
        // @ts-ignore
        this.setState({[event.target.name]: event.target.value});
    }

    private tryLogin = async (event) => {
        event.preventDefault();
        let success = await this.props.loginService.tryLogin(this.state.username, this.state.password);

        if(!success) {
            this.setState({triedLogin: true});
        }
    }

    public render() {

        const { from } = this.props.location.state || { from: { pathname: '/'} };
        const redirect = this.props.loginService.IsLoggedIn;
        if(redirect) {
            return <Redirect to={from} />
        }

        const loginForm = (
            <form onSubmit={this.tryLogin}>
                <div className='formEntry'>
                    <label htmlFor='username'>Username: </label>
                    <input name='username' id='username' onChange={this.updateInput} />
                </div>
                <div className='formEntry'>
                    <label htmlFor='password'>Password: </label>
                    <input name='password' type='password' id='password' onChange={this.updateInput} />
                </div>
                <button type='submit'>Login</button>
                {this.state.triedLogin && <div className='loginError'>Invalid username/password</div>}
            </form>
        );
        let rendered = loginForm;

        if(this.state.autoLogin) {
            rendered = (
                <div>
                    Logging you in...
                </div>
            );
            this.tryAutoLogin();
        }
        
        return (
            <div className="LoginPage">
                {rendered}
            </div>
        );
    }
}