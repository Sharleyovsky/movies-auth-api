import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoviesController } from "./movies/movies.controller";
import { MoviesService } from "./movies/movies.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "./config/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(config.connectionUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }),
        AuthModule,
    ],
    controllers: [AppController, MoviesController],
    providers: [AppService, MoviesService],
})
export class AppModule {}
