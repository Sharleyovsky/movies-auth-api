import { UserRoleEnum } from "./user-role.enum";
import { SetMetadata } from "@nestjs/common";

export const USER_ROLES_KEY = "userRoles";
export const UserRoles = (...userRoles: UserRoleEnum[]) =>
    SetMetadata(USER_ROLES_KEY, userRoles);
