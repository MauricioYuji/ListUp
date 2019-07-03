
import {
    AsyncStorage
} from 'react-native';
import { Constants, Facebook } from 'expo';
import { post, get } from '../services/baseService';


export function signIn(email: string, password: string) {

    var user = {
        password: password,
        username: email
    };
    return post("/login/", user);

}
export async function logOut() {

    deleteUser().then(p => {
        return p;
    });


}


export async function getUser() {
    try {
        return AsyncStorage.getItem('user');
    } catch (error) {
        // Error saving data
    }
}
export async function storeUser(user) {
    try {
        AsyncStorage.setItem('user', JSON.stringify(user));
        return AsyncStorage.getItem('user');
    } catch (error) {
        // Error saving data
    }
}
export async function deleteUser() {
    try {
        AsyncStorage.removeItem('user');
        return AsyncStorage.getItem('user');
    } catch (error) {
        // Error saving data
    }
}