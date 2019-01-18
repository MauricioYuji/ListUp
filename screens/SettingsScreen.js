import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <TextInput
                    style={styles.textWhite}
                    onPress={() => console.log("Pressed")} />
                <Text>asd</Text>

                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: '#F00',
    },
    textWhite: {
        fontSize: 26,
        color: '#000',
        backgroundColor: '#FFF'
    },
    grid1: {
        flex: 1,
    }
});
