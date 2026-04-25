// import bcrypt from "bcrypt"
import argon2 from "argon2"

export const hash = (plainText)=>{
    return argon2.hash(plainText)
}

export const compare = (plainText, hashedText)=>{
    // return bcrypt.compare(plainText, hashedText)
    return argon2.verify(hashedText, plainText)
}