import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter
} from 'react-native';


export default class HomeScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    }

    state = {
    };
    componentWillMount() {
        DeviceEventEmitter.emit('reloading', true);
    }
    componentDidMount() {
        DeviceEventEmitter.emit('reloading', false);
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Home</Text>
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
