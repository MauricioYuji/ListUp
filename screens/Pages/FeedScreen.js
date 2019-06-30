import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter
} from 'react-native';
import * as firebase from 'firebase';
require("firebase/firestore");



export default class FeedScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    }

    state = {
    };
    //componentWillMount() {
    //    DeviceEventEmitter.emit('reloading', true);
    //}
    componentDidMount() {


        // firebase.database().ref('/Games/').endAt(100).on('value', function (snapshot) {
        //     console.log("results: ", snapshot.val());
        //     // console.log("results: ", Object.assign([], snapshot.val()));
        //     console.log("PROCESSADO");
        //     DeviceEventEmitter.emit('reloading', false);
        // });

        firebase.firestore().collection("Games").get().then(function (f) {
            f.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                const game = doc.data()
                game.img.get().then(snap => {
                    game.image = snap.data()
                });
                console.log(doc.id, " => ", game);
                DeviceEventEmitter.emit('reloading', false);
            });
        });

    }
    componentWillUnmount() {
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Feed</Text>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 30,
        color: '#FFF'
    },
});
