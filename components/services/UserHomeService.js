import React from 'react';
import { Text } from 'react-native';
import * as firebase from 'firebase';
import Layout from '../../constants/Layout';
import { getData } from './Service';

export const getGames = async (page) => {
    let games = null;
    var objgames = [];
    let list = require('../../files/consoles.json');
    await firebase.database().ref('/Games').once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot.val());
        games = snapshot.val();
    });

    for (var key in games) {
        var genres = [];
        var consoles = [];
        var companies = [];
        var item = games[key];
        //console.log("item: ", item);
        var file = { key: games[key].img, url: "", file: null};
        //if (games[key].img != "") {
        //    var file = firebase.database().ref('thumbs/' + games[key].img).once('value').then(function (snapshot) {
        //        return snapshot.val();
        //    });
        //} else {
        //    file = null;
        //}
        //console.log("item.keyconsole: ", item.keyconsole);
        for (var j = 0; j < item.keyconsole.length; j++) {
            var c = list.Companies[list.Consoles[item.keyconsole[j]].keycompany];
            consoles.push(list.Consoles[item.keyconsole[j]]);
            c.key = list.Consoles[item.keyconsole[j]].keycompany;
            if (!companies.includes(c))
                companies.push(c);

        }

        for (var j = 0; j < item.keygenre.length; j++) {
            genres.push(list.Genres[item.keygenre[j]]);

        }
        var obj = {
            key: key,
            name: item.name,
            file: file,
            genres: genres,
            consoles: consoles,
            companies: companies,
        };
        objgames.push(obj);
    };
    return objgames;
};


export const getGameDetail = async (key) => {
    let game = null;
    let list = require('../../files/consoles.json');
    await firebase.database().ref('/Games/' + key).once('value').then(function (snapshot) {
        game = snapshot.val();
    });
    var genres = [];
    var consoles = [];
    var companies = [];
    var file = await firebase.database().ref('thumbs/' + game.img).once('value').then(function (snapshot) {
        return snapshot.val();
    });
    for (var j = 0; j < game.keyconsole.length; j++) {
        var c = list.Companies[list.Consoles[game.keyconsole[j]].keycompany];
        consoles.push(list.Consoles[game.keyconsole[j]]);
        c.key = list.Consoles[game.keyconsole[j]].keycompany;
        if (!companies.includes(c))
            companies.push(c);

    }

    for (var j = 0; j < game.keygenre.length; j++) {
        genres.push(list.Genres[game.keygenre[j]]);

    }
    var obj = {
        key: key,
        name: game.name,
        file: file,
        description: game.description,
        genres: genres,
        consoles: consoles,
        companies: companies,
    };

    return obj;
};

export const getUserGames = async (uid) => {
    //console.log("ASYNC CONST");

    let usergames = null;
    let games = null;
    let companies = null;
    let consoles = null;
    let list = require('../../files/consoles.json');
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
    //await firebase.database().ref('/Companies').once('value').then(function (snapshot) {
    //    //console.log("snapshot: ", snapshot);
    //    companies = snapshot.val();
    //});
    //await firebase.database().ref('/Consoles').once('value').then(function (snapshot) {
    //    //console.log("snapshot: ", snapshot);
    //    consoles = snapshot.val();
    //});
    await firebase.database().ref('/Games').once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot);
        games = snapshot.val();
    });

    //console.log("usergames:", usergames);
    //console.log("companies:", companies);
    //console.log("consoles:", consoles);
    //console.log("games:", games);

    var objgames = [];

    //console.log("list: ", list);
    for (var key in usergames) {
        let obj = games[usergames[key].key];
        //console.log(usergames[key].key);
        //console.log(obj);
        obj.companies = [];
        obj.consoles = [];
        for (var j = 0; j < obj.keyconsole.length; j++) {
            var company = list.Companies[list.Consoles[obj.keyconsole[j]].keycompany];

            obj.consoles.push(list.Consoles[obj.keyconsole[j]]);
            //console.log("consoles[obj.keyconsole[j]]: ", consoles[obj.keyconsole[j]]);
            //console.log("company: ", company);
            company.key = list.Consoles[obj.keyconsole[j]].keycompany;
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

