import {config} from "dotenv";

config({ path : [`.${process.env.NODE_ENV}.env`, '.env']});

export const envConfig = {
   app:{
        NODE_ENV: process.env.NODE_ENV ?? 'dev',
        PORT: process.env.PORT ?? 8000
   },
    database:{
        MONGO_URL:process.env.MONGO_URL_CLOUD
    },
    encryption:{
        ENCRYPTION_KEY: process.env.ENC_KEY,
        IV_LENGTH: process.env.ENC_IV_LENGTH
    },
    jwt:{
        user:{
            accessSignature: process.env.JWT_ACCESS_SECRET_USER,
            accessExpiration: parseInt(process.env.JWT_ACCESS_EXP_USER),

            refreshSignature: process.env.JWT_REFRESH_SECRET_USER,
            refreshExpiration: parseInt(process.env.JWT_REFRESH_EXP_USER)
        },
        admin:{
            accessSignature: process.env.JWT_ACCESS_SECRET_ADMIN,
            accessExpiration: parseInt(process.env.JWT_ACCESS_EXP_ADMIN),
            
            refreshSignature: process.env.JWT_REFRESH_SECRET_ADMIN,
            refreshExpiration: parseInt(process.env.JWT_REFRESH_EXP_ADMIN)
        }
    },
    gcp:{
        webClientId: process.env.GCP_CLIENT_ID
    },
    cors:{
        whiteList: process.env.CORS_WHITE_LIST?.split(',') || []
    },
    redis:{
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    emails:{
        from: process.env.EMAIL_USER,
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
};

