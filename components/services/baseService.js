
import * as firebase from 'firebase';



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

export const deleteData = (table, key) => {
    return firebase.database().ref('/' + table).child(key).remove().then(function (snapshot) {
        return snapshot.val();
    });
};

