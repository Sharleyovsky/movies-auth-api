import { UserRole } from "./UserRole";

export interface User {
    id: number;
    role: UserRole;
    name: string;
}
