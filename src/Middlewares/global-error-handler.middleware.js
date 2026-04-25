
 import {envConfig} from "../config/index.js";
 
 /**
  * Global error handler middleware
  * @param {Error} err - The error object
  * @param {Object} req - The request object
  * @param {Object} res - The response object
  * @param {Function} next - The next middleware function
  */
const globalErrorHandler = (err,req,res,next)=>{
  console.log(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error' , 
    stack: envConfig.app.NODE_ENV == 'dev' ? err.stack : undefined,
    error: {
      code: err.code || "INTERNAL_ERROR",
      details: err.details || null
    }
  })
}

export default globalErrorHandler;