import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default class LoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <View style={styles.content}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111'
    },

});
