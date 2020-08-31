import { collections } from '../database';
import { nowJson } from '../helpers/time';
import md5 from 'md5';
import { isRxDocument } from 'rxdb';

export const UserType = Object.freeze({
    Admin: 'admin',
    Regular: 'regular',
})

export default class UsersModel{

    static get collection(){
        return collections.users;
    }

    static getUsers(selector){
        if(typeof selector == 'object'){
            return this.collection.find({
                selector,
            });
        }else{
            return this.collection.find();
        }
    }

    static async createUser(data){
        const { username, password, usertype, fullname } = data;
        const user = await this.getUser(username).exec();
        if(user){
            throw 'username_exist';
        }
        const timenow = nowJson();
        return await this.collection.insert({
            username,
            usertype,
            fullname,
            password: md5(password),
            created_at: timenow,
            updated_at: timenow,
        })
    }

    static async editUser(data){
        const { username, password, usertype, fullname } = data;
        const user = await this.getUser(username).exec();
        if(!user) throw new Error('User not found!');
        const patch = {
            fullname,
            usertype,
            updated_at: nowJson(),
        };
        if(password) patch.password = md5(password);
        await user.update({
            $set: patch
        })
        return user;
    }

    static async changeUserPassword(username, passwords){
        const { current, new_password } = passwords;
        const user = await this.getUser(username).exec();
        if(!user) throw new Error('User not found.');
        const hashed = md5(current);
        const valid = hashed === user.password;
        if(!valid) return false;
        await user.update({
            $set: {
                password: md5(new_password)
            }
        });
        return true;
    }

    static async deleteUser(username){
        const user = await this.collection.findOne({
            selector: {
                username
            }
        }).exec();
        await user.remove();
    }

    static getUser(username){
        return this.collection.findOne({
            selector: {
                username
            }
        });
    }

    static async addClientToUser(user_id, client_id){
        const user = isRxDocument(user_id) ? user_id : this.getUser(user_id).exec();
        await user.update({
            $push: {
                clients: client_id
            }
        })
    }
    
    static async removeClientFromUser(user_id, client_id){
        const user = isRxDocument(user_id) ? user_id : this.getUser(user_id).exec();
        await user.atomicUpdate(data => {
            const index = data.clients.indexOf(client_id);
            data.clients.splice(index, 1);
            return data;
        });
    }

    static async checkPassword(username, password){
        const user = await this.getUser(username).exec();
        if(!user) throw new Error('User not found.');
        const hashed = md5(password);
        return hashed === user.password;
    }

}

window.UsersModel = UsersModel;