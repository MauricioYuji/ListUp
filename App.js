import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    ScrollView,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    Button,
    AsyncStorage,
    DeviceEventEmitter,
    LayoutAnimation,
    Animated,
    ImageBackground,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import { AppLoading, Asset, Font, Icon, Constants } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Auth from './navigation/AuthNavigator';
import Header from './screens/Shared/Header';
import Layout from './constants/Layout';
import { setData, getData } from './components/services/Service';

import * as firebase from 'firebase';
import LoginScreen from './screens/Auth/LoginScreen';
import NavigationService from './components/services/NavigationService';
import Tutorial from './screens/Tutorial/Tutorial';
import { BaseNavigator } from "./src/navigation";


// Initialize Firebase

firebase.initializeApp(Constants.manifest.extra.firebase);


export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
        skipLoadingScreen: false,
        showHeader: true,
        logged: false,
        user: null,
        showMenu: false,
    };

    componentWillMount() {

        //// Listen for authentication state to change.
        //firebase.auth().onAuthStateChanged((user) => {
        //    if (user != null && (user.emailVerified || user.providerData[0].providerId === "facebook.com")) {
        //        this._storeUser(JSON.stringify(user));
        //        this.setState({ logged: true });
        //    } else {
        //        this.setState({ logged: false });
        //        this._deleteUser();
        //    }
        //    this._getUser();

        //    this.setState({ isLoadingComplete: true, user });

        //    // Do other things
        //});

        //this._storeData('asd');
        //this._retrieveData();

        //DeviceEventEmitter.addListener('eventKey', (data) => {
        //    //console.log("data: ", data);
        //    this.setState({ showHeader: data.showHeader });
        //});
        //DeviceEventEmitter.addListener('showMenu', (data) => {
        //    //console.log("data: ", data);
        //    this.setState({ showMenu: data.show });
        //});


        DeviceEventEmitter.addListener('updateUser', (data) => {
            //console.log("data: ", data);
            this._updateUser(data.user);
            NavigationService.navigate('App');
        });

    }
    componentDidMount() {


        LayoutAnimation.easeInEaseOut();
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
            //console.log("value: ", value);
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
    _doneTutorial = () => {

        var user = firebase.auth().currentUser;

        var newuser = {
            uid: user.uid,
            photoURL: user.photoURL,
            displayName: user.displayName,
            email: user.email,
            flagtutorial: true
        };
        this._updateUser(newuser);
    };
    _updateUser = (user) => {
        setData('UserInfo/' + user.uid, user).then((p) => {
            this.setState({ user: user });
        });
    };
    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/logo.png'),
                require('./assets/images/search-icon.png'),
                require('./assets/images/background.png'),
                require('./assets/images/tutorial-1.png'),
                require('./assets/images/tutorial-2.png'),
                require('./assets/images/tutorial-3.png'),
            ]),
            Font.loadAsync({
                // This is the font that we are using for our tab bar
                ...Icon.Ionicons.font,
                // We include SpaceMono because we use it in HomeScreen.js. Feel free
                // to remove this if you are not using it in your app
                'SourceSansPro-Black': require('./assets/fonts/SourceSansPro-Black.ttf'),
                'SourceSansPro-BlackItalic': require('./assets/fonts/SourceSansPro-BlackItalic.ttf'),
                'SourceSansPro-Bold': require('./assets/fonts/SourceSansPro-Bold.ttf'),
                'SourceSansPro-BoldItalic': require('./assets/fonts/SourceSansPro-BoldItalic.ttf'),
                'SourceSansPro-ExtraLight': require('./assets/fonts/SourceSansPro-ExtraLight.ttf'),
                'SourceSansPro-ExtraLightItalic': require('./assets/fonts/SourceSansPro-ExtraLightItalic.ttf'),
                'SourceSansPro-Italic': require('./assets/fonts/SourceSansPro-Italic.ttf'),
                'SourceSansPro-Light': require('./assets/fonts/SourceSansPro-Light.ttf'),
                'SourceSansPro-LightItalic': require('./assets/fonts/SourceSansPro-LightItalic.ttf'),
                'SourceSansPro-Regular': require('./assets/fonts/SourceSansPro-Regular.ttf'),
                'SourceSansPro-SemiBold': require('./assets/fonts/SourceSansPro-SemiBold.ttf'),
                'SourceSansPro-SemiBoldItalic': require('./assets/fonts/SourceSansPro-SemiBoldItalic.ttf'),
            }),
        ]);
    };

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };

    _handleFinishLoading = () => {

        firebase.auth().onAuthStateChanged((user) => {
            if (user != null && (user.emailVerified || user.providerData[0].providerId === "facebook.com")) {
                getData('UserInfo/' + user.uid).then((p) => {
                    this._storeUser(JSON.stringify(p));
                    this.setState({ logged: true, user: p, isLoadingComplete: true });
                    if (p.flagtutorial) {
                        NavigationService.navigate('App');
                    } else {
                        NavigationService.navigate('Tutorial');
                    }
                });
            } else {
                this.setState({ logged: false, isLoadingComplete: true });
                this._deleteUser();

                NavigationService.navigate('Auth');
            }
            //this._getUser();

            // Do other things
        });
    };
    render() {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            );
        } else {
            return (
                <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'>
                    <Image source={require('./assets/images/background.png')} resizeMode={'cover'} style={[styles.backgroundBanner]} />
                    <StatusBar barStyle="default" />

                    <BaseNavigator />
                </ScrollView>
            );
        }
    }
    //render() {
    //    const showMenu = this.state.showMenu;
    //    let header;
    //    if (this.state.showHeader) {
    //        header = <Header style={styles.header} />;
    //    }
    //    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
    //        return (
    //            <AppLoading
    //                startAsync={this._loadResourcesAsync}
    //                onError={this._handleLoadingError}
    //                onFinish={this._handleFinishLoading}
    //            />
    //        );
    //    } else if (!this.state.logged) {
    //        return (
    //            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}
    //                keyboardShouldPersistTaps='handled'>
    //                <Image source={require('./assets/images/background.png')} resizeMode={'cover'} style={[styles.backgroundBanner]} />
    //                <StatusBar barStyle="default" />
    //                <Auth />
    //            </ScrollView>
    //        );
    //    } else if (this.state.user != null) {
    //        //console.log("this.state.user: ", this.state.user);
    //        if (this.state.user.flagtutorial) {
    //            return (
    //                <Animated.ScrollView style={[styles.container, showMenu ? styles.showMenu : '']} contentContainerStyle={{ flexGrow: 1 }}
    //                    keyboardShouldPersistTaps='handled'>
    //                    <Image source={require('./assets/images/background.png')} resizeMode={'cover'} style={[styles.backgroundBanner]} />
    //                    <StatusBar barStyle="default" />
    //                    <AppNavigator ref={navigatorRef => {
    //                        NavigationService.setTopLevelNavigator(navigatorRef);
    //                    }} />
    //                    <Header style={styles.header} />
    //                </Animated.ScrollView>
    //            );
    //        } else {
    //            return (
    //                <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}
    //                    keyboardShouldPersistTaps='handled'>
    //                    <Image source={require('./assets/images/background.png')} resizeMode={'cover'} style={[styles.backgroundBanner]} />
    //                    <StatusBar barStyle="default" />

    //                    <TouchableOpacity onPress={() => { this._doneTutorial(); }} style={styles.skipButton}>
    //                        <Text style={styles.skipText}>Pular</Text>
    //                    </TouchableOpacity>
    //                    <Tutorial />

    //                </ScrollView>
    //            );
    //        }
    //    } else {
    //        return null;
    //    }
    //}
}

var changingTutorial = false;
const tutorialpages = ["TutorialGames", "TutorialLists", "TutorialFeed"];
const styles = StyleSheet.create({
    skipButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1
    },
    skipText: {

        fontSize: 24,
        color: '#FFF',
    },
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#000',
    },
    backgroundBanner: {
        width: '100%',
        height: Layout.window.height,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    showMenu: {
        marginRight: 200,
        marginLeft: -200
    },
    header: {
        zIndex: 100,
    }
});