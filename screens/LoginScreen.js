import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, CheckBox, DeviceEventEmitter, Image, TouchableOpacity, Switch } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Layout from '../constants/Layout';
import { Constants } from 'expo';

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        secureTextEntry: true,
    };

    loggin() {
        DeviceEventEmitter.emit('login', { logged: true });
    }
    render() {
        return (
            <View style={styles.container}
                keyboardShouldPersistTaps='handled'>
                {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
                <View style={styles.loginBox}>

                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.setState({ text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>SENHA</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={this.state.secureTextEntry}
                            onChangeText={(text) => this.setState({ text })}
                        />
                    </View>
                    <View style={styles.inputGroupCheckbox}>
                        <Switch
                            trackColor={'#006CD8'}
                            thumbColor={'#666'}
                            onValueChange={() => this.setState({ secureTextEntry: !this.state.secureTextEntry })}
                            value={!this.state.secureTextEntry} />
                        <TouchableOpacity onPress={() => this.setState({ secureTextEntry: !this.state.secureTextEntry })}>
                            <Text style={styles.infoText}>MOSTRAR SENHA</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => {
                        this.loggin();
                    }}>
                        <Text style={styles.button}>
                            ENTRAR
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
    },
    logo: {
        marginBottom: 60
    },
    loginBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20
    },
    inputGroupCheckbox: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-start',
    },
    infoText: {
        color: '#FFF',
        lineHeight: 30,
        fontSize: 12,
        fontFamily: 'SourceSansPro-Bold',
        marginLeft: 5
    },
    label: {
        fontSize: 20,
        color: '#FFF',
        alignItems: 'flex-start',
        width: '100%',
        fontFamily: 'SourceSansPro-Bold'
    },
    input: {
        backgroundColor: '#222',
        width: '100%',
        height: 60,
        marginTop: 10,
        padding: 15,
        color: '#FFF',
        borderRadius: 10
    },
    button: {
        marginTop: 30,
        backgroundColor: '#006CD8',
        fontSize: 20,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold',
        borderRadius: 5
    }
});