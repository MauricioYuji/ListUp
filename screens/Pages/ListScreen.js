﻿import React from 'react';
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
import { getListByKey, getGames } from '../../components/services/Service';
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
        if (key == "") {
            key = this.state.key;
        }
        getListByKey(key).then((list) => {
            var obj = {
                title: list.title,
                games: (list.games == undefined ? [] : list.games),
                key: key,
                limit: list.limit,
                type: list.type,
                description: list.description
            };
            _self.setState({ page: 0, list: obj, listend: false, loading: false, mounted: true, key: key },
                () => {
                    DeviceEventEmitter.emit('reloading', false);
                    //_self.filterObj();
                }
            );

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
    deleteItens = () => {
        console.log("DELETE all: ", this.state.selectedItens);
        this.setState({ selectedItens: [] },
            () => {
                DeviceEventEmitter.emit('selectMode', false);
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
            console.log("obj: ", obj);
            var user = firebase.auth().currentUser;
            setData('userLists/' + user.uid + '/' + list.key, obj)
                .then((resp) => {
                    _self.setModalVisibleEdit(false);
                    console.log("resp: ", resp);
                    console.log("=============================");
                });
        }
    }
    closeModal = () => {
        this.setState({ games: [], modalVisible: false, modalVisibleEdit: false });
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
        console.log("Search: ", search);
        var _self = this;
        if (search == "") {
            _self.setState({ games: [] },
                () => {
                    //_self.filterObj();
                }
            );
        } else {

            var re = new RegExp(search.toLowerCase(), 'g');
            getGames(this.state.page).then((games) => {
                games = games.filter(p => (p.name.toLowerCase().match(re) != null && search != "") || search == "").map(item => {
                    return {
                        image: item.file,
                        name: item.name,
                        key: item.key,
                        consoles: item.consoles,
                        genres: item.genres
                    };
                });

                //games = obj.filter(p => (p.consoles.some(r => filterobj.consoles.includes(r.key)) || filterobj.consoles.length == 0) && (p.genres.some(r => filterobj.genres.includes(r.key)) || filterobj.genres.length == 0) && ((p.name.toLowerCase().match(re) != null && filterobj.search != "") || filterobj.search == ""));

                _self.setState({ games: games },
                    () => {
                        _self.getImages(games);
                        //_self.filterObj();
                    }
                );

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


    getImages = async (obj) => {
        for (let i = 0; i < obj.length; i++) {
            await getData('thumbs/' + obj[i].image.key)
                .then((img) => {
                    obj[i].image.file = img.file;
                    obj[i].image.url = img.url;
                });
        }

        this.setState({ games: this.state.games });
    }
    renderGames() {
        let list = this.state.games;
        let items = [];
        for (let i = 0; i < list.length; i++) {
            items.push(<AddGameItem key={i} label={list[i].name} img={list[i].image} consoles={list[i].consoles} callback={this.selectItem.bind(this)} id={list[i].key} />);
        }
        return items;
    }
    renderLists() {
        let list = this.state.list.games == undefined ? [] : this.state.list.games;
        let items = [];
        for (let i = 0; i < list.length; i++) {
            //items.push(<ListItem key={i} label={list[i].title} games={list[i].games} callback={this.selectItem.bind(this)} id={list[i].key} />);
        }
        return items;
    }
    render() {
        let pickerState = null;
        if (this.state.list.type == "") {
            pickerState = styles.unselected;
        }
        console.log("pickerState: ", pickerState);
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollArea}>
                    <View style={styles.titleBox}>
                        <Text style={styles.labelTitle}>{this.state.list.title}</Text>
                        <Text style={styles.labelDetail}>{this.state.list.games.length} jogos</Text>
                    </View>

                </ScrollView>

                <Header style={styles.header} type={"info-list"} back={true} callbackDelete={this.deleteItens.bind(this)} callbackAdd={this.addItens.bind(this)} callbackEdit={this.editItens.bind(this)} label={"Lista"} detail={""} />

                <View style={styles.scrollArea}>
                    {this.renderLists()}
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.mounted && this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}>
                    <View style={styles.backgroundModal}>
                        <ScrollView style={styles.menuList}>
                            <LinearGradient
                                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
                                useAngle
                                angle={180}
                                style={styles.backgroundOverlayModal}
                            />
                            <TouchableHighlight>
                                <TouchableWithoutFeedback>
                                    <View style={styles.listBox}>
                                        <Text style={styles.menuTitle}>-ADICIONAR JOGO-</Text>
                                        <TextInput
                                            placeholder={"Nome"}
                                            style={[styles.inputsearch, styles.inputText]}
                                            onChangeText={(text) => this._searchGame(text)}
                                            ref={input => { this.titleInput = input }}
                                        />
                                        <View style={styles.inputSelect}>
                                            {(this.state.games.length == 0) ? (
                                                <Text>Procure pelo nome o jogo que gostaria de adicionar</Text>
                                            ) : (
                                                    this.renderGames()
                                                )
                                            }

                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </TouchableHighlight>
                        </ScrollView>
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
                                value={this.state.list.name}
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
                                value={this.state.list.description}
                                style={[styles.inputsearch, styles.inputMulti, styles.inputText]}
                                onChangeText={(text) => this._setText(text)}
                                ref={input => { this.textInput = input }} />
                            <View style={styles.buttonBox}>
                                <TouchableHighlight underlayColor="transparent" onPress={() => this.addList()}>
                                    <View style={styles.addItem}>
                                        <Text style={styles.addItemText}>Criar Lista</Text>
                                    </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
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
        backgroundColor: "#006CD8"
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
        fontSize: 20,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        color: '#FFF',
        minHeight: 50,
        fontFamily: 'SourceSansPro-Bold',
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
}