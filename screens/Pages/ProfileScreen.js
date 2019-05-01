import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter
} from 'react-native';

export default class ProfileScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    }

    state = {
        key: null
    };
    componentWillMount() {

        const { navigation } = this.props;
        const key = navigation.getParam('key', 'NO-ID');
        this.setState({ key: key });

        DeviceEventEmitter.emit('reloading', true);
    }
    componentDidMount() {
        DeviceEventEmitter.emit('reloading', false);
    }
    componentWillUnmount() {
    }
    render() {
        let key = this.state.key;
        <View style={styles.container}>
            <Text style={styles.text}>Profile - {key}</Text>
        </View>
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
