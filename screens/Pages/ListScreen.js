import React from 'react';
import * as firebase from 'firebase';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    TouchableHighlight,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    DeviceEventEmitter,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    Picker
} from 'react-native';
import { WebBrowser, Icon, Constants, LinearGradient } from 'expo';

import NavigationService from '../../components/services/NavigationService';
import Layout from '../../constants/Layout';
import { getData, setData, insertData } from '../../components/services/baseService';
import { getListByKey, getGames, deleteGamesFromList, structureList, structureGames } from '../../components/services/Service';
import GameItem from '../../components/UI/GameItem';
import AddGameItem from '../../components/UI/AddGameItem';
import ListItem from '../../components/UI/ListItem';
import TabBarIcon from '../../components/UI/TabBarIcon';
import { GetImage } from '../../components/UI/GetImage';
import Header from '../../screens/Shared/Header';
import LoadingScreen from '../Loading/LoadingScreen';

const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;
var process = false;



export default class ListScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            listend: false,
            games: [],
            page: 0,
            confirmDelete: false,
            list: {
                title: "",
                games: [],
                key: "",
                description: "",
                type: "",
                limit: ""
            },
            multiSelect: false,
            selectedItens: [],
            modalVisible: false,
            modalVisibleEdit: false,
            mounted: false,
            inputTitle: "",
            inputSelect: "",
            inputText: "",
            inputLimit: "",
            modelInvalid: false,
            key: ""
        };
    }
    componentDidMount() {
        var _self = this;

        DeviceEventEmitter.emit('reloading', true);


        const { navigation } = this.props;
        const key = navigation.getParam('key', 'NO-ID');

        this.loadData(key);

    }
    componentWillUnmount() {
        this.setState({ mounted: false });
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    setModalVisibleEdit(visible) {
        this.setState({ modalVisibleEdit: visible });
    }
    loadData = (key) => {
        var _self = this;
        var user = firebase.auth().currentUser;

        if (key == "") {
            key = this.state.key;
        }
        firebase.database().ref('/userLists/' + user.uid + '/' + key).on('value', function (snapshot) {
            var obj = {};
            var list = null;
            obj[snapshot.key] = snapshot.val();
            structureList(obj).then(r => {
                for (var item in r) {
                    list = r[item];
                }
                _self.setState({ page: 0, list: list, listend: false, loading: false, mounted: true, key: key },
                    () => {
                        DeviceEventEmitter.emit('reloading', false);
                    }
                );
                return true;
            }).catch(err => console.log('There was an error:' + err));
        });
    }
    itemAction = () => {

    }
    selectItem = (id) => {
        console.log("id: ", id);
        var arrayobj = this.state.selectedItens;
        if (!arrayobj.includes(id)) {
            arrayobj.push(id);
        }
        this.setState({ selectedItens: arrayobj },
            () => {
                DeviceEventEmitter.emit('selectMode', true);
            }
        );
    }
    confirmdeleteItens = () => {
        var _self = this;

        var list = this.state.list;
        DeviceEventEmitter.emit('reloading', true);
        deleteGamesFromList(this.state.selectedItens, list.key).then(() => {
            _self.setState({ selectedItens: [], confirmDelete: false },
                () => {
                    DeviceEventEmitter.emit('confirmDelete', true);
                    DeviceEventEmitter.emit('selectMode', false);
                }
            );
        });
    }
    deleteItens = () => {
        var _self = this;
        _self.setState({ confirmDelete: true },
            () => {
            }
        );
    }
    addItens = () => {
        console.log("ADD");
        this.setModalVisible(!this.state.modalVisible);
    }
    editItens = () => {
        console.log("EDIT");
        this.setModalVisibleEdit(!this.state.modalVisibleEdit);

    }
    editList = () => {
        console.log("SEND EDIT");
        var list = this.state.list;
        if (this.state.list.title == "" || this.state.list.type == "" || this.state.list.text == "" || this.state.list.limit == "") {
            this.setState({ modelInvalid: true });
        } else {
            this.setState({ modelInvalid: false });
            var _self = this;


            var obj = {
                title: list.title,
                description: list.description,
                type: list.type,
                limit: list.limit
            };

            console.log("EDIT LIST");
            //console.log("obj: ", obj);
            var user = firebase.auth().currentUser;
            setData('userLists/' + user.uid + '/' + list.key, obj)
                .then((resp) => {
                    _self.setModalVisibleEdit(false);
                    _self.loadData("");
                    console.log("resp: ", resp);
                    console.log("=============================");
                });
        }
    }
    addGame = () => {
        console.log("ADD GAME");
    }
    closeModal = () => {
        this.setState({ games: [], modalVisible: false, modalVisibleEdit: false });
    }
    closeConfirm = () => {
        this.setState({ confirmDelete: false });
    }
    _setTitle(value) {
        var obj = this.state.list;
        obj.title = value;
        this.setState({ list: obj });
    }
    _setLimit(value) {
        var obj = this.state.list;
        obj.limit = value;
        this.setState({ list: obj });
    }
    _setSelect(value) {
        var obj = this.state.list;
        obj.type = value;
        this.setState({ list: obj });
    }
    _setText(value) {
        var obj = this.state.list;
        obj.description = value;
        this.setState({ list: obj });
    }

    _searchGame(search) {
        //console.log("Search: ", search);
        var _self = this;
        if (search == "") {
            _self.setState({ games: [] },
                () => {
                    //_self.filterObj();
                }
            );
        } else {
            if (this.state.searching)
                return false;

            setTimeout(function () {

            }, 2000);
            _self.setState({ searching: true },
                () => {
                }
            );
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
                        }
                    );
                    return true;
                }).catch(err => console.log('There was an error:' + err));
            });
            

        }
    }
    //renderLists() {
    //    let lists = this.state.list.games;
    //    let items = [];
    //    for (let i = 0; i < lists.length; i++) {
    //        //items.push(<ListItem key={i} label={"GAME"} games={lists[i].games} callback={this.selectItem.bind(this)} id={lists[i].key} />);
    //    }
    //    return items;

    //}


    //getImages = async (obj) => {
    //    for (let i = 0; i < obj.length; i++) {
    //        await getData('thumbs/' + obj[i].image.key)
    //            .then((img) => {
    //                obj[i].image.file = img.file;
    //                obj[i].image.url = img.url;
    //            });
    //    }

    //    this.setState({ games: this.state.games });
    //}
    renderGames() {
        let list = this.state.games;
        let items = [];
        for (let i = 0; i < list.length; i++) {
            var game = this.state.list.games.filter(p => p.key == list[i].key)[0];
            var userconsoles = null;
            if (game != undefined) {
                userconsoles = game.userConsoles;
            }
            items.push(<AddGameItem key={i} game={list[i]} userConsoles={userconsoles} callback={this.addGame.bind(this)} id={this.state.list.key} />);
        }
        return items;
    }
    renderGamesList() {
        let list = this.state.list.games;
        let items = [];
        for (let i = 0; i < list.length; i++) {
            items.push(<GameItem key={i} obj={list[i]} callback={this.selectItem.bind(this)} />);
        }
        return items;
    }
    render() {
        let pickerState = null;
        if (this.state.list.type == "") {
            pickerState = styles.unselected;
        }
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollArea}>
                    <View style={styles.titleBox}>
                        <Text style={styles.labelTitle}>{this.state.list.title}</Text>
                        <Text style={styles.labelDetail}>{this.state.list.games.length} jogos - Lista {this.state.list.type}</Text>
                        <Text style={styles.labelDescription}>{this.state.list.description}</Text>
                    </View>

                    {this.renderGamesList()}
                </ScrollView>

                <Header style={styles.header} type={"info-list"} back={true} callbackDelete={this.deleteItens.bind(this)} callbackAdd={this.addItens.bind(this)} callbackEdit={this.editItens.bind(this)} label={"Lista"} detail={""} />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.mounted && this.state.confirmDelete}
                    onRequestClose={() => {
                        this.setState({ confirmDelete: false });
                    }}>

                    <View style={styles.backgroundModal}>
                        <Text style={styles.addItemText}>DESEJA EXCLUIR?</Text>
                        <View style={styles.buttonBox}>
                            <TouchableHighlight underlayColor="transparent" onPress={() => this.confirmdeleteItens()}>
                                <View style={[styles.addItem, styles.dangerButton]}>
                                    <Text style={[styles.addItemText]}>Deletar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="transparent" onPress={() => this.closeConfirm()}>
                                <View style={styles.addItem}>
                                    <Text style={styles.addItemText}>Cancelar</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <TouchableHighlight underlayColor="transparent" style={styles.closeBox} onPress={() => this.closeConfirm()}>
                            <TabBarIcon
                                name={'close'}
                                type={'MaterialIcons'}
                                style={styles.closeBoxIcon}
                            />
                        </TouchableHighlight>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.mounted && this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}>
                    <View style={styles.backgroundModal}>
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
                                            {this.renderGames()}
                                        </View>
                                    )
                                }

                            </ScrollView>
                        </View>
                        <TouchableHighlight underlayColor="transparent" style={styles.closeBox} onPress={() => this.closeModal()}>
                            <TabBarIcon
                                name={'close'}
                                type={'MaterialIcons'}
                                style={styles.closeBoxIcon}
                            />
                        </TouchableHighlight>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.mounted && this.state.modalVisibleEdit}
                    onRequestClose={() => {
                        this.setState({ modalVisibleEdit: false });
                    }}>
                    <View style={styles.backgroundModal}>

                        <View style={styles.listBox}>
                            <Text style={styles.menuTitle}>-CRIAR LISTA-</Text>
                            {this.state.modelInvalid &&
                                <Text style={styles.erroText}>Preencha todos os campos.</Text>
                            }
                            <TextInput
                                placeholder={"Nome"}
                                value={this.state.list.title}
                                style={[styles.inputsearch, styles.inputText]}
                                onChangeText={(text) => this._setTitle(text)}
                                ref={input => { this.titleInput = input }}
                            />
                            <View style={styles.inputSelect}>
                                <Picker
                                    selectedValue={this.state.list.type}
                                    style={[styles.pickerStyle, pickerState]}
                                    itemStyle={[styles.itempickerStyle]}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this._setSelect(itemValue)
                                    }>
                                    <Picker.Item label="Selecione um tipo" value="" />
                                    <Picker.Item label="Lista Padrão" value="padrao" />
                                    <Picker.Item label="Ranking" value="ranking" />
                                </Picker>
                            </View>
                            <TextInput
                                placeholder={"Limite de jogos"}
                                keyboardType='numeric'
                                maxLength={10}
                                value={this.state.list.limit}
                                style={[styles.inputsearch, styles.inputText]}
                                onChangeText={(text) => this._setLimit(text)}
                                ref={input => { this.limitInput = input }}
                            />
                            <TextInput
                                placeholder={"Descrição"}
                                multiline={true}
                                numberOfLines={4}
                                value={this.state.list.description.toString()}
                                style={[styles.inputsearch, styles.inputMulti, styles.inputText]}
                                onChangeText={(text) => this._setText(text)}
                                ref={input => { this.textInput = input }} />
                            <View style={styles.buttonBox}>
                                <TouchableHighlight style={styles.addItem} underlayColor="transparent" onPress={() => this.editList()}>
                                    <Text style={styles.addItemText}>Criar Lista</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <TouchableHighlight underlayColor="transparent" style={styles.closeBox} onPress={() => this.closeModal()}>
                            <TabBarIcon
                                name={'close'}
                                type={'MaterialIcons'}
                                style={styles.closeBoxIcon}
                            />
                        </TouchableHighlight>
                    </View>
                </Modal>
            </View>
        );
    }
}
const styles = {
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 60
    },
    erroText: {
        color: "#F00",
        fontSize: 24,
        fontFamily: 'SourceSansPro-SemiBold'
    },
    backgroundModal: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    menuList: {
        width: '100%',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingBackground: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    listItem: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222222"
    },
    itemInfo: {
        flex: 1,
        paddingHorizontal: 20,
    },
    titleBox: {
        flex: 1,
        padding: 15,
        marginBottom: 15,
        backgroundColor: "#333",
        borderTopColor: "#006CD8",
        borderTopWidth: 4
    },
    labelTitle: {
        fontSize: 24,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    labelDetail: {
        fontSize: 14,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    labelDescription: {
        fontSize: 16,
        marginTop: 10,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Regular'
    },
    thumbArea: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        flex: 1
    },
    thumb: {
        width: 60,
        height: 90,
        marginLeft: 2
    },
    backgroundOverlayModal: {
        height: Dimensions.get('window').height / 3,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
    },
    scrollBox: {
        width: '100%',
        height: 150,
        paddingHorizontal: 15,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
        //paddingBottom: 100
    },
    listBox: {
        paddingTop: 50,
        width: '100%',
        padding: 15,
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        //paddingBottom: 100
    },
    menuTitle: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'SourceSansPro-Light',
        fontSize: 30,
        paddingHorizontal: 50,
        marginTop: 50,
    },
    closeBox: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeBoxIcon: {
        color: '#FFF',
        fontSize: 50
    },
    buttonBox: {
        flexDirection: 'row'
    },
    addItem: {
        flex: 1,
        backgroundColor: '#006CD8',
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        minHeight: 50,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    addItemText: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    dangerButton: {
        backgroundColor: '#F00'
    },
    inputSelect: {
        backgroundColor: '#444',
        margin: 10,
        padding: 0,
        borderRadius: 10,
        minHeight: 50,
        width: '100%'
    },
    gamebox: {
        padding: 0,
        width: '100%',
        paddingHorizontal: 15,
        height: Dimensions.get('window').height / 150
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
    inputMulti: {
        textAlignVertical: 'top',
    },
    itempickerStyle: {
        color: '#FFF',
        width: '100%'
    },
    pickerStyle: {
        backgroundColor: '#444',
        margin: 10,
        borderRadius: 10,
        color: '#FFF'
    },
    unselected: {
        color: '#CCC'
    },
    TextclearList: {
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold',
        fontSize: 18,
        textAlign: 'center',
        padding: 40,
    },
}