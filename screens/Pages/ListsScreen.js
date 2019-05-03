import React from 'react';
import * as firebase from 'firebase';
import {
    ScrollView,
    StyleSheet,
    View,
    TouchableHighlight,
    DeviceEventEmitter,
    Modal,
} from 'react-native';

import { insertData } from '../../components/services/baseService';
import { deleteItemsFromList, structureList } from '../../components/services/Service';
import ListItem from '../../components/UI/ListItem';
import TabBarIcon from '../../components/UI/TabBarIcon';
import AddEditList from '../../components/UI/AddEditList';
import ConfirmDelete from '../../components/UI/ConfirmDelete';
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
        return (
            <AddEditList list={this.state.list} saveList={this.addList.bind(this)} />
        );
    }
    _modalDeleteList() {
        return (
            <ConfirmDelete confirmdeleteItens={this.confirmdeleteItens.bind(this)} closeModal={this.closeModal.bind(this)} />
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
    sideIcon: {
        padding: 5
    },
    backButton: {
        fontSize: 40
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