import React from 'react';
//import * as firebase from 'firebase';
import { insertData, updateData } from '../../components/services/baseService';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    TextInput,
    Picker,
    DeviceEventEmitter
} from 'react-native';
import TabBarIcon from '../../components/UI/TabBarIcon';



export default class AddEditList extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        modelInvalid: false
    };

    saveList = () => {
        var obj = this.props.list;
        if (obj.title == "" || obj.type == "" || obj.status == "" || obj.description == "" || obj.limit == "") {
            this.setState({ modelInvalid: true });
        } else {
            DeviceEventEmitter.emit('reloading', true);
            this.setState({ modelInvalid: false });
            var _self = this;

            //var user = firebase.auth().currentUser;

            
            //if (obj.key == undefined) {
            //    insertData('userLists/' + user.uid + '/', obj)
            //        .then((resp) => {
            //            this.props.callback();
            //        });
            //} else {
            //    updateData('userLists/' + user.uid + '/' + obj.key, obj)
            //        .then((resp) => {
            //            this.props.callback();
            //        });
            //}
        }

    }
    _setTitle(value) {
        var obj = this.props.list;
        obj.title = value;
        this.setState({ list: obj });
    }
    _setSelect(value) {
        var obj = this.props.list;
        obj.type = value;
        this.setState({ list: obj });
    }
    _setStatus(value) {
        var obj = this.props.list;
        obj.status = value;
        this.setState({ list: obj });
    }
    _setText(value) {
        var obj = this.props.list;
        obj.description = value;
        this.setState({ list: obj });
    }
    render() {
        let pickerState = null;
        let pickerStateStatus = null;
        if (this.props.list.type == "") {
            pickerState = styles.unselected;
        }
        if (this.props.list.status == "") {
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
                    value={this.props.list.title}
                    style={[styles.inputsearch, styles.inputText]}
                    onChangeText={(text) => this._setTitle(text)}
                    ref={input => { this.titleInput = input }}
                />
                <View style={styles.rowInput}>
                    <View style={[styles.inputSelect, styles.SelectLeft]}>
                        <Picker
                            selectedValue={this.props.list.type}
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
                            selectedValue={this.props.list.status}
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
                    placeholder={"Descrição"}
                    multiline={true}
                    numberOfLines={4}
                    value={this.props.list.description.toString()}
                    style={[styles.inputsearch, styles.inputMulti, styles.inputText]}
                    onChangeText={(text) => this._setText(text)}
                    ref={input => { this.textInput = input }} />
                <TouchableHighlight underlayColor="transparent" style={styles.saveButton} onPress={() => this.saveList()}>
                    <TabBarIcon
                        name={'save'}
                        type={'MaterialIcons'}
                        style={styles.saveBoxIcon}
                    />
                </TouchableHighlight>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    rowInput: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
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