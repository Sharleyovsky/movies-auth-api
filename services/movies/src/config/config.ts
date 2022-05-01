export const getConfig = () => ({
    port: process.env.MOVIES_PORT || 4000,
    title: "MOVIES API",
    version: "0.1",
    jwt: process.env.JWT_SECRET,
    connectionUri: process.env.MONGO_URI,
    omdbUrl: `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`,
    apiCallsLimit: 5,
});
