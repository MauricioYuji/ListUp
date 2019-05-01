import React from 'react';
import * as firebase from 'firebase';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Dimensions,
    DeviceEventEmitter,
    Modal,
    TextInput,
    Picker
} from 'react-native';

import { insertData } from '../../components/services/baseService';
import { deleteItemsFromList, structureList } from '../../components/services/Service';
import ListItem from '../../components/UI/ListItem';
import TabBarIcon from '../../components/UI/TabBarIcon';
import Header from '../../screens/Shared/Header';



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
                status: "",
                description: "",
                type: "",
                limit: ""
            },
            multiSelect: false,
            selectedItens: [],
            modalVisible: false,
            mounted: false,
            modelInvalid: false,
            confirmDelete: false,
            modalActive: null
        };
    }
    componentDidMount() {
        var _self = this;


        DeviceEventEmitter.addListener('selectMode', (data) => {
            this.setState({ selectMode: data });
        });
        DeviceEventEmitter.emit('reloading', true);
        this.loadData();
    }
    componentWillUnmount() {
        this.setState({ mounted: false });
    }

    setVisible(content) {
        let _self = this;
        _self.setState({ modalVisible: false },
            () => {
                _self.setState({ modalActive: content },
                    () => {
                        _self.setState({ modalVisible: true },
                            () => {
                            }
                        );
                    }
                );
            }
        );
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    loadData = () => {
        var _self = this;
        var user = firebase.auth().currentUser;

        firebase.database().ref('/userLists/' + user.uid).on('value', function (snapshot) {


            structureList(snapshot.val()).then(r => {

                var obj = [];
                var ol = Object.keys(r);
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
        var arrayobj = this.state.selectedItens;
        if (!arrayobj.includes(id)) {
            arrayobj.push(id);
        } else {
            arrayobj = this.arrayRemove(arrayobj, [id]);
        }
        this.setState({ selectedItens: arrayobj },
            () => {
            }
        );
    }
    confirmdeleteItens = () => {
        var _self = this;

        DeviceEventEmitter.emit('reloading', true);
        deleteItemsFromList(this.state.selectedItens).then(() => {

            this.closeModal();
            _self.setState({ selectedItens: [], selectMode: false },
                () => {
                    DeviceEventEmitter.emit('selectMode', false);
                }
            );

        });
    }
    deleteItens = () => {
        let _self = this;
        this.setVisible(this._modalDeleteList());
    }
    addItens = () => {
        let _self = this;
        this.setVisible(this._modalAdd());
    }
    addList = () => {
        var obj = this.state.list;
        if (obj.title == "" || obj.type == "" || obj.status == "" || obj.description == "" || obj.limit == "") {
            this.setState({ modelInvalid: true });
        } else {
            DeviceEventEmitter.emit('reloading', true);
            this.setState({ modelInvalid: false });
            var _self = this;

            var user = firebase.auth().currentUser;
            insertData('userLists/' + user.uid + '/', obj)
                .then((resp) => {
                    _self.setModalVisible(false);
                    _self.closeModal();
                });
        }
    }
    closeModal = () => {
        this.setState({
            modalVisible: false,
            list: {
                title: "",
                games: [],
                status: "",
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
        this.setState({ list: obj, modalActive: this._modalAdd() });
    }
    _setLimit(value) {
        var obj = this.state.list;
        obj.limit = value;
        this.setState({ list: obj, modalActive: this._modalAdd() });
    }
    _setSelect(value) {
        var obj = this.state.list;
        obj.type = value;
        this.setState({ list: obj, modalActive: this._modalAdd() });
    }
    _setStatus(value) {
        var obj = this.state.list;
        obj.status = value;
        this.setState({ list: obj, modalActive: this._modalAdd() });
    }
    _setText(value) {
        var obj = this.state.list;
        obj.description = value;
        this.setState({ list: obj, modalActive: this._modalAdd() });
    }
    renderLists() {
        let lists = this.state.lists;
        let items = [];
        for (let i = 0; i < lists.length; i++) {
            items.push(<ListItem key={i} obj={lists[i]} callback={this.selectItem.bind(this)} id={lists[i].key} />);
        }
        return items;
    }
    _headerItens() {
        if (this.state.selectMode) {
            return (<TouchableHighlight underlayColor="transparent" onPress={() => this.deleteItens()} style={styles.sideIcon}>
                <TabBarIcon
                    name={'trash-can-outline'}
                    type={'MaterialCommunityIcons'}
                    style={styles.backButton}
                />
            </TouchableHighlight>);
        } else {
            return (
                <TouchableHighlight underlayColor="transparent" onPress={() => this.addItens()} style={styles.sideIcon}>
                    <TabBarIcon
                        name={'playlist-plus'}
                        type={'MaterialCommunityIcons'}
                        style={styles.backButton}
                    />
                </TouchableHighlight>
            );
        }
    }

    _modalAdd() {
        let pickerState = null;
        let pickerStateStatus = null;
        if (this.state.list.type == "") {
            pickerState = styles.unselected;
        }
        if (this.state.list.status == "") {
            pickerStateStatus = styles.unselected;
        }
        return (
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
                    <View style={styles.rowInput}>
                        <View style={[styles.inputSelect, styles.SelectLeft]}>
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
                        <View style={[styles.inputSelect, styles.SelectRight]}>
                            <Picker
                                selectedValue={this.state.list.status}
                                style={[styles.pickerStyle, pickerStateStatus]}
                                itemStyle={[styles.itempickerStyle]}
                                onValueChange={(itemValue, itemIndex) =>
                                    this._setStatus(itemValue)
                                }>
                                <Picker.Item label="Selecione um status" value="" />
                                <Picker.Item label="Público" value="publico" />
                                <Picker.Item label="Privado" value="privado" />
                            </Picker>
                        </View>
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
                    <TouchableHighlight underlayColor="transparent" style={styles.saveButton} onPress={() => this.addList()}>
                        <TabBarIcon
                            name={'save'}
                            type={'MaterialIcons'}
                            style={styles.saveBoxIcon}
                        />
                    </TouchableHighlight>
                </View>
        );
    }
    _modalDeleteList() {
        return (
            <View>
                <Text style={styles.addItemText}>DESEJA EXCLUIR?</Text>
                <View style={styles.buttonBox}>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.confirmdeleteItens()}>
                        <View style={[styles.addItem, styles.dangerButton]}>
                            <Text style={[styles.addItemText]}>Deletar</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.closeModal()}>
                        <View style={styles.addItem}>
                            <Text style={styles.addItemText}>Cancelar</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.scrollArea}>
                        {this.renderLists()}
                    </View>
                </ScrollView>

                <Header style={styles.header} type={"info-lists"} back={true} label={"Minhas Listas"} detail={this.state.lists.length + " listas"} itens={this._headerItens()} />

            



                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.mounted && this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}>
                    <View style={styles.backgroundModal}>
                        {this.state.modalActive}

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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 60
    },
    menuList: {
        flex: 1,
    },
    sideIcon: {
        padding: 5
    },
    backButton: {
        fontSize: 40
    },
    rowInput: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
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
    saveButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    saveBoxIcon: {
        color: '#FFF',
        fontSize: 50
    },
    closeBox: {
        position: 'absolute',
        top: 10,
        left: 10,
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
    SelectLeft: {
        marginRight: 10
    },
    SelectRight: {
        marginLeft: 10
    },
    inputSelect: {
        flex: 1,
        backgroundColor: '#444',
        marginVertical: 10,
        paddingLeft: 15,
        padding: 0,
        borderRadius: 10,
        maxHeight: 50,
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
        borderRadius: 10,
        color: '#FFF'
    },
});