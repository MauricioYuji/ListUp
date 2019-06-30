
import { Constants, Facebook } from 'expo';
import { post, get } from '../services/baseService';


export function signIn(email: string, password: string) {

    var user = {
        password: password,
        username: email
    };
    return post("/login/", user);

} 