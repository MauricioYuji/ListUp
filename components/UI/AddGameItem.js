import React from 'react';
import { Icon } from 'expo';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    Keyboard
} from 'react-native';
import * as firebase from 'firebase';
import TabBarIcon from '../UI/TabBarIcon';
import { getData, setData, insertData } from '../services/baseService';
import { addGamestoList } from '../services/Service';
import NavigationService from '../services/NavigationService';


export default class AddGameItem extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        selected: false,
        selectMode: false,
        showButtons: false,
        addFeedback: false,
        consolesActive: []
    };

    componentDidMount() {
        var _self = this;
        var item = this.props.userConsoles;
        var array = [];
        if (item != null) {
            for (var i = 0; i < item.length; i++) {
                array.push(item[i].key);
            }
            _self.setState({ consolesActive: array });
        }

        DeviceEventEmitter.addListener('selectConsole', (data) => {
            if (data) {
                _self.setState({ showButtons: true });
            } else {
                _self.setState({ showButtons: false });
            }
        });
    }

    //itemAction() {
    //    var _self = this;
    //    if (this.state.selectMode) {
    //        _self.setState({ selected: !this.state.selected },
    //            () => {
    //                _self.props.callback(_self.props.id);
    //            }
    //        );
    //    } else {
    //        console.log("GO TO PAGE: ", this.props.id);
    //        NavigationService.navigate("List", { key: this.props.id });
    //    }
    //}
    showButtons = () => {
        var _self = this;
        Keyboard.dismiss();
        DeviceEventEmitter.emit('selectConsole', false);
        _self.setState({ showButtons: !this.state.showButtons },
            () => {
                //_self.props.callback(_self.props.id);
            }
        );
    }
    //allowSelect() {
    //    var _self = this;
    //    _self.setState({ selected: !this.state.selected },
    //        () => {
    //            _self.props.callback(_self.props.id);
    //            DeviceEventEmitter.emit('selectMode', true);
    //        }
    //    );

    //}

    arrayRemove(arr, value) {
        return arr.filter(function (el) {
            return !value.includes(el);
        });
        //return arr.filter(function (ele) {
        //    return ele != value;
        //});

    }
    arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }
    ActiveConsole(key, multiple) {
        var _self = this;
        var list = this.state.consolesActive;
        console.log("list: ", list);
        let consoles = this.props.game.consoles;
        if (!multiple) {
            if (list.includes(key))
                list = this.arrayRemove(list, [key]);
            else
                list.push(key);

        } else {
            var result = consoles.filter(p => p.keycompany === key).map(m => m.key);
            const found = result.every(r => list.includes(r));

            if (found)
                list = this.arrayRemove(list, result);
            else
                list = this.arrayUnique(list.concat(result));
        }


        _self.setState({ consolesActive: list },
            () => {
                //_self._submitFilter();
            }
        );

    }
    sendGame = () => {
        var _self = this;
        _self.setState({ addFeedback: true }, () => {
            setTimeout(function () {
                _self.setState({ addFeedback: false }, () => {
                    DeviceEventEmitter.emit('selectConsole', false);
                    addGamestoList(_self.props.id, _self.props.game.key, _self.state.consolesActive).then((resp) => {
                        _self.props.callback();
                    });
                });
            }, 1000);
        });
    }
    renderThumb = (item) => {

        if (item.key == "" || item.file == null)
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'cover'} style={styles.thumb} />);
        else {
            return (<Image source={{ uri: item.url }} resizeMode={'cover'} style={styles.thumb} />);
        }
    }
    listPlatforms = () => {
        let obj = [];
        let objarray = this.props.game.consoles;
        let filteractive = this.state.consolesActive;
        console.log("filteractive: ", filteractive);

        for (let j = 0; j < objarray.length; j++) {
            if (objarray[j].keycompany === undefined) {
                obj.push(
                    <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveConsole(objarray[j].key, true)} key={objarray[j].name} style={styles.filterButtonTab}>
                        <View>
                            <Image source={{ uri: objarray[j].img }} resizeMode={'contain'} style={[styles.filterButtonTabImg, { width: objarray[j].width / 3, height: objarray[j].height / 3 }]} />
                        </View>
                    </TouchableHighlight>);
            } else {
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
        }
        return obj;
    }
    renderAddButton = () => {
        if (this.state.addFeedback) {
            return (
                <Text style={styles.buttonTextFeedback}>Adicionado com sucesso</Text>
            );
        } else {
            return (
                <TouchableHighlight onPress={() => this.sendGame()} style={styles.button}>
                    <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableHighlight>
            );
        }
    }
    renderConsoleBox = () => {
        if (this.state.showButtons) {
            return (
                <View style={styles.consoleBox}>
                    <View style={styles.selectConsoles}>
                        {this.listPlatforms()}
                    </View>
                    {this.renderAddButton()}
                </View>
            );
        } else {
            return null;
        }
    }
    render() {
        var boxstyle = null;
        if (this.state.showButtons) {
            boxstyle = styles.activeBox;
        }
        return (
            <View>
                <View style={[styles.listItem, boxstyle]}>
                    <View style={styles.itemInfo}>
                        {this.renderThumb(this.props.game.image)}
                        <View>
                            <Text style={styles.labelTitle}>{this.props.game.name}</Text>
                        </View>
                    </View>
                    <View style={styles.thumbArea}>

                        <TouchableHighlight underlayColor="transparent" onPress={this.showButtons.bind(this)}>
                            <TabBarIcon
                                name={'add'}
                                type={'MaterialIcons'}
                                style={styles.addIcon}
                            />
                        </TouchableHighlight>
                    </View>
                </View>
                {this.renderConsoleBox()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    consoleBox: {
        width: '100%',
        padding: 10,
        backgroundColor: '#444'
    },
    activeBox: {
        backgroundColor: '#444'
    },
    button: {
        backgroundColor: '#006CD8',
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        paddingVertical: 5,
        paddingHorizontal: 30,
        minHeight: 40,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold',
    },
    buttonTextFeedback: {
        fontSize: 20,
        color: '#FFF',
        flex: 1,
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        textAlign: 'center',
        fontFamily: 'SourceSansPro-Bold',
    },
    selectConsoles: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
    listItem: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    selected: {
        backgroundColor: '#006CD8',
    },
    itemInfo: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: 'left',
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
        marginRight: 10
    },
    addIcon: {
        fontSize: 50
    },

    filterButton: {
        backgroundColor: '#444444',
        borderRadius: 4,
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    filterButtonText: {
        color: '#BBBBBB',
    },
    filterButtonTextActive: {
        color: '#FFFFFF',
    },
    filterButtonActive: {
        backgroundColor: '#006CD8',
        borderRadius: 4,
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    filterButtonTabImg: {
        marginHorizontal: 10,
    },
    filterButtonImg: {
        margin: 5
    },
});