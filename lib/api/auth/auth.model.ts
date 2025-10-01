// Authentication related types
export class LoginResponse {
    access_token: string = "";
    token_type: string = "";
    expires_in: number = 0;
    refresh_token?: string = "";
    scope?: string = "";

    constructor(init?: any) {
        Object.assign(this, init);
    }
}
