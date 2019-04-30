import * as firebase from 'firebase';
import { getData, setData, deleteData, insertData } from './baseService';

export const getGames = async (page) => {
    let games = null;
    var objgames = [];
    let list = require('../../files/consoles.json');

    await firebase.database().ref('/Games').once('value').then(function (snapshot) {
        games = snapshot.val();
    });

    for (var key in games) {
        var genres = [];
        var consoles = [];
        var companies = [];
        var item = games[key];
        var file = { key: games[key].img, url: "", file: null };
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

export const structureGames = async (games) => {

    var objgames = [];
    let list = require('../../files/consoles.json');

    return new Promise((resolve, reject) => {
        for (let key in games) {
            var genres = [];
            var consoles = [];
            var companies = [];
            var item = games[key];
            var file = { key: games[key].img, url: "", file: null };
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
                image: file,
                genres: genres,
                consoles: consoles,
                companies: companies,
            };
            objgames.push(obj);
        }

        var imgkeys = [];
        for (let key in games) {
            if (!imgkeys.includes(games[key].img) && games[key].img != "")
                imgkeys.push(games[key].img);
        }
        getImages(imgkeys).then((imgs) => {
            for (let key in objgames) {
                if (objgames[key].image.key != "") {
                    objgames[key].image.url = imgs[objgames[key].image.key].url;
                    objgames[key].image.file = imgs[objgames[key].image.key].file;
                }


            }
            resolve(objgames);
        });


    });
};

export const structureList = async (obj) => {
    let objlist = require('../../files/consoles.json');
    return new Promise((resolve, reject) => {
        var keys = [];
        for (var list in obj) {
            for (let key in obj[list].games) {
                var objkey = Object.keys(obj[list].games[key])[0];
                if (!keys.includes(objkey))
                    keys.push(objkey);
            }
        }
        getGame(keys).then((game) => {
            var imgkeys = [];
            for (var list in obj) {
                var games = [];
                for (var index in obj[list].games) {
                    let key = Object.keys(obj[list].games[index])[0];
                    var item = game[key];
                    if (!imgkeys.includes(item.image.key) && item.image.key != "") {
                        imgkeys.push(item.image.key);
                    }
                    var userconsoles = obj[list].games[index][key];
                    for (var i = 0; i < userconsoles.length; i++) {
                        userconsoles[i] = objlist.Consoles[userconsoles[i]];
                    }
                    item.userConsoles = userconsoles;
                    games.push(item);
                }
                obj[list].key = list;
                obj[list].games = games;
            }
            getImages(imgkeys).then((imgs) => {
                for (var list in obj) {
                    for (var key in obj[list].games) {
                        obj[list].games[key].image = imgs[obj[list].games[key].image.key];
                    }
                }
                resolve(obj);
            });
        });

    });
};

getGame = async (keys) => {

    let list = require('../../files/consoles.json');

    return new Promise((resolve, reject) => {
        var promises = keys.map(function (key) {
            return firebase.database().ref("/Games/").child(key).once("value");
        });
        Promise.all(promises).then(function (snapshots) {
            var obj = {};
            snapshots.forEach(function (snapshot) {
                var genres = [];
                var consoles = [];
                var companies = [];
                var item = snapshot.val();
                var file = { key: item.img, url: "", file: null };
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
                var game = {
                    key: snapshot.key,
                    name: item.name,
                    image: file,
                    genres: genres,
                    consoles: consoles,
                    companies: companies
                };

                obj[snapshot.key] = game;

            });



            resolve(obj);
        });
    });

};
getImages = async (keys) => {
    return new Promise((resolve, reject) => {
        var promises = keys.map(function (key) {
            return firebase.database().ref("/thumbs/").child(key).once("value");
        });
        Promise.all(promises).then(function (snapshots) {
            var obj = {};
            snapshots.forEach(function (snapshot) {
                obj[snapshot.key] = snapshot.val();

            });
            resolve(obj);
        });
    });
};

export const getuserList = async (page) => {
    var user = firebase.auth().currentUser;
    let lists = null;
    var objgames = [];
    await firebase.database().ref('/userLists/' + user.uid).once('value').then(function (snapshot) {
        lists = snapshot.val();
    });


    for (var key in lists) {



        var item = lists[key];


        let consoles = [];
        for (var games in item.games) {
            var objgame = {
                key: games,
                consoles: item.games[games]
            };
            consoles.push(objgame);
        }
        var obj = {
            key: key,
            title: item.title,
            limit: item.limit,
            type: item.type,
            games: consoles,
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
        list = snapshot.val();
    });

    let consoles = [];
    for (var games in list.games) {
        var objgame = {
            key: games,
            consoles: list.games[games]
        };
        consoles.push(objgame);
    }
    var obj = {
        key: key,
        title: list.title,
        limit: list.limit,
        type: list.type,
        games: consoles,
        description: list.description
    };
    return obj;
};


export const deleteItemsFromList = async (keys) => {

    var user = firebase.auth().currentUser;


    let lists = null;
    var objgames = [];
    await firebase.database().ref('/userLists/' + user.uid).once('value').then(function (snapshot) {
        lists = snapshot.val();
        for (var i = 0; i < keys.length; i++) {
            lists[keys[i]] = null;
        }
        setData('/userLists/' + user.uid + '/', lists)
            .then((img) => {
            });
    });

};

export const deleteGamesFromList = async (keys, keylist) => {

    var user = firebase.auth().currentUser;


    let lists = null;
    var objgames = [];
    await firebase.database().ref('/userLists/' + user.uid + '/' + keylist + '/games/').once('value').then(function (snapshot) {
        lists = snapshot.val();
        for (var i = 0; i < keys.length; i++) {

            var r = lists.filter(p => Object.keys(p) == keys[i]);
            var index = lists.indexOf(r[0]);

            lists[index] = null;


        }
        setData('/userLists/' + user.uid + '/' + keylist + '/games/', lists)
            .then((img) => {
            });
    });

};

export const addGamestoList = async (keylist, keygame, obj) => {
    var user = firebase.auth().currentUser;
    let list = null;

    var itemobj = {};
    itemobj[keygame] = obj.length <= 0 ? "" : obj;
    getData('/userLists/' + user.uid + '/' + keylist + '/games/').then((res) => {
        res = (res == null) ? [] : res;
        var r = res.filter(p => Object.keys(p) == keygame);
        var index = res.indexOf(r[0]);
        if (res.length == 0 || index == -1) {
            res.push(itemobj);
        } else {
            res[index] = itemobj;
        }
        setData('/userLists/' + user.uid + '/' + keylist + '/games/', res).then((res) => {
        });
    });
};
