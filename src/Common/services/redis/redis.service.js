import { redisClient } from "../../Clients/index.js";

export const get = async (key) => {
    return await redisClient.get(key);
}

export const getAllKeys = async () => {
    return redisClient.keys("*");
}

export const del = async (key) => {
    return await redisClient.del(key);
}

export const Hset = async (key, field, value) => {
    return await redisClient.hset(key, field, value);
}

export const Hget = async (key, field) => {
    return await redisClient.hget(key, field);
}

export const Hgetall = async (key) => {
    return redisClient.hgetall(key);
}

export const ttl = async (key) => {
    return redisClient.ttl(key);
}

export const expire = async (key, seconds) => {
    return redisClient.expire(key, seconds);
}

export const set = async ({key, value, options = {}}) => {
    await redisClient.set(key, value, options);
}


/**
 * You subtract the current time from the token's expiration timestamp to calculate how many seconds remain until the token expires.
 * Redis TTL (Time To Live) expects seconds from now, not an absolute timestamp.
 * 
 * This function converts JWT's absolute expiration time into Redis's required relative TTL. 
 * Without this conversion, Redis would set the expiration to a huge number (the absolute timestamp),
 * causing tokens to live far longer than intended.
 */
const calculateTTL = (ttl) => {
    // Calculate actual TTL in seconds from expiration timestamp
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return ttl - currentTime;
}

// blacklist token to prevent reuse
export const blacklistToken = async (key, ttl) => {
    let ttlSeconds
    if(ttl){
        ttlSeconds = calculateTTL(ttl);
        // console.log({
        //     key,
        //     tokenExpiration: ttl,
        //     currentTime: Math.floor(Date.now() / 1000),
        //     ttlSeconds
        // });
    }
    if (ttlSeconds <= 0) return; // already expired
    
    await set({key, value: "true", options: { EX: ttlSeconds }});
}

