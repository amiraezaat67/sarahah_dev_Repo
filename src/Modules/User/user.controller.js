import  { Router } from "express";
import * as userService from "./user.service.js";
import { authenticate, authorize } from "../../Middlewares/authentication.middleware.js";
import { USER_ROLES } from "../../Common/constants.js";
const userController = Router();

userController.get('/profile', authenticate, async (req, res) => {
   const data = await userService.getProfileService(req);
   res.json(data);
});

userController.put('/update', authenticate , async (req,res)=>{   
   const result  = await userService.updateUserProfile(req.user , req.body)   
   res.status(200).json({message: "User updated successfully", data: result})
})

// list all users
userController.get('/all', authenticate , authorize([USER_ROLES.USER, USER_ROLES.ADMIN]), async (req,res)=>{
   const result = await userService.getAllUsers()
   res.status(200).json({message: "Users retrieved successfully", data: result})
})

// delete user acccount
userController.delete('/delete', authenticate , async (req,res)=>{
   const result = await userService.deleteUserAccountWithTrans(req.user)
   res.status(200).json({message: "User account deleted successfully", data: result})
})

export default userController;