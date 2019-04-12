import React from 'react';
import { Icon, LinearGradient } from 'expo';
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
import Layout from '../../constants/Layout';
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
            img: null
        },
        selected: false,
        selectMode: false,
    };

    componentDidMount() {
        var _self = this;
        DeviceEventEmitter.emit('reloading', true);
        //this.loadData(this.props.id);
        DeviceEventEmitter.addListener('selectMode', (data) => {
            if (data) {
                _self.setState({ selectMode: true });
            } else {
                _self.setState({ selected: false, selectMode: false });
            }
        });
    }
    //loadData = (key) => {
    //    var _self = this;
    //    if (key == "") {
    //        key = this.state.key;
    //    }
    //         _self.setState({ game: this.props.obj },
    //            () => {
    //                DeviceEventEmitter.emit('reloading', false);
    //            }
    //        );
    //    //console.log("key: ", key);
    //    //getGameDetail(key).then((game) => {
    //    //    //console.log("game: ", game);
    //    //    _self.setState({ game: game },
    //    //        () => {
    //    //            DeviceEventEmitter.emit('reloading', false);
    //    //            //_self.getImages([game]);
    //    //            //_self.filterObj();
    //    //        }
    //    //    );

    //    //});
    //}
    itemAction() {
        var _self = this;
        if (this.state.selectMode) {
            _self.setState({ selected: !this.state.selected },
                () => {
                    _self.props.callback(_self.props.obj.key);
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
        let objarray = this.props.obj.consoles;


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
        //console.log("item: ", item);
        if (item == "" || item == null)
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'cover'} style={styles.backgroundBanner} />);
        else {
            return (<Image source={{ uri: this.props.obj.image.url }} resizeMode={'cover'} style={[styles.backgroundBanner]} />);
        }
    }
    //getImages = async (obj) => {
    //    for (let i = 0; i < obj.length; i++) {
    //        await getData('thumbs/' + obj[i].image.key)
    //            .then((img) => {
    //                obj[i].image.file = img.file;
    //                obj[i].image.url = img.url;
    //            });
    //    }

    //    this.setState({ games: this.props.obj });
    //}
    render() {
        let itemStyle = null;
        if (this.state.selected) {
            itemStyle = styles.selected;
        }
        console.log("this.props.obj: ", this.props.obj);
        return (
            <TouchableHighlight onLongPress={() => this.allowSelect()} onPress={() => this.itemAction()}>
                <View style={[styles.listItem, itemStyle]}>
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
                            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
                            useAngle
                            angle={180}
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
        paddingVertical: 15,
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        marginHorizontal: 5
    },
    menuContent: {
        width: Dimensions.get('window').width - 20,
        alignItems: 'flex-start',
        flexDirection: "row",
        flexWrap: "wrap",
        paddingVertical: 10
    },
    itemInfo: {
        width: Dimensions.get('window').width - (Dimensions.get('window').width / 3),
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
        width: (Dimensions.get('window').width / 3),
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