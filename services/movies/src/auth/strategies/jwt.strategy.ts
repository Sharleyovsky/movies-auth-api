import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../types/User";
import { config } from "../../config/config";
import { UserPayload } from "../../types/UserPayload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: config.jwt,
        });
    }

    async validate({ userId, role, name }: UserPayload): Promise<User> {
        return {
            id: userId,
            role,
            name,
        };
    }
}
