import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, CheckBox, DeviceEventEmitter, Image, TouchableOpacity, Switch } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Layout from '../constants/Layout';
import { Constants } from 'expo';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null,
    };
    state = {
        secureTextEntry: true, email: '', password: '', errorMessage: null
    };

    loggin() {

        const { email, password } = this.state;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ errorMessage: null, loading: false });
                //DeviceEventEmitter.emit('login', { logged: true });
            })
            .catch(() => {
                this.setState({ errorMessage: 'Usuário ou senha inválidos!', loading: false });
            });
    }
    render() {
        let error;
        if (this.state.errorMessage !== null) {
            error = <Text style={styles.errorFeedback}>{this.state.errorMessage}</Text>;
        }
        return (
            <View style={styles.container}
                keyboardShouldPersistTaps='handled'>
                {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
                <View style={styles.loginBox}>

                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={this.state.errorMessage !== null ? styles.inputerror : styles.input}
                            autoCapitalize="none"
                            placeholder="Email"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={this.state.errorMessage !== null ? styles.inputerror : styles.input}
                            autoCapitalize="none"
                            placeholder="Password"
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                            secureTextEntry={this.state.secureTextEntry}
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
                    <View>
                        {error}
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('Register');
                        }}>
                            <Text style={styles.button}>
                                CADASTRAR
                        </Text>
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
    input: {
        backgroundColor: '#222',
        width: '100%',
        height: 60,
        marginTop: 10,
        padding: 15,
        color: '#FFF',
        borderRadius: 10
    },
    inputerror: {
        backgroundColor: '#222',
        width: '100%',
        height: 60,
        marginTop: 10,
        padding: 15,
        color: '#FFF',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#D00',
    },
    errorFeedback: {
        color: '#F00',
        margin: 10
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