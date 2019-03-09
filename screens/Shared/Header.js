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
import { setData } from '../../components/services/Service';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        const { height, width } = Dimensions.get('window');
    }
    state = {
        user: null,
        loading: false,
        showMenu: false,
        rotateAnim: new Animated.Value(0),  // Initial value for opacity: 0
        visible: false
    };
    componentWillMount() {

        //firebase.auth().onAuthStateChanged((user) => {
        //    console.log("AUTH CHANGE: ", user);
        //    if (user != null && (user.emailVerified || user.providerData[0].providerId === "facebook.com")) {
        //        this._storeUser(JSON.stringify(user));
        //        this.setState({
        //            user: user,
        //            loading: true
        //        });
        //    } else {
        //        this._deleteUser();
        //        this.setState({
        //            loading: false
        //        });
        //    }

        //    ////this.setState({ isLoadingComplete: true, user });

        //    //// Do other things
        //});

    }
    componentDidMount() {

    }
    showMenu() {
        //console.log("===========================");
        //console.log("start .rotateAnim: ", this.state.rotateAnim);

        //const value = this.state.rotateAnim == 1? 0: 1;

        //Animated.timing(                  // Animate over time
        //    this.state.rotateAnim,            // The animated value to drive
        //    {
        //        toValue: value,                   // Animate to opacity: 1 (opaque)
        //        duration: 1000,              // Make it take a while
        //    }
        //).start();

        //this.setState({
        //    rotateAnim: new Animated.Value(value),
        //});
        //console.log("value: ", value);
        //console.log("this.state.rotateAnim: ", this.state.rotateAnim);

        //var user = null;
        //    this._getUser().then((res) => {
        //        user = res;
        //        var obj = ['-LVi3nkMK28C1386Ibau', '-LVi3nkaJdwErn95GnuB', '-LVi3nl2QoVMIiPLn2cp', '-LVi3nlEPgIjsGXRef5h'];
        //        setData('/userGames/'+user.uid, obj)
        //            .then((res) => {
        //                // console.log("res: ", res);

        //            });
        //});

        this.setState({
            visible: !this.state.visible,
        });

    }
    filterActive(key, multiple) {
        console.log("key: ", key);
        console.log("multiple: ", multiple);


        //this.setState({
        //    visible: false,
        //});

    }

    _submitFilter = async (text) => {
        DeviceEventEmitter.emit('getFilter', { show: text });
    }

    listPlatforms = () => {
        let obj = [];
        let consoles = [];
        let list = require('../../files/consoles.json');


        for (var keyconsole in list.Consoles) {
            var consoleitem = list.Consoles[keyconsole];
            consoleitem.keyconsole = keyconsole;
            consoles.push(consoleitem);
        }

        //console.log("list: ", list);
        for (var key in list.Companies) {
            var item = list.Companies[key];
            //console.log("item: ", item);
            obj.push(
                <TouchableHighlight onPress={() => this.filterActive(key, true)} key={key} style={styles.filterButtonTab}>
                    <View>
                        <Image source={{ uri: item.img }} resizeMode={'contain'} style={[styles.filterButtonTabImg, { width: item.width / 3, height: item.height / 3 }]} />
                    </View>
                </TouchableHighlight>
            );

            var result = consoles.filter(p => p.keycompany === item.key);
            //console.log("consoles: ", result);

            for (let j = 0; j < result.length; j++) {
                //console.log("result[j]: ", result[j]);
                obj.push(
                    <TouchableHighlight onPress={() => this.filterActive(result[j].keyconsole, false)} key={j + result[j].keyconsole} style={[styles.filterButton]}>
                        <View>
                            <Image source={{ uri: result[j].img }} resizeMode={'contain'} style={[styles.filterButtonImg, { width: result[j].width / 5, height: result[j].height / 5 }]} />
                        </View>
                    </TouchableHighlight>);
            }

        }
        //console.log("===========================");
        // Outer loop to create parent
        //for (let i = 0; i < item.length; i++) {
        //    obj.push(<Image key={i} source={{ uri: item[i].img }} resizeMode={'contain'} style={styles.logo} />);
        //}
        //console.log("obj: ", obj);
        return obj;
    }
    render() {
        const visible = this.state.visible;
        let { rotateAnim } = this.state;

        let rotation = rotateAnim.interpolate({
            inputRange: [false, true],
            outputRange: ["0deg", "450deg"] // degree of rotation
        });
        //const user = this.state.user;
        //let avatar;
        //if (user !== null) {
        //    const userdata = this.state.user;
        //    //console.log("userdata: ", userdata);

        //    if (userdata.providerId === "facebook.com") {
        //        avatar = <Image source={{ uri: userdata.photoURL + '?type=large' }} style={styles.profile} />;
        //    } else if (userdata.photoURL !== null) {
        //        avatar = <Image source={{ uri: userdata.photoURL }} style={styles.profile} />;
        //    } else {
        //        avatar = <Image source={require('../../assets/images/avatar.png')} style={styles.profile} />;
        //    }
        //}
        return (
            <View style={[styles.searchbar, visible ? styles.menushow : '']}>
                <View style={styles.searchbox}>
                    <TabBarIcon
                        name={'search'}
                        type={'FontAwesome'}
                        style={styles.searchicon}
                    />
                    <TextInput
                        style={styles.inputsearch}
                        onChangeText={(text) => this._submitFilter(text)}
                    />
                </View>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.showMenu()} style={styles.profileitem}>
                    <View style={styles.profilebox}>
                        <TabBarIcon
                            name={'filter'}
                            type={'FontAwesome'}
                            style={styles.filterIcon}
                        />
                    </View>
                </TouchableHighlight>

                <View style={[styles.sidemenu, visible ? '' : styles.hide]}>
                    <Text style={styles.filterLabel}>PLATAFORMAS</Text>
                    <ScrollView style={styles.menuContent} horizontal={true}>
                        {this.listPlatforms()}
                    </ScrollView>
                    <Text style={styles.filterLabel}>GENEROS</Text>
                    <ScrollView style={styles.menuContent} horizontal={true}>

                        <TouchableHighlight style={styles.menuItem} onPress={() => this.showMenu()}>
                            <View>
                                <TabBarIcon
                                    name={'user-o'}
                                    type={'FontAwesome'}
                                    style={styles.menuIcon}
                                />
                                <Text style={styles.menuLabel}>Perfil</Text>
                            </View>
                        </TouchableHighlight>
                    </ScrollView>
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    searchbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 60,
        overflow: 'hidden',
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
    menushow: {
        height: Dimensions.get('window').width / 2,
    },
    profileitem: {
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
    inputsearch: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        position: 'relative',
        borderRadius: 20,
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        paddingLeft: 40,
        paddingRight: 10,
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
        zIndex:1000
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

