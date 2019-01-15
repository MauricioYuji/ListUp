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
    TextInput
} from 'react-native';
import { WebBrowser, Icon, Constants } from 'expo';

import { MonoText } from '../components/StyledText';

export default class Header extends React.Component {


    render() {
        return (
            <View style={styles.searchbar}>
                <View style={styles.logobox}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                </View>
                <View style={styles.searchbox}>
                    <TextInput
                        style={styles.inputsearch}
                        placeholder="Type here to translate!"
                        onChangeText={(text) => this.setState({ text })}
                    />
                </View>
                <View style={styles.profilebox}>
                    <View style={styles.profile} />
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    searchbar: {
        width: '100%',
        height: '7%',
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginTop: Constants.statusBarHeight,
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
    inputsearch: {
        backgroundColor: '#EEE',
        borderRadius: 20,
        height: 40,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
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

