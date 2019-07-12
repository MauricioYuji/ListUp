
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
    //console.log("POST LOGIN");
    return post("/login/", user);

}
export async function logOut() {

    deleteUser().then(p => {
        return p;
    });


}
_getData = async () => {
    console.log("GET STORAGE");
    try {
        await AsyncStorage.getItem("user").then((value) => {
            consolelog("value: ", value);
            return value;
        }).then(res => {
            //do something else
            consolelog("res: ", res);
            return res;
        });
    } catch (error) {
        // Error saving data
    }
};

export async function getUser() {
    try {
        return AsyncStorage.getItem("user").then(p => {

            var user = JSON.parse(JSON.parse(p));
            
            if (user != null) {
                return get("/user/" + user.id, user.token).then(p => {
                    return p;
                });
            } else {
                return null;
            }

        });
        //AsyncStorage.getItem("user").then(user => {
        //    consolelog("user: ", user);
        //    return null;
        //});
        //return AsyncStorage.getItem('user').then(p => {
        //    consolelog("p: ", p);
        //    var user = JSON.parse(p);
        //    consolelog("user: ", user);
        //    return get("/user/", user.id);
        //});
    } catch (error) {
        // Error saving data
    }
}
export async function storeUser(user) {
    try {
        console.log("try store");
        AsyncStorage.setItem('user', JSON.stringify(user));
        return AsyncStorage.getItem('user');
    } catch (error) {
        // Error saving data
    }
}
export async function deleteUser() {
    try {
        AsyncStorage.removeItem('user');
        return null;
    } catch (error) {
        // Error saving data
    }
}