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
    Animated
} from 'react-native';
import { AppLoading, Asset, Font, Icon, Constants } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Auth from './navigation/Nav';
import Header from './screens/Shared/Header';
import Layout from './constants/Layout';
import { getUserInfo } from './components/services/Service';

import * as firebase from 'firebase';
import LoginScreen from './screens/Auth/LoginScreen';
import NavigationService from './components/services/NavigationService';

// Initialize Firebase

firebase.initializeApp(Constants.manifest.extra.firebase);


export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
        skipLoadingScreen: false,
        showHeader: true,
        logged: false,
        user: null,
        showMenu: false
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

    }
    componentDidMount() {

        firebase.auth().onAuthStateChanged((user) => {
            if (user != null && (user.emailVerified || user.providerData[0].providerId === "facebook.com")) {
                this._storeUser(JSON.stringify(user));
                this.setState({ logged: true });
            } else {
                this.setState({ logged: false });
                this._deleteUser();
            }
            this._getUser();

            this.setState({ isLoadingComplete: false, user });

            // Do other things
        });

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
    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/logo.png'),
                require('./assets/images/search-icon.png'),
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
        this.setState({ isLoadingComplete: true });
    };

    render() {
        const showMenu = this.state.showMenu;
        let header;
        if (this.state.showHeader) {
            header = <Header style={styles.header} />;
        }
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            );
        } else if (!this.state.logged) {
            return (
                <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'>
                    <StatusBar barStyle="default" />
                    <Auth />
                </ScrollView>
            );
        } else {
            return (
                <Animated.ScrollView style={[styles.container, showMenu ? styles.showMenu : '']} contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'>
                    <StatusBar barStyle="default" />
                    <AppNavigator ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }} />
                    <Header style={styles.header} />
                </Animated.ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#000'
    },
    showMenu: {
        marginRight: 200,
        marginLeft: -200
    },
    header: {
        zIndex: 100,
    }
});
