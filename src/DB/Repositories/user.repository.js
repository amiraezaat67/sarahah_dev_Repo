import { User } from "../Models/index.js";
import BaseRepository from "./base.repository.js";


class UserRepository extends BaseRepository {
    constructor(){
        super(User)
    }

}

export default new UserRepository();