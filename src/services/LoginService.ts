import { observable, action, computed } from "../../node_modules/mobx";
import Cookies from 'js-cookie';
import * as LoginApi from '../store/login-api'

export class LoginService {
    @observable
    private loggedIn = false;

    @observable
    private authToken: string = undefined;

    @observable
    private username: string = undefined;

    @computed
    public get AuthToken() {
        return this.authToken;
    }

    @computed
    public get Username() {
        return this.username;
    }

    @computed 
    public get IsLoggedIn() {
        return this.loggedIn;
    }

    @action 
    public tryLogin(username: string, password: string) {
        console.log('not implemented');
    }

    @action 
    public async setup() {
        return await this.loginCookie(Cookies.get('worship_login'));
    }

    private loginCookie = async (cookie) => {
        const response = await LoginApi.loginCookie(cookie);
        if(response.success === true) {
            this.authToken = response.key;
            this.username = response.username;
            this.loggedIn = true;
            return true;
        } else {
            this.loggedIn = false;
            return false;
        }
    }
}