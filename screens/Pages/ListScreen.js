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
import { getListByKey } from '../../components/services/Service';
import { MonoText } from '../../components/UI/StyledText';
import ListItem from '../../components/UI/ListItem';
import TabBarIcon from '../../components/UI/TabBarIcon';
import { GetImage } from '../../components/UI/GetImage';
import Header from '../../screens/Shared/Header';
import LoadingScreen from '../Loading/LoadingScreen';
import { parse } from 'qs';
import MasonryList from '@appandflow/masonry-list';

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
            page: 0,
            list: {
                title: "",
                games: [],
                key: "",
                description: ""
            },
            multiSelect: false,
            selectedItens: [],
            modalVisible: false,
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
    loadData = (key) => {
        var _self = this;
        if (key == "") {
            key = this.state.key;
        }
        getListByKey(key).then((list) => {
            console.log("list: ", list);
            var obj = {
                title: list.title,
                games: list.games == undefined ? [] : list.games,
                key: key,
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
    addList = () => {
        var obj = {
            title: this.state.inputTitle,
            type: this.state.inputSelect,
            description: this.state.inputText,
            limit: this.state.inputLimit,
            games: []
        };
        if (this.state.inputTitle == "" || this.state.inputSelect == "" || this.state.inputText == "" || this.state.inputLimit == "") {
            this.setState({ modelInvalid: true });
        } else {
            this.setState({ modelInvalid: false });
            var _self = this;

            console.log("ADD TO LIST");
            console.log("obj: ", obj);
            var user = firebase.auth().currentUser;
            insertData('userLists/' + user.uid + '/', obj)
                .then((resp) => {
                    _self.setModalVisible(false);
                    console.log("resp: ", resp);
                    console.log("=============================");
                });
        }
    }
    closeModal = () => {
        this.setState({ modalVisible: false });
    }

    _searchGame(value) {
        console.log("Search: ", value);
        var _self = this;
        getGames(this.state.page).then((games) => {
            games = games.map(item => {
                return {
                    image: item.file,
                    name: item.name,
                    key: item.key,
                    consoles: item.consoles,
                    genres: item.genres
                };
            });

            _self.setState({ games: games },
                () => {
                    //_self.filterObj();
                }
            );

        });
    }
    renderLists() {
        let lists = this.state.lists;
        let items = [];
        for (let i = 0; i < lists.length; i++) {
            items.push(<ListItem key={i} label={lists[i].title} games={lists[i].games} callback={this.selectItem.bind(this)} id={lists[i].key} />);
        }
        return items;

    }

    renderLists() {
        let list = this.state.list.games;
        let items = [];
        for (let i = 0; i < list.length; i++) {
            items.push(<ListItem key={i} label={list[i].title} games={lists[i].games} callback={this.selectItem.bind(this)} id={lists[i].key} />);
        }
        return items;
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollArea}>
                    <View style={styles.titleBox}>
                        <Text style={styles.labelTitle}>{this.state.list.title}</Text>
                        <Text style={styles.labelDetail}>{this.state.list.games.length} jogos</Text>
                    </View>

                </ScrollView>

                <Header style={styles.header} type={"info-list"} back={true} callbackDelete={this.deleteItens.bind(this)} callbackAdd={this.addItens.bind(this)} label={"Lista"} detail={""} />

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
                    <View style={styles.addBox}>
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
                                            <Text>Procure pelo nome o jogo que gostaria de adicionar</Text>
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
        backgroundColor: 'rgba(0,0,0,0.9)',
        paddingTop: 100,
        minHeight: Dimensions.get('window').height - 100
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
        fontFamily: 'SourceSansPro-Bold',
        borderRadius: 5
    },
    addItemText: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    inputSelect: {
        backgroundColor: '#444',
        margin: 10,
        padding: 0,
        borderRadius: 10,
        minHeight: 50
    },
    inputsearch: {
        backgroundColor: '#444',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        minHeight: 50
    },
    inputText: {
        color: '#FFF',
        fontFamily: 'SourceSansPro-Regular',
        fontSize: 18,
    },
    inputMulti: {
        textAlignVertical: 'top',
    }
}