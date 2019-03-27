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
import NavigationService from '../services/NavigationService';



export default class ListItem extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        selected: false,
        selectMode: false,
    };

    componentDidMount() {
        var _self = this;
        DeviceEventEmitter.addListener('selectMode', (data) => {
            if (data) {
                _self.setState({ selectMode: true });
            } else {
                _self.setState({ selected: false, selectMode: false });
            }
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
    render() {
        let itemStyle = null;
        if (this.state.selected) {
            itemStyle = styles.selected;
        }
        return (
            <TouchableHighlight onLongPress={() => this.allowSelect()} onPress={() => this.itemAction()}>
                <View style={[styles.listItem, itemStyle]}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.labelTitle}>{this.props.label}</Text>
                        <Text style={styles.labelDetail}>{this.props.games.length} jogos</Text>
                    </View>
                    <View style={styles.thumbArea}>
                        <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2F3WTL16ZI80.png?alt=media&token=b2ddc5a8-a610-4a6d-b526-f05198b23854" }} resizeMode={'cover'} style={styles.thumb} />
                        <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2F3WTL16ZI80.png?alt=media&token=b2ddc5a8-a610-4a6d-b526-f05198b23854" }} resizeMode={'cover'} style={styles.thumb} />
                        <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2F3WTL16ZI80.png?alt=media&token=b2ddc5a8-a610-4a6d-b526-f05198b23854" }} resizeMode={'cover'} style={styles.thumb} />
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