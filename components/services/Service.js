import * as firebase from 'firebase';
import { getData, deleteData, setData, insertData } from './baseService';

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
                //console.log("objgames[key].file.url: ", objgames[key].file.url);
                //console.log("imgs[objgames[key].file.key].url: ", imgs[objgames[key].file.key].url);
                //console.log("objgames[key].file.file: ", objgames[key].file.file);
                //console.log("imgs[objgames[key].file.key].file: ", imgs[objgames[key].file.key].file);
                //console.log("objgames[key].file: ", objgames[key].file.key);
                if (objgames[key].image.key != "") {
                    objgames[key].image.url = imgs[objgames[key].image.key].url;
                    objgames[key].image.file = imgs[objgames[key].image.key].file;
                }
                //console.log("-----------------------------------------------");


            }
            resolve(objgames);
        });

        //getGame(keys).then((game) => {
        //    var imgkeys = [];
        //    for (var list in obj) {
        //        var games = [];
        //        for (var key in obj[list].games) {
        //            var item = game[key];
        //            if (!imgkeys.includes(item.img) && item.img != "") {
        //                imgkeys.push(item.img);
        //            }

        //            item.userConsoles = obj[list].games[key];
        //            games.push(item);
        //        }
        //        obj[list].key = list;
        //        obj[list].games = games;
        //    }
        //    getImages(imgkeys).then((imgs) => {
        //        for (var list in obj) {
        //            for (var key in obj[list].games) {
        //                obj[list].games[key].img = imgs[obj[list].games[key].img];
        //            }
        //        }
        //        resolve(obj);
        //    });
        //});

    });
};

export const structureList = async (obj) => {
    let objlist = require('../../files/consoles.json');
    return new Promise((resolve, reject) => {
        var keys = [];
        for (var list in obj) {
            for (let key in obj[list].games) {
                if (!keys.includes(key))
                    keys.push(key);
            }
        }
        getGame(keys).then((game) => {
            var imgkeys = [];
            for (var list in obj) {
                var games = [];
                for (var key in obj[list].games) {
                    var item = game[key];
                    if (!imgkeys.includes(item.image.key) && item.image.key != "") {
                        imgkeys.push(item.image.key);
                    }
                    var userconsoles = obj[list].games[key];
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
//export const RefLists = () => {
//    var user = firebase.auth().currentUser;
//    let lists = null;
//    var objgames = [];
//    return firebase.database().ref('/userLists/' + user.uid);
//};
//export function RefLists2() {
//    // Get the current 'global' time from an API using Promise
//    return new Promise((resolve, reject) => {
//        //setTimeout(function () {
//        //    resolve(new Date());
//        //    console.log("CHANGE");
//        //}, 2000);
//        var user = firebase.auth().currentUser;
//        let lists = null;
//        var objgames = [];
//        firebase.database().ref('/userLists/' + user.uid).on('value', function (snapshot) {
//            console.log("content LOAD");
//            //console.log("snapshot.val(): ", snapshot.val());
//            obj = Object.keys(snapshot.val()).map(item => {
//                var objitem = snapshot.val()[item];
//                return {
//                    title: objitem.title,
//                    games: objitem.games == undefined ? [] : objitem.games,
//                    limit: objitem.limit,
//                    type: objitem.type,
//                    key: item,
//                    description: objitem.description
//                };
//            });

//            //console.log("obj: ", obj);
//            resolve(obj);
//        });
//    });
//}

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
        //console.log("snapshot: ", snapshot.val());
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

export const deleteGamesFromList = async (keys, keylist) => {

    var user = firebase.auth().currentUser;


    let lists = null;
    var objgames = [];
    await firebase.database().ref('/userLists/' + user.uid + '/' + keylist + '/games/').once('value').then(function (snapshot) {
        //console.log("snapshot: ", snapshot.val());
        lists = snapshot.val();
        for (var i = 0; i < keys.length; i++) {
            lists[keys[i]] = null;
        }
        setData('/userLists/' + user.uid + '/' + keylist + '/games/', lists)
            .then((img) => {
            });
    });

};

export const addGamestoList = async (keylist, keygame, obj) => {
    var user = firebase.auth().currentUser;
    let list = null;
    console.log("keylist: ", keylist);
    console.log("keygame: ", keygame);
    console.log("obj: ", obj);
    getData('/userLists/' + user.uid + '/' + keylist + '/games/' + keygame).then((res) => {
        if (obj.length > 0) {
            console.log("EDIT");
            setData('/userLists/' + user.uid + '/' + keylist + '/games/' + keygame, obj).then((res) => {
            });
        } else {
            console.log("INSERT");
            obj = {};
            obj[keygame] = "";
            setData('/userLists/' + user.uid + '/' + keylist + '/games/', obj).then((res) => {
            });
        }
    });
};
