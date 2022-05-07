import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { User } from "../src/types/user";
import { JwtService } from "@nestjs/jwt";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let jwtService: JwtService = new JwtService({
        secret: process.env.JWT_SECRET,
    });
    const user: User = {
        id: 1,
        role: "basic",
        name: "Jim",
    };
    const jwtMock = jwtService.sign(
        {
            userId: user.id,
            name: user.name,
            role: user.role,
        },
        {
            expiresIn: 60,
        },
    );

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/movies (GET) Unauthorized", async () => {
        const response = await request(app.getHttpServer()).get("/movies");

        expect(response.status).toBe(401);
    });

    it("/movies (GET)", async () => {
        const response = await request(app.getHttpServer())
            .get("/movies")
            .set("Authorization", `Bearer ${jwtMock}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("/movies (POST)", async () => {
        const response = await request(app.getHttpServer())
            .post("/movies")
            .send({ title: "Batman" })
            .set("Authorization", `Bearer ${jwtMock}`);

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
