import React from 'react';
import {
    StatusBar,
    StyleSheet,
    ScrollView,
    View,
    AsyncStorage,
    DeviceEventEmitter,
    LayoutAnimation,
    Animated,
    Image,
    Modal,
    ActivityIndicator
} from 'react-native';
import { AppLoading, Asset, Font, Icon, Constants } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Auth from './navigation/AuthNavigator';
import Layout from './constants/Layout';
import { updateData, getData } from './components/services/baseService';
import { getUser, deleteUser, storeUser } from './components/services/AuthService';
import * as firebase from 'firebase';
import NavigationService from './components/services/NavigationService';


// Initialize Firebase

firebase.initializeApp(Constants.manifest.extra.firebase);


export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
        skipLoadingScreen: false,
        loading: false
    };

    componentWillMount() {

        DeviceEventEmitter.addListener('reloading', (data) => {
            console.log("SET DATA: ", data);
            this.setState({ loading: data });
        });
        DeviceEventEmitter.addListener('setUser', (data) => {

            storeUser(data).then(p => {
                this._checkLogin(p);
            });
            ////console.log("data: ", data);
            //if (data != null) {
            //    storeUser(data).then(p => {
            //        console.log("p: ", p);
            //        NavigationService.navigate('App');
            //    });
            //} else {
            //    NavigationService.navigate('Auth');
            //}
        });

    }
    componentDidMount() {
        LayoutAnimation.easeInEaseOut();

    }
    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/console-icon.png'),
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
        console.warn(error);
    };
    _checkLogin = (data) => {
        this.setState({ isLoadingComplete: true });
        if (data != null) {
            var obj = JSON.parse(data);
            console.log("obj: ", obj);
            if (obj.flagtutorial) {
                NavigationService.navigate('App');
            } else {
                NavigationService.navigate('Tutorial');
            }
        } else {
            console.log("SEM USER");
            NavigationService.navigate('Auth');
        }
    }
    _handleFinishLoading = () => {

        getUser().then(p => {
            this._checkLogin(p);

            //console.log("user: ", p);
            //this.setState({ isLoadingComplete: true });
            //if (p === null || p === undefined) {
            //    NavigationService.navigate('Auth');
            //} else {
            //    //if (p.flagtutorial) {
            //    //    NavigationService.navigate('App');
            //    //} else {
            //    //    NavigationService.navigate('Tutorial');
            //    //}
            //}
        });

        //firebase.auth().onAuthStateChanged((user) => {
        //    if (user != null && (user.emailVerified || user.providerData[0].providerId === "facebook.com")) {
        //        getData('UserInfo/' + user.uid).then((p) => {
        //            this._storeUser(JSON.stringify(p));
        //            this.setState({ isLoadingComplete: true });
        //            if (p.flagtutorial) {
        //                NavigationService.navigate('App');
        //            } else {
        //                NavigationService.navigate('Tutorial');
        //            }
        //        });
        //    } else {
        //        this.setState({ isLoadingComplete: true });
        //        this._deleteUser();

        //        NavigationService.navigate('Auth');
        //    }
        //});


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
                    <AppNavigator ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }} />
                    {this.state.loading &&
                        <Modal
                            animationType="fade"
                            transparent={true}
                            onRequestClose={() => {
                            }}>
                            <View style={styles.backgroundModal}>
                                <ActivityIndicator size="large" color="#FFFFFF" />
                            </View>
                        </Modal>
                    }
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    backgroundModal: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
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
});