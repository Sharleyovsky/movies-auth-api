import { User } from "./User";

export interface UserRequest extends Request {
    user: User;
}
