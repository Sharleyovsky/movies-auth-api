import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
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

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("/movies (GET)", async () => {
        const response = await request(app.getHttpServer())
            .get("/movies")
            .set("Authorization", `Bearer ${jwtMock}`);

        expect(response.status).toBe(HttpStatus.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("/movies (POST)", async () => {
        const response = await request(app.getHttpServer())
            .post("/movies")
            .send({ title: "Batman" })
            .set("Authorization", `Bearer ${jwtMock}`);

        expect(response.status).toBe(HttpStatus.CREATED);
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

    it("/movies (POST) duplicate error", async () => {
        const response = await request(app.getHttpServer())
            .post("/movies")
            .send({ title: "Batman" })
            .set("Authorization", `Bearer ${jwtMock}`);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body?.message).toBe(
            "This movie was already added by this user!",
        );
    });

    it("/movies (POST) not found in the OMDB", async () => {
        const response = await request(app.getHttpServer())
            .post("/movies")
            .send({ title: "HHAJDHFASH" })
            .set("Authorization", `Bearer ${jwtMock}`);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(response.body?.message).toBe(
            "Movie that you are looking for wasn't found in the OMDB",
        );
    });

    it("/movies (POST) empty title", async () => {
        const response = await request(app.getHttpServer())
            .post("/movies")
            .send({ title: " " })
            .set("Authorization", `Bearer ${jwtMock}`);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body?.message).toBe(
            "Title is either empty or incorrect!",
        );
    });

    afterEach(async () => app.close());
});
