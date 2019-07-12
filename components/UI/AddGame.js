import React from 'react';
//import * as firebase from 'firebase';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
} from 'react-native';
import { structureGames } from '../../components/services/Service';
import AddGameItem from '../../components/UI/AddGameItem';



export default class AddGame extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        games: [],
        searching: false
    };
    confirmdeleteItens = () => {
        this.props.confirmdeleteItens();
    }
    _searchGame(search) {
        var _self = this;
        if (search == "") {
            _self.setState({ games: [] },
                () => {
                    _self.setState({ renderGames: _self.renderGames() },
                        () => {
                        }
                    );
                }
            );
        } else {
            if (this.state.searching)
                return false;
            _self.setState({ searching: true },
                () => {
                    var re = new RegExp(search.toLowerCase(), 'g');

                    firebase.database().ref('/Games/').on('value', function (snapshot) {
                        var obj = {};
                        for (var key in snapshot.val()) {
                            let item = snapshot.val()[key];
                            if ((item.name.toLowerCase().match(re) != null && search != "") || search == "") {
                                obj[key] = item;
                            }
                        }

                        structureGames(obj).then(games => {
                            _self.setState({ games: games, searching: false },
                                () => {
                                    _self.setState({ renderGames: _self.renderGames() },
                                        () => {
                                        }
                                    );
                                }
                            );
                            return true;
                        }).catch(err => console.log('There was an error:' + err));
                    });

                }
            );


        }
    }
    addGameSave = () => {

    }
    renderGames() {
        let list = this.state.games;
        let items = [];
        for (let i = 0; i < list.length; i++) {
            var game = this.props.list.games.filter(p => p.key == list[i].key)[0];
            var userconsoles = null;
            if (game != undefined) {
                userconsoles = game.userConsoles;
            }
            items.push(<AddGameItem key={i} game={list[i]} userConsoles={userconsoles} callback={this.addGameSave.bind(this)} id={this.props.list.key} />);
        }
        console.log("======================");
        return items;
    }
    render() {
        return (
            <View style={styles.menuList}>
                <View style={styles.scrollBox}>
                    <Text style={styles.menuTitle}>-ADICIONAR JOGO-</Text>
                    <TextInput
                        placeholder={"Nome"}
                        style={[styles.inputsearch, styles.inputText]}
                        onChangeText={(text) => this._searchGame(text)}
                        ref={input => { this.titleInput = input }}
                    />
                </View>

                <ScrollView keyboardShouldPersistTaps="always" style={styles.gamebox}>
                    {(this.state.games.length == 0) ? (
                        <Text style={styles.TextclearList}>Procure pelo nome o jogo que gostaria de adicionar</Text>
                    ) : (
                            <View>
                                {this.state.renderGames}
                            </View>
                        )
                    }

                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    menuList: {
        width: '100%',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollBox: {
        width: '100%',
        height: 150,
        paddingHorizontal: 15,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuTitle: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'SourceSansPro-Light',
        fontSize: 30,
        paddingHorizontal: 50,
        marginTop: 50,
    },
    inputsearch: {
        backgroundColor: '#444',
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        minHeight: 50,
        width: '100%'
    },
    inputText: {
        color: '#FFF',
        fontFamily: 'SourceSansPro-Regular',
        fontSize: 18,
    },
    gamebox: {
        padding: 0,
        width: '100%',
        paddingHorizontal: 15,
        height: Dimensions.get('window').height / 150
    },
    TextclearList: {
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold',
        fontSize: 18,
        textAlign: 'center',
        padding: 40,
    },
});