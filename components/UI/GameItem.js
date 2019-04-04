import React from 'react';
import { Icon } from 'expo';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';
import * as firebase from 'firebase';
import TabBarIcon from '../UI/TabBarIcon';
import { getData, setData, insertData } from '../services/baseService';
import { getGameDetail } from '../services/Service';
import NavigationService from '../services/NavigationService';



export default class GameItem extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        key: "",
        game: {
            name: "",
            file: {
                image: null
            }
        },
        selected: false,
        selectMode: false,
    };

    componentDidMount() {
        var _self = this;
        //console.log("this.props.id: ", this.props.id);

        DeviceEventEmitter.emit('reloading', true);
        this.loadData(this.props.id);
        DeviceEventEmitter.addListener('selectMode', (data) => {
            if (data) {
                _self.setState({ selectMode: true });
            } else {
                _self.setState({ selected: false, selectMode: false });
            }
        });
    }
    loadData = (key) => {
        var _self = this;
        if (key == "") {
            key = this.state.key;
        }
        //console.log("key: ", key);
        getGameDetail(key).then((game) => {
            //console.log("game: ", game);
            _self.setState({ game: game },
                () => {
                    DeviceEventEmitter.emit('reloading', false);
                    //_self.getImages([game]);
                    //_self.filterObj();
                }
            );

        });
    }
    itemAction() {
        var _self = this;
        if (this.state.selectMode) {
            _self.setState({ selected: !this.state.selected },
                () => {
                    _self.props.callback(_self.props.id);
                }
            );
        } else {
            console.log("GO TO PAGE: ", this.props.id);
            NavigationService.navigate("List", { key: this.props.id });
        }
    }
    allowSelect() {
        var _self = this;
        _self.setState({ selected: !this.state.selected },
            () => {
                _self.props.callback(_self.props.id);
                DeviceEventEmitter.emit('selectMode', true);
            }
        );

    }

    renderThumb = (item) => {
        //console.log("item: ", item);
        if (item == "" || item == null)
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'cover'} style={styles.thumb} />);
        else {
            return (<Image source={{ uri: item.url }} resizeMode={'cover'} style={styles.thumb} />);
        }
    }
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
    render() {
        let itemStyle = null;
        if (this.state.selected) {
            itemStyle = styles.selected;
        }
        return (
            <TouchableHighlight onLongPress={() => this.allowSelect()} onPress={() => this.itemAction()}>
                <View style={[styles.listItem, itemStyle]}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.labelTitle}>{this.state.game.name}</Text>
                    </View>
                    <View style={styles.thumbArea}>
                        {this.renderThumb(this.state.game.file.image)}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}
const styles = StyleSheet.create({
    listItem: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222222"
    },
    selected: {
        backgroundColor: '#006CD8',
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
});