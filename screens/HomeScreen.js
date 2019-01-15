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
} from 'react-native';
import { WebBrowser, Icon } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.banner}>
                    <Text>A</Text>
                </View>
                <View style={styles.grid}>
                    <View style={styles.leftColumn}>
                        <View style={styles.card}>
                            <Text>B</Text>
                        </View>
                        <View style={styles.card}>
                            <Text>C</Text>
                        </View>
                    </View>
                    <View style={styles.rightColumn}>
                        <Text>D</Text>
                    </View>
                </View>
            </View>
        );
    }
    
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    banner: {
        backgroundColor: '#F00',
        flex: 1,
    },
    grid: {
        flex: 3,
        flexDirection: 'row',
    },
    leftColumn: {
        flex: 6,
        backgroundColor: '#FF0'
    },
    card: {
        flex: 1,
    },
    rightColumn: {
        flex: 4,
        backgroundColor: '#F0F'
    },

});
