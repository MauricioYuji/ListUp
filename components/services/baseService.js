//import * as firebase from 'firebase';
const base = "http://192.168.15.12:3000";
//const base = "http://191.8.8.200:3000";


export const put = (path, obj, token) => {
    let data = {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    return fetch(base + path, data)
        .then(response => response.json())  // promise
        .then(json => dispatch(receiveAppos(json)));
};
export const post = (path, obj, token) => {

    //return fetch(base + path, {
    //    method: 'POST',
    //    headers: {
    //        Accept: 'application/json',
    //        'Content-Type': 'application/json',
    //    },
    //    body: JSON.stringify(obj),
    //});

    let data = {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    return fetch(base + path, data)
        .then(response => response.json());

};

export const get = (path, token) => {
    let data = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    return fetch(base + path, data)
        .then(response => response.json());
};

export const del = (path, key, token) => {
    let data = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'X-CSRFToken': cookie.load('csrftoken')
        }
    };
    return fetch(base + path + key)
        .then(response => response.json())  // promise
        .then(json => dispatch(receiveAppos(json)));
};

