import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger("Main");
    const port = configService.get("port");
    app.useGlobalPipes(new ValidationPipe());

    const swaggerConfig = new DocumentBuilder()
        .addSecurity("bearer", {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        })
        .setTitle(configService.get("title"))
        .setVersion(configService.get("version"))
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup("swagger", app, document);
    await app.listen(port, () => {
        logger.log(`Server is running on port: ${port}`);
    });
}
bootstrap();
