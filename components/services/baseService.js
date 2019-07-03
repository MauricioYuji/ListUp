import * as firebase from 'firebase';
const base = "http://192.168.1.31:3000";
//const base = "http://179.99.252.181:3000";

export const put = (path, obj) => {
    let data = {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };
    return fetch(base + path, data)
        .then(response => response.json())  // promise
        .then(json => dispatch(receiveAppos(json)));
};
export const post = (path, obj) => {

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
            'Content-Type': 'application/json'
        }
    };
    return fetch(base + path, data)
        .then(response => response.json());

};

export const get = (path) => {
    let data = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    return fetch(base + path)
        .then(response => response.json())  // promise
        .then(json => dispatch(receiveAppos(json)));
};

export const del = (path, key) => {
    let data = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookie.load('csrftoken')
        }
    };
    return fetch(base + path + key)
        .then(response => response.json())  // promise
        .then(json => dispatch(receiveAppos(json)));
};

