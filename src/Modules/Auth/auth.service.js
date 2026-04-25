import { OAuth2Client } from 'google-auth-library';
import crypto from 'node:crypto'
import { compare, ConflictError, createLoginCredentials, decodeToken, encrypt, hash, PROVIDERS, TOKEN_TYPES } from "../../Common/index.js";
import { envConfig } from '../../config/index.js';
import  UserRepository  from "../../DB/Repositories/user.repository.js";
import { blacklistToken, ttl } from '../../Common/services/redis/redis.service.js';
import { randomUUID } from 'node:crypto'
import { emailEvent } from '../../Common/services/emails/send-email.service.js';

const jwtSecrets  = envConfig.jwt
const gcp  = envConfig.gcp
const client = new OAuth2Client();

// Validate environment variables before building tokens
const validateEnv = () => {
    if (!jwtSecrets || !gcp) {
        throw new Error("Missing required environment variables", {cause:{status:500}});
    }
    
    if(Object.values(jwtSecrets.admin).includes(undefined)) {
        throw new Error("Missing admin jwt required environment variables", {cause:{status:500}});
    }

    if(Object.values(jwtSecrets.user).includes(undefined)) {
        throw new Error("Missing user jwt required environment variables", {cause:{status:500}});
    }
}
validateEnv()

// Registration
export const registerService = async (body) => {      
    const { firstName, lastName, email, password , gender , phone } = body;

    // Repo pattern
    const checkEmailDuplication = await UserRepository.findOneDocument({email},{email:1});    
    if (checkEmailDuplication) {
        throw new ConflictError("Email already exists", {duplicatedEmail:email});
    }

    const hashedPassword = await hash(password , 12)
    const userObject = {
        firstName,
        lastName,
        email,
        password:hashedPassword,
        gender
    };

    if(phone) {
        userObject.phoneNumber = encrypt(phone);
    }

    // send email with generated otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    userObject.OTPs = [{value:otp , expiresAt:Date.now() + 10 * 60 * 1000 , channel:'email'}]
    // emit event to send email
    emailEvent.emit("sendEmail", {
        email,
        message: otp,
        subject: "Verify your email"
    });

    // Repo pattern 
    return UserRepository.createDocument(userObject);

}

/**
 * Builds access + refresh tokens for a given user.
 * @param {Object} user - must have _id, email, role
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const buildTokens = (user)=>{

   // Generate user token  [ access token ]
    const tokenPayload = { _id : user._id , email:user.email , role:user.role}
    const { accessToken , refreshToken } = createLoginCredentials(
        {
            payload:tokenPayload,
            options:{  
                access:{
                    expiresIn:jwtSecrets[user.role].accessExpiration,
                    jwtid:randomUUID()
                },
                refresh:{
                    expiresIn:jwtSecrets[user.role].refreshExpiration,
                    jwtid:randomUUID()
                }
            }
        }
    )

    return { accessToken , refreshToken };
}

// login Api
export const loginService = async (body) => {
    const { email, password } = body;
    
    const user  = await UserRepository.findOneDocument({email});
    if (!user) {
        throw new Error("Invalid email or password", {cause:{status:401}});
    }
    
    const isPasswordValid = await compare(password , user.password)
    if (!isPasswordValid) {
        throw new Error("Invalid email or password", {cause:{status:401}});
    }
    
    // Generate user token  [ access token  , refresh token ]
    return buildTokens(user);
}

// Refresh token 
export const refreshTokenService = async (header)=>{
    // get refresh token from headers
    const { authorization:refreshToken } = header

    const {decodedData} = await decodeToken({token:refreshToken , tokenType:TOKEN_TYPES.REFRESH})    

    const { accessToken } = buildTokens(decodedData)
    return { accessToken }
}

// Verify Google ID token
const verifyIdToken = async (token) => {    
    const WEB_CLIENT_ID = gcp.webClientId;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: WEB_CLIENT_ID
    });
  
    const payload = ticket.getPayload();
    // This ID is unique to each Google Account, making it suitable for use as a primary key
    // during account lookup. Email is not a good choice because it can be changed by the user.
    
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];
    return payload
}

const handleUserUpdateOrCreation = async ({userWithSub, payload}) =>{
    const { sub , email, given_name, family_name } = payload
    if(userWithSub){
        return UserRepository.updateWithFindById({
            id: userWithSub._id, 
            data:{email, firstName: given_name, lastName: family_name}, 
            options:{new:true}
        })
    }else{
        const hashedPassword = await hash(crypto.randomBytes(12).toString('hex'))
        const userToBeAdded = {
            googleSub: sub,
            email,
            firstName: given_name,
            lastName: family_name,
            password: hashedPassword,
            provider:PROVIDERS.GOOGLE
        }
        return UserRepository.createDocument(userToBeAdded)
    }
}

// register using Google
export const registerWithGoogleService = async (body) => {
    const { idToken} = body

    // Verify Google ID token
    const payload = await verifyIdToken(idToken)
    if(!payload || !payload.email_verified || !payload.sub) throw new Error('Invalid user email', {cause:{status:400}})

    // Find user from db with sub and provider
    const userWithSub = await UserRepository.findOneDocument({
        $or: [
            { googleSub: payload.sub },
            { email: payload.email }
        ],
        provider:PROVIDERS.GOOGLE
    })

    // Handle user update or creation based on whether user exists
    const user = await handleUserUpdateOrCreation({userWithSub, payload})
    
    // Generate user token  [ access token  , refresh token ]
    return buildTokens(user);
}

// login using Google
export const loginWithGoogleService = async (body) => {
    const { idToken} = body

    // Verify Google ID token
    const payload = await verifyIdToken(idToken)
    if(!payload || !payload.email_verified || !payload.sub) throw new Error('Invalid user email', {cause:{status:400}})

    // Find user from db with sub and provider
    const userWithSub = await UserRepository.findOneDocument({ 
        $or: [
            { googleSub: payload.sub },
            { email: payload.email }
        ],
        provider:PROVIDERS.GOOGLE
    })
    if(!userWithSub) throw new Error('User not found', {cause:{status:404}})
    
    // Generate user token  [ access token  , refresh token ]
    return buildTokens(userWithSub);
}



// authentication middleware 
export const logoutService = async (headers, accessTokenData) => {
    // Verify refresh token
    const refreshToken = headers['refreshtoken']?.split(' ')[1]
    const {decodedData} = await decodeToken({token: refreshToken, tokenType: TOKEN_TYPES.REFRESH})
    
    const refreshTokenId = decodedData.jti
    const refreshTokenExpiration = decodedData.exp
    
    const accessTokenId = accessTokenData.jti
    const accessTokenExpiration = accessTokenData.exp
    
    console.log({
        accessTokenExpiration ,
        refreshTokenExpiration
    });
        
    // use promise.all
    await Promise.all([
        blacklistToken(`bl_${TOKEN_TYPES.ACCESS}_${accessTokenId}`, accessTokenExpiration),
        blacklistToken(`bl_${TOKEN_TYPES.REFRESH}_${refreshTokenId}`, refreshTokenExpiration)
    ])
    

    return { message: 'Logged out successfully', 
          accessTokenTTL: await ttl(`bl_${TOKEN_TYPES.ACCESS}_${accessTokenId}`),
        refreshTokenTTL: await ttl(`bl_${TOKEN_TYPES.REFRESH}_${refreshTokenId}`) }
}