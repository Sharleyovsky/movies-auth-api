import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "./config/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = new DocumentBuilder()
        .addSecurity("basic", {
            type: "http",
            scheme: "basic",
        })
        .setTitle("Movies API")
        .setVersion("0.1")
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup("swagger", app, document);
    await app.listen(config.port);
}
bootstrap();
