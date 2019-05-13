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
    public async tryLogin(username: string, password: string) {
        const response = await LoginApi.login(username, password);
        if(response && response.success) {
            this.authToken = response.key;
            this.username = response.username;
            this.loggedIn = true;
            return true;
        } else {
            this.loggedIn = false;
            return false;
        }
    }

    @action
    public async logout() {
        await LoginApi.logout();
        this.loggedIn = false;
        this.username = undefined;
        this.authToken = undefined;
    }

    @action 
    public async setup() {
        return await this.loginCookie();
    }

    private loginCookie = async () => {
        try {
            const response = await LoginApi.loginCookie();
            if(response.success === true) {
                this.authToken = response.key;
                this.username = response.username;
                this.loggedIn = true;
                return true;
            }
        }
        catch {
            this.loggedIn = false;
        }

        return false;
    }
}