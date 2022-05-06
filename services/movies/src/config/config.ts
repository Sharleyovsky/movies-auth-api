export const getConfig = () => {
    const requiredEnvs = ["JWT_SECRET", "MONGO_URI", "OMDB_API_KEY"];
    requiredEnvs.every((env) => {
        if (!Object.keys(process.env).includes(env)) {
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
