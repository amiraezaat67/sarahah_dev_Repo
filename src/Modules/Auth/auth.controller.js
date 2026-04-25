import  { Router } from "express";
import * as authService from "./auth.service.js";
import { responseFormatter } from "../../Middlewares/unified-response.middleware.js";
import { authenticate } from "../../Middlewares/authentication.middleware.js";
const authController = Router();

authController.post('/register', responseFormatter(
    async (req, res , next) => {
    const result  = await authService.registerService(req.body);
    return {message: "User registered successfully", data: result , meta: {timestamp: new Date().toISOString(), statusCode: 201}}
}));

authController.post('/login', responseFormatter(
    async (req, res) => {
    const result  = await authService.loginService(req.body);
    return {message: "User logged in successfully", data:result, meta: {timestamp: new Date().toISOString(), statusCode: 200}}
}));

authController.post('/refresh-token', responseFormatter(
    async (req, res) => {
    const result  = await authService.refreshTokenService(req.headers);
    return {message: "Token refreshed successfully", data: result, meta: {timestamp: new Date().toISOString(), statusCode: 200}};
}));


authController.post('/gmail/register', responseFormatter(
    async (req, res) => {
    const result  = await authService.registerWithGoogleService(req.body);
    return {message: "User registered successfully", data: result, meta: {timestamp: new Date().toISOString(), statusCode: 201}};
}));

authController.post('/gmail/login', responseFormatter(
    async (req, res) => {
    const result  = await authService.loginWithGoogleService(req.body);
    return {message: "User logged in successfully", data: result, meta: {timestamp: new Date().toISOString(), statusCode: 200}};
}));

authController.post('/logout' , authenticate , responseFormatter(
    async (req, res) => {
    const result  = await authService.logoutService(req.headers, req.accessTokenData);
    return {message: "User logged out successfully", data: result, meta: {timestamp: new Date().toISOString(), statusCode: 200}};
}));

export default authController;