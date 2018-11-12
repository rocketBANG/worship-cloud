import { databaseURL } from "./api";

export interface ILoginResponse {
    success: boolean;
    key: string;
    username: string;
}

export const loginCookie = async (): Promise<ILoginResponse> => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return await fetch(databaseURL + `/logincookie/`, {
		credentials: 'include', 
        method: 'POST',
        headers,
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
}

export const logout = async () => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return await fetch(databaseURL + `/logout/`, {
		credentials: 'include', 
        method: 'POST',
        headers,
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )

}

export const login = async (username: string, password: string): Promise<ILoginResponse> => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body = {password};

    return await fetch(databaseURL + `/login/` + username, {
		credentials: 'include', 
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
}