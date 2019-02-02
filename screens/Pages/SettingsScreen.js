import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <ScrollView style={styles.gameslide} horizontal={false}>
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    gameslide: {
        flex: 1,
    },
    thumb: {
        width: 80,
        height: 140,
        margin: 5
    },
});
