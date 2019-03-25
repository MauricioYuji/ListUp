import React from 'react';
import { Text } from 'react-native';
import * as firebase from 'firebase';
import Layout from '../../constants/Layout';



export const setData = (table, obj) => {
    return firebase.database().ref('/' + table).update(obj).then((data) => {
        return data;
    }).catch((error) => {
        console.log('error ', error);
    });
};
export const insertData = (table, obj) => {
    return firebase.database().ref('/' + table).push(obj).then((data) => {
        return data;
    }).catch((error) => {
        console.log('error ', error);
    });
};

export const getData = (table) => {
    return firebase.database().ref('/' + table).once('value').then(function (snapshot) {
        return snapshot.val();
    });
};

