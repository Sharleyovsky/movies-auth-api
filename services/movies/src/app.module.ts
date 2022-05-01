import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoviesController } from "./movies/movies.controller";
import { MoviesService } from "./movies/movies.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [ConfigModule.forRoot(), AuthModule],
    controllers: [AppController, MoviesController],
    providers: [AppService, MoviesService],
})
export class AppModule {}
