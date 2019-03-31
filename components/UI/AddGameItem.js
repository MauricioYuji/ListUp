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



export default class AddGameItem extends React.Component {

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

    renderThumb = (item) => {
        console.log("item: ", item);
        if (item.key == "" || item.file == null)
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'cover'} style={styles.thumb} />);
        else {
            return (<Image source={{ uri: item.url }} resizeMode={'cover'} style={styles.thumb} />);
        }
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
                        {this.renderThumb(this.props.img)}
                        <View>
                            <Text style={styles.labelTitle}>{this.props.label}</Text>
                        </View>
                    </View>
                    <View style={styles.thumbArea}>
                        <TabBarIcon
                            name={'add'}
                            type={'MaterialIcons'}
                            style={styles.addIcon}
                        />
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
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
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
        flex: 0
    },
    thumb: {
        width: 60,
        height: 90,
        marginLeft: 2
    },
});