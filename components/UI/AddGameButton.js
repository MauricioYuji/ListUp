import React from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';
import * as firebase from 'firebase';
import TabBarIcon from '../UI/TabBarIcon';
import { updateData } from '../services/baseService';



export default class AddGameButton extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        process: 0,
        consolesActive: []
    };


    ActiveConsole(key) {
        var _self = this;
        var list = this.state.consolesActive;
        if (list.includes(key))
            list = this.arrayRemove(list, [key]);
        else
            list.push(key);


        _self.setState({ consolesActive: list },
            () => {
            }
        );

    }
    arrayRemove(arr, value) {
        return arr.filter(function (el) {
            return !value.includes(el);
        });
    }
    addToList() {
        var _self = this;


        if (_self.props.list == "games") {
            _self.setState({ process: 1 },
                () => {

                }
            );
        } else {
            _self.setState({ process: 1 },
                () => {
                }
            );
        }
    }
    SalvarItem = () => {
        var _self = this;

        var user = firebase.auth().currentUser;
        updateData('userGames/' + user.uid + '/' + this.props.game.key, this.state.consolesActive)
            .then((resp) => {
                _self.setState({ process: 3 });
                setTimeout(function () {
                    _self.setState({ process: 4 });
                    _self.props.callback(_self.props.list + " list add");
                }, 1000);
            });

    }
    closeBox() {
        this.setState({ process: 0 });
    }
    listPlatforms = () => {
        let obj = [];
        let objarray = this.props.game.consoles;
        let filteractive = this.state.consolesActive;


        for (let j = 0; j < objarray.length; j++) {
            var styleclass = null;
            var imgcolor = '';
            if (filteractive.includes(objarray[j].key)) {
                styleclass = styles.filterButtonActive;
                imgcolor = '#FFFFFF';
            } else {
                styleclass = styles.filterButton;
                imgcolor = '#BBBBBB';
            }
            obj.push(
                <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveConsole(objarray[j].key, false)} key={objarray[j].name} style={[styleclass]}>
                    <View>
                        <Image source={{ uri: objarray[j].img }} resizeMode={'contain'} style={[styles.filterButtonImg, { width: objarray[j].width / 5, height: objarray[j].height / 5, tintColor: imgcolor }]} />
                    </View>
                </TouchableHighlight>);
        }
        return obj;
    }
    render() {
        var process = this.state.process;
        if (process == 1) {
            return (
                <View style={styles.selectBox}>

                    <TouchableHighlight underlayColor="transparent" style={styles.closeBox} onPress={() => this.closeBox()}>
                        <TabBarIcon
                            name={'close'}
                            type={'MaterialIcons'}
                            style={styles.closeBoxIcon}
                        />
                    </TouchableHighlight>
                    <Text style={styles.addItemText}>Selecione os consoles</Text>

                    <View style={styles.menuContent} horizontal={true}>
                        {this.listPlatforms()}
                    </View>

                    <TouchableHighlight underlayColor="transparent" onPress={(a) => this.SalvarItem()}>
                        <View style={styles.addButton}>
                            <Text style={styles.addButtonText}>ADICIONAR</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            );
        } else if (process == 2) {
            return (
                <View style={styles.addItem}>
                    <Text style={styles.addItemText}>Adicionando a lista</Text>
                </View>
            );
        } else if (process == 3) {
            return (
                <View style={styles.addItem}>
                    <Text style={styles.addItemText}>Adicionado com sucesso</Text>
                </View>
            );
        } else if (process == 4) {
            return (
                <View style={styles.addItem}>
                    <Text style={styles.addItemText}>Remover dos meus jogos</Text>
                </View>
            );
        } else if (process == 0) {
            return (
                <TouchableHighlight underlayColor="transparent" style={styles.addItem} onPress={() => this.addToList()}>
                    <Text style={styles.addItemText}>{this.props.label}</Text>
                </TouchableHighlight>
            );
        }
    }
}
const styles = StyleSheet.create({
    addItem: {
        marginVertical: 10,
        alignItems: 'center',
    },
    addItemText: {
        color: '#FFF',
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: 24,
        paddingHorizontal: 50
    },
    selectBox: {
        backgroundColor: '#333',
        padding: 20,
        marginVertical: 15
    },
    menuContent: {
        width: Dimensions.get('window').width - 40,
        textAlign: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 15
    },
    addButton: {
        backgroundColor: '#006CD8',
        borderRadius: 4,
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        height: 50
    },
    addButtonText: {
        color: '#FFF',
        alignSelf: "center",
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: 24,
        marginVertical: 10,
        height: 50
    },
    filterButton: {
        backgroundColor: '#444444',
        borderRadius: 4,
        marginVertical: 5,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: 30
    },
    filterButtonImg: {
        marginHorizontal: 5
    },

    filterButtonActive: {
        backgroundColor: '#006CD8',
        borderRadius: 4,
        marginVertical: 5,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    closeBox: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    closeBoxIcon: {
        color: '#FFF',
        fontSize: 50
    },
});