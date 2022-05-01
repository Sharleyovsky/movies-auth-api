import { UserRole } from "./UserRole";

export interface UserPayload {
    userId: number;
    name: string;
    role: UserRole;
    iat: number;
    exp: number;
    iss: string;
    sub: string;
}
