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
} from 'react-native';

import NavigationService from '../../components/services/NavigationService';
import { updateData } from '../../components/services/baseService';
import { deleteGamesFromList, structureList, structureGames, deleteItemsFromList } from '../../components/services/Service';
import GameItem from '../../components/UI/GameItem';
import TabBarIcon from '../../components/UI/TabBarIcon';
import Header from '../../screens/Shared/Header';
import AddEditList from '../../components/UI/AddEditList';
import EditGames from '../../components/UI/EditGames';
import ConfirmDelete from '../../components/UI/ConfirmDelete';
import AddGame from '../../components/UI/AddGame';
import ModalDefault from '../../components/UI/ModalDefault';




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
            listgames: [],
            page: 0,
            confirmDelete: false,
            list: {
                title: "",
                games: [],
                status: "",
                description: "",
                type: "",
                limit: ""
            },
            listedit: {
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
            modalVisibleEdit: false,
            menu: false,
            mounted: false,
            inputTitle: "",
            inputSelect: "",
            inputText: "",
            inputLimit: "",
            modelInvalid: false,
            key: "",
            modalActive: null,
            selectMode: false
        };
    }
    componentDidMount() {
        var _self = this;

        DeviceEventEmitter.emit('reloading', true);
        DeviceEventEmitter.addListener('selectMode', (data) => {
            this.setState({ selectMode: data });
        });

        const { navigation } = this.props;
        const key = navigation.getParam('key', 'NO-ID');

        this.loadData(key);

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
        this.setState({ selectedItens: arrayobj, selectMode: true },
            () => {
            }
        );
    }
    confirmdeleteItens = () => {
        var _self = this;

        var list = this.state.list;
        DeviceEventEmitter.emit('reloading', true);
        deleteGamesFromList(this.state.selectedItens, list.key).then(() => {
            DeviceEventEmitter.emit('reloading', false);
            this.closeModal();
            _self.setState({ selectedItens: [], selectMode: false },
                () => {
                    DeviceEventEmitter.emit('selectMode', false);
                }
            );
        });
    }
    confirmdeleteList = () => {

        var _self = this;

        DeviceEventEmitter.emit('reloading', true);
        deleteItemsFromList([this.state.list.key]).then(() => {
            _self.setState({ modalVisible: false },
                () => {
                    NavigationService.navigate("Lists");
                }
            );
        });
    }
    deleteItens = () => {
        this.setVisible(this._modalDeleteGame());
    }
    showDropdown = () => {
        this.setVisible(this._modalMenu());
    }
    addItens = () => {
        let _self = this;
        this.setVisible(this._modalAdd());

    }
    editGames = () => {
        let _self = this;
        this.setState({ listgames: this.state.list.games },
            () => {
                _self.setVisible(_self._modalEditGames());
            }
        );

    }
    deleteList = () => {
        let _self = this;
        this.setVisible(this._modalDeleteList());

    }
    editItens = () => {
        let _self = this;
        this.setState({ listedit: Object.assign({}, this.state.list) },
            () => {
                _self.setVisible(_self._modalEditList());
            }
        );

    }
    
    callbackAdd = () => {
        this.setState({ modalVisible: false });
        this.loadData("");
    }
    editList = () => {
        var list = this.state.listedit;
        if (list.title == "" || list.type == "" || list.status == "" || list.description == "" || list.limit == "") {
            this.setState({ modelInvalid: true });
        } else {
            this.setState({ modelInvalid: false });
            var _self = this;


            var obj = {
                title: list.title,
                description: list.description,
                type: list.type,
                status: list.status,
                limit: list.limit
            };
            var user = firebase.auth().currentUser;
            updateData('userLists/' + user.uid + '/' + list.key, obj)
                .then((resp) => {
                    _self.setState({ modalVisible: false });
                    _self.loadData("");
                });
        }
    }
    closeModal = () => {
        this.setState({ games: [], modalVisible: false });
    }

    saveGameEdit(gamelist) {
        var list = this.state.list;
        list.games = gamelist;
        this.setState({ list: list },
            () => {
                var _self = this;


                let obj = {
                    games: []
                };
                for (let i = 0; i < list.games.length; i++) {
                    var consoles = [];
                    for (let j = 0; j < list.games[i].userConsoles.length; j++) {
                        consoles.push(list.games[i].userConsoles[j].key);
                    }
                    var item = {};
                    item[list.games[i].key] = consoles;


                    obj.games.push(item);
                }
                var user = firebase.auth().currentUser;
                updateData('userLists/' + user.uid + '/' + list.key, obj)
                    .then((resp) => {
                        _self.setState({ modalVisible: false },
                            () => {
                                _self.loadData("");
                            }
                        );
                    });
            }
        );
    }
    
    renderGamesList() {
        let list = this.state.list.games;
        let items = [];
        for (let i = 0; i < list.length; i++) {
            items.push(<GameItem key={i} pos={i + 1} ranking={this.state.list.type == "ranking"} obj={list[i]} callback={this.selectItem.bind(this)} />);
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
                <TouchableHighlight underlayColor="transparent" onPress={() => this.showDropdown()} style={styles.sideIcon}>
                    <TabBarIcon
                        name={'more-vert'}
                        type={'MaterialIcons'}
                        style={styles.backButton}
                    />
                </TouchableHighlight>
            );
        }
    }
    _modalAdd() {
        return (
            <AddGame list={this.state.list} />
        );
    }
    _modalEditList() {
        return (
            <AddEditList list={this.state.listedit} callback={this.callbackAdd.bind(this)} />
        );
    }
    _modalDeleteGame() {
        return (
            <ConfirmDelete confirmdeleteItens={this.confirmdeleteItens.bind(this)} closeModal={this.closeModal.bind(this)} />
        );
    }
    _modalDeleteList() {
        return (
            <ConfirmDelete confirmdeleteItens={this.confirmdeleteList.bind(this)} closeModal={this.closeModal.bind(this)} />
        );
    }
    _modalEditGames() {
        return (
            <EditGames list={this.state.list} saveGameEdit={this.saveGameEdit.bind(this)} />
        );
    }
    _modalMenu() {
        return (
            <View style={styles.dropdownMenu}>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.addItens()}>
                    <Text style={styles.menuText}>Adicionar jogo</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.editItens()}>
                    <Text style={styles.menuText}>Editar lista</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.editGames()}>
                    <Text style={styles.menuText}>Editar games</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.deleteList()}>
                    <Text style={styles.menuText}>Excluir lista</Text>
                </TouchableHighlight>
            </View>
        );
    }
    render() {
        return (

            <View style={styles.container}>
                <ScrollView style={styles.scrollArea}>
                    <View style={styles.titleBox}>
                        <Text style={styles.labelTitle}>{this.state.list.title}</Text>
                        <Text style={styles.labelDescription}>{this.state.list.description}</Text>
                    </View>

                    {this.renderGamesList()}
                </ScrollView>

                <Header style={styles.header} type={"info-list"} back={true} label={"Lista"} detail={this.state.list.games.length + " jogos"} itens={this._headerItens()} />

                <ModalDefault type="slide" visible={this.state.mounted && this.state.modalVisible} modalActive={this.state.modalActive} closeModal={this.closeModal.bind(this)}/>


            </View>
        );
    }
}
const styles = StyleSheet.create({
    dropdownMenu: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        alignSelf: 'center',
        textAlign: 'center',
        width: Dimensions.get('window').width / 2,
        padding: 15,
        marginTop: 20
    },
    menuText: {
        color: '#333',
        fontSize: 20,
        textAlign: 'center',
        flexWrap: "nowrap",
        marginVertical: 10,
        fontFamily: 'SourceSansPro-Regular'
    },
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 60
    },
    sideIcon: {
        padding: 5
    },
    backButton: {
        fontSize: 40
    },
    backgroundModal: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    titleBox: {
        flex: 1,
        padding: 15,
        marginBottom: 15,
        backgroundColor: "#006CD8",
    },
    labelTitle: {
        fontSize: 34,
        color: '#FFF',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    labelDescription: {
        fontSize: 16,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Regular'
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
});