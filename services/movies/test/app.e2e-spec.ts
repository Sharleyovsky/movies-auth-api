import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { JwtGuard } from "../src/auth/guards/jwt.guard";
import { User } from "../src/types/user";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    const user: User = {
        id: 1,
        role: "basic",
        name: "Jim",
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(JwtGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = user;
                    return true;
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/movies (GET)", async () => {
        const response = await request(app.getHttpServer()).get("/movies");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("/movies (POST)", async () => {
        const response = await request(app.getHttpServer())
            .post("/movies")
            .send({ title: "Batman" });

        expect(response.status).toBe(201);
        expect(Object.keys(response.body)).toEqual([
            "userId",
            "title",
            "released",
            "genre",
            "director",
            "_id",
            "createdAt",
            "updatedAt",
        ]);
    });

    afterEach(async () => app.close());
});
