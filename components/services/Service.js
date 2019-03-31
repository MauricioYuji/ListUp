import * as firebase from 'firebase';
import { getData, deleteData, setData } from './baseService';

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
        var file = { key: games[key].img, url: "", file: null };
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

export const getuserList = async (page) => {
    var user = firebase.auth().currentUser;
    let lists = null;
    var objgames = [];
    await firebase.database().ref('/userLists/' + user.uid).once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot.val());
        lists = snapshot.val();
    });

    for (var key in lists) {

        var item = lists[key];
        var obj = {
            key: key,
            title: item.title,
            games: item.games == undefined ? [] : item.games,
            description: item.description
        };
        objgames.push(obj);
    }
    return objgames;
};

export const getListByKey = async (key) => {
    var user = firebase.auth().currentUser;
    let list = null;
    await firebase.database().ref('/userLists/' + user.uid + '/' + key).once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot.val());
        list = snapshot.val();
    });

    return list;
};

export const deleteItemsFromList = async (keys) => {

    var user = firebase.auth().currentUser;


    let lists = null;
    var objgames = [];
    await firebase.database().ref('/userLists/' + user.uid).once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot.val());
        lists = snapshot.val();
        for (var i = 0; i < keys.length; i++) {
            lists[keys[i]] = null;
        }
        setData('/userLists/' + user.uid + '/', lists)
            .then((img) => {
            });
    });

};