import React from 'react';
import { Text } from 'react-native';
import * as firebase from 'firebase';


//export const getUserInfo = (name) => {
//    console.log("name: ", name);
//    let username = name.toLowerCase().trim();
//    const URL = `https://api.github.com/users/${username}`;
//    return fetch(URL)
//        .then((res) => res.json());
//};
export const test = () => {
    return firebase.database().ref('/Games').once('value').then(function (snapshot) {
        return snapshot.val();
    });
    //firebase.database().ref('/Games').on('value', function (snapshot) {
    //    console.log("LOADED");
    //    return snapshot.val();
    //});
};

//export const Service {
//    static test() {
//         return firebase.database().ref('/Games').on('value', function (snapshot) {
//            //console.log(snapshot.val());
//            //_self.setState({
//            //    isLoading: false,
//            //    dataSource: snapshot.val(),
//            //}, function () {

//            //});
//             console.log("LOADED");
//             return snapshot.val();
//        });
//    }
//}