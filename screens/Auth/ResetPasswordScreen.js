import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
//import * as firebase from 'firebase';

export default class ResetPasswordScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    }
    state = {
        secureTextEntry: true, email: '', feedback: null, errorMessage: null, loading: null
    };
    enviar() {

        const { email } = this.state;

        this.setState({ loading: 'enviar' });
        //firebase.auth().sendPasswordResetEmail(email)
        //    .then(() => {
        //        this.setState({ errorMessage: null, loading: null, feedback: 'Confirme seu email para trocar a senha!' });
        //    })
        //    .catch(() => {
        //        this.setState({ errorMessage: 'Usuário ou senha inválidos!', loading: null, feedback: null });
        //    });
    }
    render() {
        const loadingButton = this.state.loading;
        let feedback;
        if (this.state.feedback !== null) {
            feedback = <Text style={styles.Feedback}>{this.state.feedback}</Text>;
        }
        let error;
        if (this.state.errorMessage !== null) {
            error = <Text style={styles.errorFeedback}>{this.state.errorMessage}</Text>;
        }
        return (
            <View style={styles.container}
                keyboardShouldPersistTaps='handled'>
                <View style={styles.loginBox}>

                    <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={this.state.errorMessage !== null ? styles.inputerror : styles.input}
                            autoCapitalize="none"
                            placeholder="Email"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />
                    </View>
                    <View>
                        {error}
                        {feedback}
                    </View>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login'); }}>
                            <Text style={[styles.button, styles.buttonSecondary]}>
                                Voltar
                        </Text>
                        </TouchableOpacity>
                        <View style={[styles.button, styles.buttonPrimary]}>
                            {loadingButton === "enviar" ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                    <TouchableOpacity onPress={() => {
                                        this.enviar();
                                    }}>
                                        <Text style={styles.buttonText}>
                                            Enviar email
                        </Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                    </View>

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
        marginBottom: 5
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
    },
    Feedback: {
        color: '#0F0',
    },
    buttonText: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold'
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    button: {
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 20,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold',
        borderRadius: 5
    },
    buttonPrimary: {
        backgroundColor: '#006CD8',
    },
    buttonSecondary: {
        backgroundColor: '#444444',
    }
});