import React from 'react';
import { Text } from 'react-native';
import * as firebase from 'firebase';
import Layout from '../../constants/Layout';
import { getData } from './Service';


export const getUserGames = async (uid) => {
    //console.log("ASYNC CONST");

    let usergames = null;
    let games = null;
    let companies = null;
    let consoles = null;

    //usergames = await getData('userGames/' + uid)
    //    .then((res) => {
    //        console.log("GET userGames");
    //        return dispatch(res);
    //    });

    //await getData('Companies')
    //    .then((res) => {
    //        console.log("GET Companies");
    //        companies = res;
    //    });

    //await getData('Games')
    //    .then((res) => {
    //        console.log("GET Games");
    //        games = res;
    //    });
    //console.log("LOAD CONTENT");
    //return usergames;





    await firebase.database().ref('/userGames/' + uid).once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot);
        usergames = snapshot.val();
    });
    await firebase.database().ref('/Companies').once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot);
        companies = snapshot.val();
    });
    await firebase.database().ref('/Consoles').once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot);
        consoles = snapshot.val();
    });
    await firebase.database().ref('/Games').once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot);
        games = snapshot.val();
    });

    //console.log("usergames:", usergames);
    //console.log("companies:", companies);
    //console.log("consoles:", consoles);
    //console.log("games:", games);

    var objgames = [];


    for (var key in usergames) {
        let obj = games[usergames[key].key];
        //console.log(usergames[key].key);
        //console.log(obj);
        obj.companies = [];
        for (var j = 0; j < obj.keyconsole.length; j++) {
            var company = companies[consoles[obj.keyconsole[j]].keycompany];
            //console.log("consoles[obj.keyconsole[j]]: ", consoles[obj.keyconsole[j]]);
            //console.log("company: ", company);
            company.key = consoles[obj.keyconsole[j]].keycompany;
            if (!obj.companies.includes(company))
                obj.companies.push(company);

        }
        //obj.companyimg = companies[consoles[obj.keyconsole].keycompany].img;
        //console.log("--------------------");
        objgames.push(obj);
    }
    //console.log("================");

    //for (var i = 0; i < usergames.length; i++) {
    //    let obj = games[usergames[i]];
    //    obj.companies = [];
    //    //for (var j = 0; j < obj.keyconsole.length; j++) {
    //    //    var company = companies[consoles[obj.keyconsole[j]].keycompany];
    //    //    company.key = consoles[obj.keyconsole[j]].keycompany;
    //    //    if (!obj.companies.includes(company))
    //    //        obj.companies.push(company);

    //    //}
    //    //obj.companyimg = companies[consoles[obj.keyconsole].keycompany].img;
    //    //console.log("key: ", usergames[i]);
    //    console.log("================");
    //    objgames.push(obj);
    //}
    //console.log("objgames: ", objgames);
    //console.log("GET PRIMEIRO");
    //await test('userGames').then((res) => {
    //    usergames = a;
    //});
    //console.log("WAIT FOR NEXT: ", usergames);
    //await test('Companies').then((res) => {
    //    companies = a;
    //});
    //console.log("RETURN RESULT: ", companies);
    //console.log("usergames: ", usergames);
    //objgames = ((objgames.length == 0) ? null : objgames);
    //console.log("objgames: ", objgames);
    return objgames;
};

export const test = async (table) => {
    return await firebase.database().ref('/' + table).once('value').then(async function (snapshot) {
        console.log("snapshot: ", snapshot.val());
        return await snapshot.val();
    });
}

