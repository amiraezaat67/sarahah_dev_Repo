import {envConfig} from "./index.js";
const cors = envConfig.cors

export const corsOptions = {
    origin: (origin, callback) => {
        const whiteList = cors.whiteList
        if (!origin || whiteList.includes(origin) || whiteList.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}