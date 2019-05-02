import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class EditScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };


    state = {
        Id: null
    };
    componentWillMount() {
        const { navigation } = this.props;
        const Id = navigation.getParam('Id', 'NO-ID');
        this.setState({ Id: Id });

        DeviceEventEmitter.emit('reloading', true);
    }
    componentDidMount() {
        DeviceEventEmitter.emit('reloading', false);
    }
    render() {
        return (
            <ScrollView style={styles.gameslide} horizontal={false}>
                <Text style={styles.text}>Edit {this.state.Id}</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    gameslide: {
        flex: 1,
        marginTop: 60,
    },
    text: {
        color: '#FFF',
        margin: 40
    },
});
