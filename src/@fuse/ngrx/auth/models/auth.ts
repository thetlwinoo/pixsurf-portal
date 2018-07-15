export interface Authenticate {
    email: string;
    password: string;
    rememberme: boolean;
}

export interface User {
    email: string;
    token: string;
}