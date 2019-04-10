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
import { getData, setData, insertData, deleteData } from '../../components/services/baseService';
import { getuserList, deleteItemsFromList, structureList } from '../../components/services/Service';
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
            lists: [],
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
            mounted: false,
            modelInvalid: false,
            confirmDelete: false
        };
    }
    componentDidMount() {
        var _self = this;


        //DeviceEventEmitter.addListener('refresh', (data) => {
        //    if (data) {
        //        _self.loadData();
        //    }
        //});

        DeviceEventEmitter.emit('reloading', true);
        this.loadData();
    }
    componentWillUnmount() {
        this.setState({ mounted: false });
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    loadData = () => {
        var _self = this;
        var obj = [];
        var user = firebase.auth().currentUser;

        firebase.database().ref('/userLists/' + user.uid).on('value', function (snapshot) {


            structureList(snapshot.val()).then(r => {
                for (var item in r) {
                    obj.push(r[item]);
                }
                _self.setState({ page: 0, lists: obj, listend: false, loading: false, mounted: true },
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

    arrayRemove(arr, value) {
        return arr.filter(function (el) {
            return !value.includes(el);
        });
    }
    selectItem = (id) => {
        //console.log("id: ", id);
        var arrayobj = this.state.selectedItens;
        if (!arrayobj.includes(id)) {
            arrayobj.push(id);
        } else {
            arrayobj = this.arrayRemove(arrayobj, [id]);
        }
        //console.log("arrayobj: ", arrayobj);
        //console.log("================");
        this.setState({ selectedItens: arrayobj },
            () => {
                //DeviceEventEmitter.emit('selectMode', true);
            }
        );
    }
    confirmdeleteItens = () => {
        var _self = this;

        DeviceEventEmitter.emit('reloading', true);
        deleteItemsFromList(this.state.selectedItens).then(() => {
            _self.setState({ selectedItens: [], confirmDelete: false },
                () => {
                    DeviceEventEmitter.emit('confirmDelete', true);
                    DeviceEventEmitter.emit('selectMode', false);
                    this.loadData();
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
        this.setModalVisible(!this.state.modalVisible);
    }
    addList = () => {
        //console.log("ADD ITEM");
        var obj = this.state.list;
        if (this.state.list.title == "" || this.state.list.type == "" || this.state.list.text == "" || this.state.list.limit == "") {
            this.setState({ modelInvalid: true });
        } else {
            DeviceEventEmitter.emit('reloading', true);
            this.setState({ modelInvalid: false });
            var _self = this;

            var user = firebase.auth().currentUser;
            insertData('userLists/' + user.uid + '/', obj)
                .then((resp) => {
                    _self.setModalVisible(false);
                    _self.loadData();
                });
        }
    }
    closeModal = () => {
        this.setState({
            modalVisible: false,
            list: {
                title: "",
                games: [],
                key: "",
                description: "",
                type: "",
                limit: ""
            }
        });
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
        obj.text = value;
        this.setState({ list: obj });
    }
    renderLists() {
        let lists = this.state.lists;
        let items = [];
        for (let i = 0; i < lists.length; i++) {
            items.push(<ListItem key={i} obj={lists[i]} callback={this.selectItem.bind(this)} id={lists[i].key} />);
        }
        return items;
    }
    render() {
        let pickerState = null;
        if (this.state.list.type == "") {
            pickerState = styles.unselected;
        }
        //console.log("pickerState: ", pickerState);

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.scrollArea}>
                        {this.renderLists()}
                    </View>
                </ScrollView>

                <Header style={styles.header} type={"info-lists"} back={true} callbackDelete={this.deleteItens.bind(this)} callbackAdd={this.addItens.bind(this)} label={"Minhas Listas"} detail={this.state.lists.length + " listas"} />

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

                        <View style={styles.listBox}>
                            <Text style={styles.menuTitle}>-CRIAR LISTA-</Text>
                            {this.state.modelInvalid &&
                                <Text style={styles.erroText}>Preencha todos os campos.</Text>
                            }
                            <TextInput
                                placeholder={"Nome"}
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
                                style={[styles.inputsearch, styles.inputText]}
                                onChangeText={(text) => this._setLimit(text)}
                                ref={input => { this.limitInput = input }}
                            />
                            <TextInput
                                placeholder={"Descrição"}
                                multiline={true}
                                numberOfLines={4}
                                style={[styles.inputsearch, styles.inputMulti, styles.inputText]}
                                onChangeText={(text) => this._setText(text)}
                                ref={input => { this.textInput = input }} />
                            <View style={styles.buttonBox}>
                                <TouchableHighlight underlayColor="transparent" style={styles.addItem} onPress={() => this.addList()}>
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
    menuList: {
        flex: 1,
    },
    contentModal: {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unselected: {
        color: '#CCC'
    },
    backgroundModal: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    scrollArea: {
        paddingBottom: 40
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
}