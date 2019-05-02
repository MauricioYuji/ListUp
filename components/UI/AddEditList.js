import React from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text
} from 'react-native';



export default class AddGameButton extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
    };
    addList = () => {
        this.props.addList();
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
    render() {
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
}
const styles = StyleSheet.create({
    
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