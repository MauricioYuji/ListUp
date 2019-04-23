import React from 'react';
//import * as firebase from 'firebase';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    TouchableHighlight,
    DeviceEventEmitter,
    AsyncStorage,
    Animated,
    PixelRatio,
    Dimensions
} from 'react-native';
import { WebBrowser, Icon, Constants } from 'expo';
import * as firebase from 'firebase';
import { Grow } from '../../components/animations/Grow';
import { FadeSpin } from '../../components/animations/FadeSpin';
import { MonoText } from '../../components/UI/StyledText';
import NavigationService from '../../components/services/NavigationService';
import TabBarIcon from '../../components/UI/TabBarIcon';
import { setData } from '../../components/services/baseService';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        const { height, width } = Dimensions.get('window');
    }


    state = {
        consoles: [],
        consolesActive: [],
        genres: [],
        genresActive: [],
        searchText: "",
        loading: false,
        showMenu: false,
        rotateAnim: new Animated.Value(0),  // Initial value for opacity: 0
        visible: false,
        selectMode: false
    };
    componentWillMount() {
        this.getFilters();
    }
    componentDidMount() {

        DeviceEventEmitter.addListener('hideFilter', (data) => {
            if (data) {
                this.actionMenu(false);
            }
        });

        DeviceEventEmitter.addListener('selectMode', (data) => {
            if (data) {
                this.setState({ selectMode: true });
            } else {
                this.setState({ selectMode: false });
            }
        });
        DeviceEventEmitter.addListener('confirmDelete', (data) => {
            if (data) {
                this.setState({ selectMode: false });
            }
        });
    }
    mode = new Animated.Value(0);

    toggleView = () => {
        Animated.parallel([
            Animated.timing(this.mode, {
                toValue: this.mode._value === 0 ? 1 : 0,
                duration: 300
            })
        ]).start(() => {
            // callback
        });

    };
    actionMenu(flag) {
        if (this.mode._value !== 0)
            this.toggleView();

        this.setState({
            visible: flag,
        });

    }
    showMenu() {

        this.toggleView();
        this.setState({
            visible: !this.state.visible,
        });

    }
    getFilters = async () => {

        let consoles = [];
        let objarray = [];
        let genresarray = [];
        let list = require('../../files/consoles.json');
        for (var keyconsole in list.Consoles) {
            var consoleitem = list.Consoles[keyconsole];
            consoleitem.key = keyconsole;
            consoles.push(consoleitem);
        }
        for (var k in list.Companies) {
            var item = list.Companies[k];
            objarray.push(item);

            var result = consoles.filter(p => p.keycompany === k);
            for (let j = 0; j < result.length; j++) {
                objarray.push(result[j]);
            }
        }
        for (var keygenre in list.Genres) {
            var genre = list.Genres[keygenre];
            genre.key = keygenre;
            genresarray.push(genre);
        }

        this.setState({
            consoles: objarray,
            genres: genresarray
        });
    }

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
    ActiveGenre(key) {
        var _self = this;
        var list = this.state.genresActive;
        var genres = this.state.genres;

        if (list.includes(key))
            list = this.arrayRemove(list, [key]);
        else
            list.push(key);

        _self.setState({ genresActive: list },
            () => {
                _self._submitFilter();
            }
        );

    }

    ActiveConsole(key, multiple) {
        var _self = this;
        var list = this.state.consolesActive;
        var consoles = this.state.consoles;
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
                _self._submitFilter();
            }
        );

    }
    _submitFilter = async () => {
        DeviceEventEmitter.emit('getFilter', { search: this.state.searchText, consoles: this.state.consolesActive, genres: this.state.genresActive });
    }
    _submitSearch = async (text) => {
        var _self = this;
        _self.setState({ searchText: text },
            () => {
                _self._submitFilter();
            }
        );
    }
    _cleanSearch = async () => {
        this.textInput.clear();

        var _self = this;
        _self.setState({ searchText: "" },
            () => {
                _self._submitFilter();
            }
        );
    }
    _cleanFilter = async () => {

        var _self = this;
        _self.setState({ consolesActive: [] },
            () => {
                _self._submitFilter();
            }
        );
    }
    _cleanGenre = async () => {

        var _self = this;
        _self.setState({ genresActive: [] },
            () => {
                _self._submitFilter();
            }
        );
    }
    deleteElements = () => {
        var _self = this;
        _self.props.callbackDelete();
    }
    cancelDelete = () => {
        var _self = this;

        DeviceEventEmitter.emit('selectMode', false);
    }
    addElements = () => {
        var _self = this;
        _self.setState({ selectMode: false },
            () => {
                _self.props.callbackAdd();
            }
        );
    }
    editElements = () => {
        var _self = this;
        _self.setState({ selectMode: false },
            () => {
                _self.props.callbackEdit();
            }
        );
    }
    listGenres = () => {
        let obj = [];
        let objarray = this.state.genres;
        let filteractive = this.state.genresActive;


        for (let j = 0; j < objarray.length; j++) {
            var styleclass = null;
            var imgcolor = null;
            if (filteractive.includes(objarray[j].key)) {
                styleclass = styles.filterButtonActive;
                imgcolor = styles.filterButtonTextActive;
            } else {
                styleclass = styles.filterButton;
                imgcolor = styles.filterButtonText;
            }
            obj.push(
                <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveGenre(objarray[j].key)} key={objarray[j].name} style={[styleclass]}>
                    <View>
                        <Text style={imgcolor}>{objarray[j].name}</Text>
                    </View>
                </TouchableHighlight>);

        }
        return obj;
    }
    listPlatforms = () => {
        let obj = [];
        let objarray = this.state.consoles;
        let filteractive = this.state.consolesActive;


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
    cleanPlatformsRender = () => {
        let obj = [];
        let filteractive = this.state.consolesActive;
        if (filteractive.length > 0) {
            return (
                <TouchableHighlight onPress={() => this._cleanFilter()}>
                    <Text style={styles.cleanFilter}>LIMPAR</Text>
                </TouchableHighlight>
            );
        } else {
            return null;
        }
    }
    cleanGenreRender = () => {
        let obj = [];
        let filteractive = this.state.genresActive;
        if (filteractive.length > 0) {
            return (
                <TouchableHighlight onPress={() => this._cleanGenre()}>
                    <Text style={styles.cleanFilter}>LIMPAR</Text>
                </TouchableHighlight>
            );
        } else {
            return null;
        }
    }
    cleanSearchRender = () => {
        let obj = [];
        let filteractive = this.state.searchText;
        if (filteractive.length > 0) {
            return (
                <TouchableHighlight underlayColor="transparent" onPress={() => this._cleanSearch()} style={styles.cleanSearch}>
                    <TabBarIcon
                        name={'close'}
                        type={'FontAwesome'}
                        style={styles.closeIcon}
                    />
                </TouchableHighlight>
            );
        } else {
            return null;
        }
    }
    render() {

        const height = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [60, Dimensions.get('window').width / 2]
        });
        const genresactive = this.state.genresActive;
        const consolesactive = this.state.consolesActive;
        const visible = this.state.visible;
        let { rotateAnim } = this.state;
        if (this.props.type == "search") {
            return (
                <Animated.View style={[styles.searchbar, { height }]}>
                    <View style={styles.searchbox}>
                        <TabBarIcon
                            size={26}
                            name={'search'}
                            type={'FontAwesome'}
                            style={styles.searchicon}
                        />
                        <TextInput
                            style={styles.inputsearch}
                            onChangeText={(text) => this._submitSearch(text)}
                            ref={input => { this.textInput = input }}
                        />
                        {this.cleanSearchRender()}
                    </View>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.showMenu()} style={styles.profileitem}>
                        <View style={styles.profilebox}>
                            <TabBarIcon
                                size={26}
                                name={'filter'}
                                type={'FontAwesome'}
                                style={styles.filterIcon}
                            />
                        </View>
                    </TouchableHighlight>

                    <View style={[styles.sidemenu, visible ? '' : styles.hide]}>
                        <View style={styles.labelBox}>
                            <Text style={styles.filterLabel}>PLATAFORMAS</Text>
                            {this.cleanPlatformsRender()}
                        </View>
                        <ScrollView style={styles.menuContent} horizontal={true}>
                            {this.listPlatforms()}
                        </ScrollView>

                        <View style={styles.labelBox}>
                            <Text style={styles.filterLabel}>GENEROS</Text>
                            {this.cleanGenreRender()}
                        </View>
                        <ScrollView style={styles.menuContent} horizontal={true}>
                            {this.listGenres()}
                        </ScrollView>
                    </View>
                </Animated.View>
            );
        } else{
            return (
                <View style={[styles.searchbar]}>
                    <View style={[styles.flexGroupMax, styles.flexLeft]}>
                        {this.props.back && !this.state.selectMode ?
                            (<TouchableHighlight underlayColor="transparent" onPress={() => NavigationService.goback()} style={styles.sideIcon}>
                                <TabBarIcon
                                    name={'ios-arrow-back'}
                                    type={'Ionicons'}
                                    style={styles.backButton}
                                />
                            </TouchableHighlight>) :
                            (<TouchableHighlight underlayColor="transparent" onPress={() => this.cancelDelete()} style={styles.sideIcon}>
                                <TabBarIcon
                                    name={'close'}
                                    type={'MaterialCommunityIcons'}
                                    style={styles.backButton}
                                />
                            </TouchableHighlight>
                            )
                        }
                    </View>
                    <View style={[styles.flexGroupMax, styles.labelArea]}>
                        <Text style={styles.labelTitle}>{this.props.label}</Text>
                        <Text style={styles.labelDetail}>{this.props.detail}</Text>
                    </View>
                    <View style={[styles.flexGroupMax, styles.flexRight]}>

                        {this.props.itens}

                    </View>
                </View>
            );
        }
    }


}

const styles = StyleSheet.create({
    flexGroupMax: {
        flex: 1
    },
    flexGroupMin: {
        flex: 0
    },
    labelArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sideIcon: {
        padding: 5
    },
    flexLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flexRight: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
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

    backIcon: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10
    },
    backButton: {
        fontSize: 40
    },
    searchbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 60,
        //overflow: 'hidden',
        //backgroundColor: 'rgba(255, 255, 255, 0.0)',
        backgroundColor: '#333',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    cleanFilter: {
        fontSize: 12,
        color: '#FFF'
    },
    filterButtonTab: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        height: 30
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
    filterLabel: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    filterIcon: {

    },
    labelBox: {
        width: Dimensions.get('window').width,
        height: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10
    },
    menushow: {
        height: Dimensions.get('window').width / 2,
    },
    profileitem: {
        height: 40,
        zIndex: 100
    },
    menu: {
        backgroundColor: '#FFF',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: 100,
        zIndex: 99
    },
    logo: {
        flex: 0,
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
        width: 65,
        height: 24
    },
    searchicon: {
        position: 'absolute',
        top: 15,
        left: 20,
        color: '#FFF',
        zIndex: 0
    },
    cleanSearch: {
        position: 'absolute',
        top: 15,
        right: 10,
        zIndex: 1000
    },
    closeIcon: {
        color: '#FFF',
    },
    inputsearch: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        position: 'relative',
        borderRadius: 20,
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        paddingLeft: 40,
        paddingRight: 40,
        color: '#FFF'
    },
    logobox: {
        flex: 0,
        marginLeft: 10
    },
    searchbox: {
        flex: 1,
    },
    profilebox: {
        flex: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
        position: 'relative',
        overflow: 'hidden',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
    },
    profile: {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    },
    closeBtn: {
        fontSize: 40,
        color: '#FFF'
    },
    sidemenu: {
        position: 'absolute',
        top: 60,
        right: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width / 3,
        overflow: 'hidden'
    },
    hide: {
        width: 0,
        height: 0
    },
    showMenu: {
        position: 'absolute',
        top: -Dimensions.get('window').width,
        right: -Dimensions.get('window').width / 2,
        width: Dimensions.get('window').width * 2,
        height: Dimensions.get('window').width * 2,
        backgroundColor: '#006CD8',
        zIndex: 100,
        borderRadius: Dimensions.get('window').width * 2,
        //transform: [{ translateY: -Dimensions.get('window').height / 2 }, { translateX: Dimensions.get('window').height / 4 }]
        //top: 0,
        //right: 0,
        //width: Dimensions.get('window').width,
        //height: Dimensions.get('window').width,
    },
    menuArea: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    contentMenu: {
        position: 'absolute',
        //right: Dimensions.get('window').width / 4,
        left: Dimensions.get('window').width / 2,
        top: Dimensions.get('window').width,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width / 3,
        alignSelf: 'flex-end',
        flex: 1,
        paddingTop: 40,
    },
    scrollarea: {
        flex: 1,
        position: 'relative',
    },
    menuContent: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width / 3 - 40,
        //position: 'absolute',
        //top: 50,
        //left: 0,
        zIndex: 10000000000,
    },
    menuItem: {
        width: Dimensions.get('window').width / 4 - 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    menuIcon: {
        fontSize: 30,
        color: '#FFF',
        marginBottom: 10
    },
    menuLabel: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'SourceSansPro-Bold'
    }
});

