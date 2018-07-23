export interface ILoginResponse {
    success: boolean;
    key: string;
    username: string;
}

export const loginCookie = async (cookie: string): Promise<ILoginResponse> => {
    return Promise.resolve({
        success: true,
        key: '123',
        username: 'rocketbang'
    });
}