import React from 'react';
import { LinearGradient } from 'expo';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    Image,
    DeviceEventEmitter
} from 'react-native';
import NavigationService from '../services/NavigationService';



export default class GameItem extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        key: "",
        selected: false,
        selectMode: false,
    };

    componentDidMount() {
        var _self = this;
        DeviceEventEmitter.emit('reloading', true);
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
                    _self.props.callback(_self.props.obj.key);
                }
            );
        } else {
            NavigationService.navigate("List", { key: this.props.id });
        }
    }
    allowSelect() {
        var _self = this;
        _self.setState({ selected: !this.state.selected },
            () => {
                _self.props.callback(_self.props.obj.key);
                DeviceEventEmitter.emit('selectMode', true);
            }
        );

    }
    listGenres = () => {
        let obj = [];
        let objarray = this.props.obj.genres;


        for (let j = 0; j < objarray.length; j++) {
            if (j == 0) {
                obj.push(
                    <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveGenre(objarray[j].key)} key={objarray[j].name}>
                        <Text style={[styles.genreText]}>{objarray[j].name}</Text>
                    </TouchableHighlight>);
            } else {
                obj.push(
                    <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveGenre(objarray[j].key)} key={objarray[j].name}>
                        <Text style={[styles.genreText]}> - {objarray[j].name}</Text>
                    </TouchableHighlight>);
            }

        }
        return obj;
    }
    listPlatforms = () => {
        let obj = [];
        let objarray = this.props.obj.userConsoles;


        for (let j = 0; j < objarray.length; j++) {
            obj.push(
                <TouchableHighlight underlayColor="transparent" key={objarray[j].name} style={[styles.filterButton]}>
                    <View>
                        <Image source={{ uri: objarray[j].img }} resizeMode={'contain'} style={[styles.filterButtonImg, { width: objarray[j].width / 7, height: objarray[j].height / 7, tintColor: '#FFFFFF' }]} />
                    </View>
                </TouchableHighlight>);
        }
        return obj;
    }
    renderThumb = (item) => {
        if (item == "" || item == null)
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'cover'} style={styles.backgroundBanner} />);
        else {
            return (<Image source={{ uri: this.props.obj.image.url }} resizeMode={'cover'} style={[styles.backgroundBanner]} />);
        }
    }
    _renderRanking() {
        if (this.props.ranking) {
            return (
                <View style={styles.itemRanking}>
                    <Text style={styles.itemRankingText}>{this.props.pos}</Text>
                </View>
            );
        } else {
            return null;
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
                    {this._renderRanking()}
                    <View style={styles.itemInfo}>
                        <Text style={styles.labelTitle}>{this.props.obj.name}</Text>
                        <View style={styles.menuContent} horizontal={true}>
                            {this.listGenres()}
                        </View>
                        <View style={styles.menuContent} horizontal={true}>
                            {this.listPlatforms()}
                        </View>
                    </View>
                    <View style={styles.thumbArea}>
                        {this.renderThumb(this.props.obj.image)}
                        <LinearGradient
                            colors={['rgba(34,34,34,0.2)', 'rgba(34,34,34,1)']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                            style={styles.backgroundOverlay}
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
    backgroundOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
    },
    backgroundBanner: {
        minHeight: 120,
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    selected: {
        borderLeftColor: '#006CD8',
        borderLeftWidth: 20,
        opacity: 0.5,
        marginRight: -20
    },
    genreText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'SourceSansPro-Black'
    },

    filterButton: {
        marginVertical: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    filterButtonImg: {
        marginRight: 5
    },
    menuContent: {
        alignItems: 'flex-start',
        flexDirection: "row",
        flexWrap: "wrap",
        paddingVertical: 10
    },
    itemRanking: {
        width: 40,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        marginTop: 20,
        backgroundColor: '#006CD8'
    },
    itemRankingText: {
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'SourceSansPro-Black'
    },
    itemInfo: {
        paddingVertical: 15,
        width: Dimensions.get('window').width - (Dimensions.get('window').width / 3) - 40,
        paddingHorizontal: 10,
    },
    labelTitle: {
        fontSize: 24,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    thumbArea: {
        width: Dimensions.get('window').width / 3,
        height: '100%',
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
    },
});