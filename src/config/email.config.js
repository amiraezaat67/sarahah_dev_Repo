import { envConfig } from "./index.js";
const emailEnv = envConfig.emails;

export const emailConfig = {
    host: emailEnv.host,
    port: emailEnv.port,
    secure: emailEnv.secure,
    auth: {
        user: emailEnv.auth.user,
        pass: emailEnv.auth.pass
    }
};
