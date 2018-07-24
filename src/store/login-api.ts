import * as API from './api'

export interface ILoginResponse {
    success: boolean;
    key: string;
    username: string;
}

export const loginCookie = async (cookie: string): Promise<ILoginResponse> => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('auth-token', cookie);

    return await fetch(API.databaseURL + `/logincookie/`, {
        method: 'POST',
        headers,
        credentials: 'include'
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
}

export const login = async (username: string, password: string): Promise<ILoginResponse> => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body = {password};

    return await fetch(API.databaseURL + `/login/` + username, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        credentials: 'include'
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
}