import Controller from './controller';
import UsersModel from '../models/Users.model';
import md5 from 'md5';
import store from '../store';
import { sleep } from '../utils';

export default class SessionController extends Controller{

    static async signin(username, password){
        if(!username || !password) throw new Error('Missing or invalid arguments');
        if(!DEV) await sleep(1000);
        const user = await UsersModel.getUser(username).exec();
        if(user === null) return false;
        const hashed = md5(password);
        if(hashed === user.password){
            store.dispatch('setUser', user);
            return true;
        }else{
            return false;
        }
    }

    static logout(){
        // store.dispatch('setUser', null);
        window.location.reload();
    }

}