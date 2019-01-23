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
    DeviceEventEmitter
} from 'react-native';
import { AppLoading, Asset, Font, Icon, Constants } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Header from './navigation/Header';
import Layout from './constants/Layout';

import * as firebase from 'firebase';
import LoginScreen from './screens/LoginScreen';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCFC4YSALGezCekcoPVY42gPGUKcQsmfD0",
    authDomain: "teste-925f4.firebaseapp.com",
    databaseURL: "https://teste-925f4.firebaseio.com",
    projectId: "teste-925f4",
    storageBucket: "teste-925f4.appspot.com",
    messagingSenderId: "245054025436"
};

firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
        showHeader: true,
        logged: false
    };
    _storeData = async (test) => {
        try {
            await AsyncStorage.setItem('tasks', test);
        } catch (error) {
            // Error saving data
        }
    }
    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('tasks');
            if (value !== null) {
                // We have data!!
                this.setState({ test: value });
                console.log(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    }
    componentWillMount() {
        //this._storeData('asd');
        //this._retrieveData();

        DeviceEventEmitter.addListener('eventKey', (data) => {
            //console.log("data: ", data);
            this.setState({ showHeader: data.showHeader });
        });
        DeviceEventEmitter.addListener('login', (data) => {
            //console.log("data: ", data);
            this.setState({ logged: data.logged });
        });
    }
    test() {
        this._storeData('123');
        this.setState({ showHeader: !this.state.showHeader });
    }
    render() {
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
                    <LoginScreen />
                </ScrollView>
            );
        } else {
            return (
                <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'>
                    <StatusBar barStyle="default" />
                    <AppNavigator />
                    {header}
                </ScrollView>
            );
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
                'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#000',
    },
    header: {
        zIndex: 100,
    },
});
