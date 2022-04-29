import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "./config/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const swaggerConfig = new DocumentBuilder()
        .addSecurity("bearer", {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        })
        .setTitle(config.title)
        .setVersion(config.version)
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup("swagger", app, document);
    await app.listen(config.port);
}
bootstrap();
