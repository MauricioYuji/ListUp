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
    DeviceEventEmitter
} from 'react-native';
import { WebBrowser, Icon, Constants } from 'expo';
import * as firebase from 'firebase';

import { MonoText } from '../components/StyledText';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    logoff() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            //DeviceEventEmitter.emit('login', { logged: false });
        }, function (error) {
            // An error happened.
        });
    }

    render() {
        // console.log("this.state: ", this.state);
        return (
            <View style={styles.searchbar}>

                <View style={styles.logobox}>
                    <TouchableHighlight onPress={() => this.test()}>
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
                <TouchableHighlight onPress={() => this.logoff()}>
                    <View style={styles.profilebox}>
                        <View style={styles.profile} />
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    searchbar: {
        position: 'absolute',
        top: 0,
        left: -5,
        right: -5,
        paddingLeft: 10,
        paddingRight: 10,
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
    logo: {
        flex: 0,
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
        width: 80,
        height: 24
    },
    searchicon: {
        position: 'absolute',
        top: 20,
        left: 10,
        width: 24,
        height: 20,
        zIndex: 10
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
    },
    searchbox: {
        flex: 1,
    },
    profilebox: {
        flex: 0,
    },
    profile: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#006CD8',
        margin: 10
    }
});

