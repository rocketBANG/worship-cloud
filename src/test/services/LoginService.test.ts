import * as LoginApi from '../../store/login-api'
import { LoginService } from '../../services/LoginService';

jest.mock('../../store/login-api');

describe('Test Login service', () => {
    const loginCookie = LoginApi.loginCookie as jest.Mock;

    test('LoginCookie handles error', async () => {
        loginCookie.mockImplementation(() => {
            return Promise.reject();
        })

        let loginService = new LoginService();
        await loginService.setup();
        expect(loginService.IsLoggedIn).toBe(false);
    })

    test('LoginCookie handles success false', async () => {
        loginCookie.mockImplementation(() => {
            return Promise.resolve({success: false});
        })

        let loginService = new LoginService();
        await loginService.setup();
        expect(loginService.IsLoggedIn).toBe(false);
    })

    test('LoginCookie login success', async () => {
        loginCookie.mockImplementation(() => {
            return Promise.resolve({success: true, username: 'rocketbang', key: '123'});
        })

        let loginService = new LoginService();
        await loginService.setup();
        expect(loginService.IsLoggedIn).toBe(true);
        expect(loginService.Username).toBe('rocketbang');
        expect(loginService.AuthToken).toBe('123');
    })

});