import mongoose from "mongoose";
import { UserRepository , MessageRepository} from "../../DB/Repositories/index.js";

export const getProfileService = (req)=>{
    return req.user
}


export const updateUserProfile = async (user , body)=>{
    const { _id } = user
    const { firstName , lastName , age , gender , email} = body    

    if(email){
        const existingUser = await UserRepository.findOneDocument({email});
        if(existingUser){
            throw new Error('Email already exists' , {cause: {status:409}});
        }
    }

    return UserRepository.updateWithFindById({
        id: _id, 
        data: { firstName , lastName , age , gender , email }, 
        options:{new:true}
    });
}

export const getAllUsers = async ()=>{
    return UserRepository.findDocuments({})
}

// delete user account with all user messages using transaction
// build the transaction logic here , not todo just write the logic now
export const deleteUserAccount = async (user)=>{
    const { _id } = user

    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        await MessageRepository.deleteManyDocuments({ filters: { receiverId: _id }, options: { session } });
        await UserRepository.deleteWithFindById({ _id, options: { session } });
        await session.commitTransaction();
        console.log('User account deleted successfully');
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting user account:', error);
        throw error;
    } finally {
        await session.endSession();
        console.log('Session ended');
    }

    return { message: 'User account deleted successfully' };
}



export const deleteUserAccountWithTrans= async (user)=>{
    const { _id } = user
    const session = await mongoose.startSession();
    return session.withTransaction(async () => {
        await MessageRepository.deleteManyDocuments({ filters: { receiverId: _id }, options: { session } });
        await UserRepository.deleteWithFindById({ _id, options: { session } });
    });
}