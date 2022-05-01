import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { config } from "../config/config";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: config.jwt,
        }),
    ],
    providers: [JwtStrategy],
})
export class AuthModule {}
