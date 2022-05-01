export type UserRole = "basic" | "premium";

export interface User {
    id: number;
    role: UserRole;
    name: string;
}

export interface UserPayload {
    userId: number;
    name: string;
    role: UserRole;
    iat: number;
    exp: number;
    iss: string;
    sub: string;
}

export interface UserRequest extends Request {
    user: User;
}
