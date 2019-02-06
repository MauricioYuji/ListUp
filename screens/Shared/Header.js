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
        this._getUser().then((user) => {
            //console.log("GET user: ", user);
            this.setState({
                user: user,
                loading: true
            });
        });



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
    changePage(page, id) {
        if (id !== undefined) {
            NavigationService.navigate(page, { Id: id });
        } else {
            NavigationService.navigate(page);
        }


        this.setState({
            visible: false,
        });

    }
    logoff() {
        //NavigationService.navigate('Profile', { Id: '1' });
        //DeviceEventEmitter.emit('showMenu', { show: this.state.showMenu });
        firebase.auth().signOut().then(function () {
            // Sign-out successful.

        }, function (error) {
            // An error happened.
        });
    }
    _storeUser = async (user) => {
        try {
            await AsyncStorage.setItem('user', user);
        } catch (error) {
            // Error saving data
        }
    }

    _deleteUser = async () => {
        try {
            await AsyncStorage.removeItem('user');
        } catch (error) {
            // Error saving data
        }
    }
    _getUser = async () => {
        try {
            const value = await AsyncStorage.getItem('user');
            return JSON.parse(value);
            //if (value !== null) {
            //    // We have data!!
            //    //this.setState({ test: value });
            //    this.setState({ user: JSON.parse(value) });

            //}
        } catch (error) {
            // Error retrieving data
        }
    }
    render() {
        const visible = this.state.visible;
        let { rotateAnim } = this.state;

        let rotation = rotateAnim.interpolate({
            inputRange: [false, true],
            outputRange: ["0deg", "450deg"] // degree of rotation
        });
        const user = this.state.user;
        let avatar;
        if (user !== null) {
            const userdata = this.state.user.providerData[0];
            //console.log("userdata: ", userdata);

            if (userdata.providerId === "facebook.com") {
                avatar = <Image source={{ uri: userdata.photoURL + '?type=large' }} style={styles.profile} />;
            } else if (userdata.photoURL !== null) {
                avatar = <Image source={{ uri: userdata.photoURL }} style={styles.profile} />;
            } else {
                avatar = <Image source={require('../../assets/images/avatar.png')} style={styles.profile} />;
            }
        }
        return (
            <View style={[styles.searchbar, visible ? styles.menushow : '']}>

                <View style={styles.logobox}>
                    <TouchableHighlight underlayColor="transparent" onPress={() => NavigationService.navigate('App')}>
                        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                    </TouchableHighlight>
                </View>
                <View style={styles.searchbox}>
                    <Image source={require('../../assets/images/search-icon.png')} style={styles.searchicon} />
                    <TextInput
                        style={styles.inputsearch}
                        onChangeText={(text) => this.setState({ text })}
                    />
                </View>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.showMenu()} style={styles.profileitem}>
                    <View style={styles.profilebox}>
                        <FadeSpin style={styles.profile} visible={!visible}>
                            {avatar}
                        </FadeSpin>
                        <FadeSpin style={styles.profile} visible={visible}>
                            <TabBarIcon
                                name={'ios-close'}
                                type={'Ionicons'}
                                style={styles.closeBtn}
                            />
                        </FadeSpin>
                    </View>
                </TouchableHighlight>

                <View style={[styles.sidemenu, visible ? '' : styles.hide]}>
                    <Grow style={styles.menuArea} visible={visible}>
                        <View style={styles.showMenu}>
                            <View style={styles.contentMenu}>
                                <View style={styles.scrollarea}>
                                </View>
                            </View>
                        </View>
                    </Grow>

                    <ScrollView style={styles.menuContent} horizontal={true}>
                        <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Profile', this.state.user.uid)}>
                            <View>
                                <TabBarIcon
                                    name={'user-o'}
                                    type={'FontAwesome'}
                                    style={styles.menuIcon}
                                />
                                <Text style={styles.menuLabel}>Perfil</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Edit')}>
                            <View style={styles.menuItem}>
                                <TabBarIcon
                                    name={'settings'}
                                    type={'MaterialIcons'}
                                    style={styles.menuIcon}
                                />
                                <Text style={styles.menuLabel}>Editar</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.menuItem} onPress={() => this.logoff()}>
                            <View style={styles.menuItem}>
                                <TabBarIcon
                                    name={'logout'}
                                    type={'MaterialCommunityIcons'}
                                    style={styles.menuIcon}
                                />
                                <Text style={styles.menuLabel}>Logout</Text>
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    menushow: {
        height: Dimensions.get('window').width / 3,
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
        top: 20,
        left: 10,
        width: 24,
        height: 20,
        zIndex: 0
    },
    inputsearch: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        position: 'relative',
        borderRadius: 20,
        height: 40,
        marginTop: 10,
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
        backgroundColor: '#006CD8',
        margin: 10,
        position: 'relative',
        overflow: 'hidden',
        marginRight: 10,
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
        top: 0,
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
        position: 'absolute',
        top: 40,
        left: 0,
        zIndex: 10000000000,
    },
    menuItem: {
        width: Dimensions.get('window').width / 4 - 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
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

