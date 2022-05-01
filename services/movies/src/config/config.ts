export const config = {
    port: process.env.MOVIES_PORT || 4000,
    title: "MOVIES API",
    version: "0.1",
    jwt: process.env.JWT_SECRET,
};
