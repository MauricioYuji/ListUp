import React from 'react';
import { Text } from 'react-native';
import * as firebase from 'firebase';
import Layout from '../../constants/Layout';


//export const getUserInfo = (name) => {
//    console.log("name: ", name);
//    let username = name.toLowerCase().trim();
//    const URL = `https://api.github.com/users/${username}`;
//    return fetch(URL)
//        .then((res) => res.json());
//};
export const test = () => {
    return firebase.database().ref('/Companies').once('value').then(function (snapshot) {
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
//export const getUserInfo = (id) => {
//    return firebase.database().ref('/UserInfo').child(id).once('value').then(function (snapshot) {
//        //console.log("snapshot.val(): ", snapshot.val());
//        return snapshot.val();
//    });
//};
export const setData = (table, obj) => {
    console.log('table ', table);
    console.log('obj ', obj);
    return firebase.database().ref('/' + table).update(obj).then((data) => {
        //success callback
        return data;
    }).catch((error) => {
        //error callback
        console.log('error ', error);
    });
};
export const insertData = (table, obj) => {
    console.log('table ', table);
    console.log('obj ', obj);
    return firebase.database().ref('/' + table).push(obj).then((data) => {
        //success callback
        return data;
    }).catch((error) => {
        //error callback
        console.log('error ', error);
    });
};

export const getData = (table) => {
    //firebase.database().ref('/Games').on('value', function (snapshot) {
    //    console.log("LOADED");
    //    return snapshot.val();
    //});
    //console.log("table: ", table);
    return firebase.database().ref('/' + table).once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot);
        return snapshot.val();
    });

    //return firebase.database().ref('/' + table).once('value').then(function (snapshot) {
        
    //    return snapshot.val();
    //});
};

