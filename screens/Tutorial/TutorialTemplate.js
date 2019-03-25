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
    Button,
    DeviceEventEmitter
} from 'react-native';
import * as firebase from 'firebase';
import { Font, Icon } from 'expo';
import Swiper from 'react-native-swiper';
import { setData } from '../../components/services/baseService';
import Tutorial from '../../screens/Tutorial/Tutorial';

export default class TutorialTemplate extends React.Component {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        var _self = this;
        //firebase.database().ref('/Games').on('value', function (snapshot) {
        //    console.log(snapshot.val());
        //    _self.setState({
        //        isLoading: false,
        //        dataSource: snapshot.val(),
        //    }, function () {

        //    });
        //});
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
        //setData('UserInfo/' + user.uid, obj).then((p) => {
        //    this.setState({ user: newuser });
        //});

        DeviceEventEmitter.emit('updateUser', { user: newuser });
    };
    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'>
                <TouchableOpacity onPress={() => { this._doneTutorial(); }} style={styles.skipButton}>
                    <Text style={styles.skipText}>Pular</Text>
                </TouchableOpacity>
                <Tutorial />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    startButton: {
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: '#006CD8',
        fontFamily: 'SourceSansPro-SemiBold',
        bottom: 80,
        textAlign: 'center',
        position: 'absolute',
    },
    startButtonText: {
        fontSize: 24,
        color: '#FFF',
    },
    text: {
        fontSize: 24,
        color: '#FFF',
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 160,
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        fontFamily: 'SourceSansPro-SemiBold'
    },
    img: {
        maxWidth: '70%',
        marginBottom: 120

    },
});
