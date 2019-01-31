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
    PixelRatio
} from 'react-native';
import { WebBrowser, Icon, Constants } from 'expo';
import * as firebase from 'firebase';
import { Grow } from '../components/Grow';
import { FadeSpin } from '../components/FadeSpin';
import { MonoText } from '../components/StyledText';
import NavigationService from '../components/NavigationService';
import TabBarIcon from '../components/TabBarIcon';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        user: null,
        loading: false,
        showMenu: false,
        rotateAnim: new Animated.Value(0),  // Initial value for opacity: 0
        visible: true
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

        this.setState({
            visible: !this.state.visible,
        });

    }
    logoff() {
        NavigationService.navigate('Profile', { Id: '1' });
        //firebase.auth().signOut().then(function () {
        //    // Sign-out successful.
        //this.setState({
        //    showMenu: !this.state.showMenu
        //});
        //DeviceEventEmitter.emit('showMenu', { show: this.state.showMenu });
        //}, function (error) {
        //    // An error happened.
        //});
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


            if (userdata.providerId === "facebook.com") {
                avatar = <Image source={{ uri: userdata.photoURL + '?type=large' }} style={styles.profile} />;
            } else if (userdata.photoURL !== null) {
                avatar = <Image source={{ uri: userdata.photoURL }} style={styles.profile} />;
            } else {
                avatar = <Image source={require('../assets/images/avatar.png')} style={styles.profile} />;
            }
        }
        return (
            <View style={styles.searchbar}>

                <View style={styles.logobox}>
                    <TouchableHighlight onPress={() => NavigationService.navigate('App')}>
                        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                    </TouchableHighlight>
                </View>
                <View style={styles.searchbox}>
                    <Image source={require('../assets/images/search-icon.png')} style={styles.searchicon} />
                    <TextInput
                        style={styles.inputsearch}
                        onChangeText={(text) => this.setState({ text })}
                    />
                </View>
                <TouchableHighlight underlayColor="transparent" onPress={() => this.showMenu()} style={styles.profileitem}>
                    <View style={styles.profilebox}>
                        <FadeSpin style={styles.profile} visible={visible}>
                            {avatar}
                        </FadeSpin>
                        <FadeSpin style={styles.profile} visible={!visible}>
                            <TabBarIcon
                                name={'ios-close'}
                                type={'Ionicons'}
                                style={styles.closeBtn}
                            />
                        </FadeSpin>
                    </View>
                </TouchableHighlight>

                <Grow style={styles.profile} visible={!visible}>
                    <View style={styles.showMenu}>
                        <Text>Menu</Text>
                        <Text>Menu</Text>
                        <Text>Menu</Text>
                        <Text>Menu</Text>
                        <Text>Menu</Text>
                        <Text>Menu</Text>
                    </View>
                </Grow>
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
        flex: 1,
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
    showMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: 1000,
        height: 1000,
        backgroundColor: '#006CD8',
        zIndex: 100,
        borderRadius: 1000,
        transform: [{ translateY: -500 }, { translateX: 0 }]
    }
});

