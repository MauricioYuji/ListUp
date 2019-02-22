import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, CheckBox, DeviceEventEmitter, Image, TouchableOpacity, Switch, Icon, ActivityIndicator, ImageBackground } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Layout from '../../constants/Layout';
import { signInWithFacebook } from '../../components/services/facebookAuth';
import { setData } from '../../components/services/Service';
import { Constants } from 'expo';
import * as firebase from 'firebase';
import TabBarIcon from '../../components/UI/TabBarIcon';

export default class LoginScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    }
    state = {
        secureTextEntry: true, email: '', password: '', errorMessage: null, loading: null, emailSend: false, feedback: null
    };
    facebookloggin() {
        const _self = this;
        this.setState({ loading: 'facebook' });
        signInWithFacebook().then(() => {
            var user = firebase.auth().currentUser;

            console.log("user: ", user);
            var obj = {
                uid: user.uid,
                photoURL: user.photoURL,
                displayName: user.displayName,
                email: user.email,
                flagtutorial: false
            };
            console.log("obj: ", obj);
            setData('UserInfo/' + user.uid, obj).then((p) => {
                console.log("p: ", p);
                _self.setState({ errorMessage: null, loading: null });
            });
            //if (user.emailVerified) {
            //    _self.setState({ errorMessage: null, loading: null });
            //} else {

            //    firebase.auth().signOut().then(function () {
            //        // Sign-out successful.
            //        _self.setState({ errorMessage: 'Verifique seu email e confirma sua conta para poder entrar.', loading: null });
            //    }, function (error) {
            //        // An error happened.
            //    });
            //}
        })
            .catch(() => {
                this.setState({ errorMessage: null, loading: null });
            });
    }
    loggin() {

        const { email, password } = this.state;
        const _self = this;
        _self.setState({ loading: 'login', errorMessage: null, emailSend: false, feedback: null });
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((data) => {
                    var user = firebase.auth().currentUser;

                    if (user.emailVerified) {
                        _self.setState({ errorMessage: null, loading: null });
                    } else {


                        _self.setState({ errorMessage: 'Verifique seu email e confirme sua conta para poder entrar.', loading: null, emailSend: true, feedback: null });
                        //firebase.auth().signOut().then(function () {
                        //    // Sign-out successful.
                        //}, function (error) {
                        //    // An error happened.
                        //});
                    }
                    //DeviceEventEmitter.emit('login', { logged: true });
                })
                .catch(() => {
                    _self.setState({ errorMessage: 'Usuário ou senha inválidos!', loading: null, feedback: null });
                });
        }, function (error) {
            // An error happened.
        });


    }
    sendEmail() {
        var _self = this;
        _self.setState({ errorMessage: null, loading: null, emailSend: false });
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function () {
            console.log("EMAIL ENVIADO");
            // Email sent.
            _self.setState({ feedback: 'Email enviado com sucesso.' });
        }).catch(function (error) {
            // An error happened.
        });
    }
    render() {
        const loadingButton = this.state.loading;
        let error;
        if (this.state.errorMessage !== null) {
            error = <Text style={styles.errorFeedback}>{this.state.errorMessage}</Text>;
        }
        let emailSend;
        emailSend = this.state.emailSend;
        let feedback;
        if (this.state.feedback !== null) {
            feedback = <Text style={styles.feedbackMessage}>{this.state.feedback}</Text>;
        }
        return (
            <View style={styles.container}
                keyboardShouldPersistTaps='handled'>
                {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
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
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={this.state.errorMessage !== null ? styles.inputerror : styles.input}
                            autoCapitalize="none"
                            placeholder={this.state.secureTextEntry ? '********' : 'Password'}
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                            secureTextEntry={this.state.secureTextEntry}
                        />
                        <TouchableOpacity style={styles.showPassword} onPress={() => this.setState({ secureTextEntry: !this.state.secureTextEntry })}>
                            <Text style={styles.infoText}>MOSTRAR</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.forgottenPassword}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('ResetPassword');
                        }}>
                            <Text style={styles.forgottenPasswordbuttonText}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {error}
                    </View>
                    {emailSend === true ? (
                        <View>
                            <TouchableOpacity onPress={() => this.sendEmail()}>
                                <Text style={styles.sendLink}>Caso não tenha recebido o email, clique aqui para reenviar o email de confirmação.</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                            <View>
                                {feedback}
                            </View>
                        )}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => {
                            this.props.navigation.navigate('Register');
                        }}>
                            <Text style={styles.buttonText}>
                                Criar uma conta
                        </Text>
                        </TouchableOpacity>

                        <View style={[styles.button, styles.buttonPrimary]}>
                            {loadingButton === "login" ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                    <TouchableOpacity onPress={() => {
                                        this.loggin();
                                    }}>


                                        <Text style={styles.buttonText}>
                                            Entrar
                        </Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                    </View>
                    <View style={styles.divider}>
                        <Text style={styles.dividerText}>OU</Text>
                    </View>
                    <View style={styles.facebookButton}>
                        {loadingButton === "facebook" ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                                <TouchableOpacity onPress={() => { this.facebookloggin(); }} style={styles.buttonGroup}>
                                    <TabBarIcon
                                        name={'facebook'}
                                        type={'FontAwesome'}
                                        style={styles.facebooklogo}
                                    />
                                    <Text style={styles.buttonText}>
                                        Entrar com Facebook
                                    </Text>
                                </TouchableOpacity>
                            )}
                    </View>

                </View>
                </View >
        );
    }
}

const styles = StyleSheet.create({
    backgroundBanner: {
        width: '100%',
        height: Layout.window.height,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    logo: {
        marginBottom: 60
    },
    forgottenPassword: {
        width: '100%',
        alignItems: 'flex-start',
        margin: 10,
    },
    forgottenPasswordbuttonText: {
        fontSize: 16,
        fontFamily: 'SourceSansPro-Bold',
        textDecorationLine: 'underline',
        color: '#FFF'
    },
    divider: {
        borderBottomColor: '#444444',
        borderBottomWidth: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 20,
        marginBottom: 0
    },
    dividerText: {
        color: '#FFF',
        backgroundColor: '#111',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        marginBottom: -12
    },
    loginBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 5,
        position: 'relative'
    },
    showPassword: {
        marginLeft: 5,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
        right: 15,
        bottom: 0,
        zIndex: 100
    },
    infoText: {
        color: '#AAAAAA',
        lineHeight: 30,
        fontSize: 12,
        fontFamily: 'SourceSansPro-Bold',
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
    feedbackMessage: {
        color: '#0F0',
        margin: 10
    },
    facebookButton: {
        flexDirection: 'row',
        marginTop: 30,
        backgroundColor: '#3A559F',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 5
    },
    facebooklogo: {
        marginRight: 20
    },
    sendLink: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'SourceSansPro-Bold',
        margin: 10
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold'
    },
    button: {
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 5
    },
    buttonPrimary: {
        backgroundColor: '#006CD8',
    },
    buttonSecondary: {
        backgroundColor: '#444444',
    }
});