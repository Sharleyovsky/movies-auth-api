import { Logger } from "@nestjs/common";

export const getConfig = () => {
    const logger = new Logger("Config");
    const requiredEnvs = [
        "MOVIES_PORT",
        "JWT_SECRET",
        "MONGO_URI",
        "OMDB_API_KEY",
    ];

    requiredEnvs.every((env) => {
        const envs = Object.keys(process.env);

        if (!envs.includes(env) && env === "MOVIES_PORT") {
            logger.warn(
                "Environment variable MOVIES_PORT is not defined, the app is going to run on default 3000 port",
            );

            return true;
        }

        if (!envs.includes(env)) {
            throw new Error(`Environment variable ${env} is not defined!`);
        }

        return true;
    });

    return {
        port: process.env.MOVIES_PORT ?? 3000,
        title: "MOVIES API",
        version: "0.1",
        jwt: process.env.JWT_SECRET,
        connectionUri: process.env.MONGO_URI,
        omdbUrl: `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`,
        apiCallsLimit: 5,
    };
};
