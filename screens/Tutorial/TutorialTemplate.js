import React from 'react';
//import * as firebase from 'firebase';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import * as firebase from 'firebase';
import Tutorial from '../../screens/Tutorial/Tutorial';

export default class TutorialTemplate extends React.Component {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
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
});
