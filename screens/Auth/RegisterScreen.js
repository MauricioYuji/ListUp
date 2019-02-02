import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, CheckBox, DeviceEventEmitter, Image, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Layout from '../../constants/Layout';
import { Constants } from 'expo';
import * as firebase from 'firebase';
//import { getUserInfo, saveUserInfo } from '../components/Service';
import { signInWithFacebook } from '../../components/services/facebookAuth';
import TabBarIcon from '../../components/UI/TabBarIcon';

export default class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null,
    };
    state = {
        name: { value: '', errorMessage: null }, email: { value: '', errorMessage: null }, password: { value: '', errorMessage: null }, confirmpassword: { value: '', errorMessage: null }, feedback: ''
    };

    validate = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            console.log("Email is Not Correct");
            return false;
        }
        else {
            console.log("Email is Correct");
            return true;
        }
    }
    facebookloggin() {
        this.setState({ loading: 'facebook' });
        signInWithFacebook().then(() => {
            this.setState({ loading: null });
        })
            .catch(() => {
                this.setState({ errorMessage: null, loading: null });
            });
    }
    register() {
        const _self = this;
        const { name, email, password, confirmpassword } = this.state;

        this.setState({
            loading: 'register', name: { value: this.state.name.value, errorMessage: null }, email: { value: this.state.email.value, errorMessage: null }, password: { value: this.state.password.value, errorMessage: null }, confirmpassword: { value: this.state.confirmpassword.value, errorMessage: null }
        });
        var validate = true;
        if (name.value.length == 0) {
            validate = false;
            this.setState({
                name: { value: this.state.name.value, errorMessage: "Preencha o campo nome!" }
            });
        }
        if (email.value.length == 0) {
            validate = false;
            this.setState({
                email: { value: this.state.email.value, errorMessage: "Preencha o campo email!" }
            });
        }
        if (password.value.length == 0) {
            validate = false;
            this.setState({
                password: { value: this.state.password.value, errorMessage: "Preencha o campo password!" }
            });
        }
        if (confirmpassword.value.length == 0) {
            validate = false;
            this.setState({
                confirmpassword: { value: this.state.confirmpassword.value, errorMessage: "Preencha o campo confirm password!" }
            });
        }
        if (email.value.length > 0 && !this.validate(email.value)) {
            validate = false;
            this.setState({
                email: { value: this.state.email.value, errorMessage: "Email Inválido!" }
            });
        }
        if (password.value.length > 0 && password.value.length < 6) {
            validate = false; this.setState({
                password: { value: this.state.password.value, errorMessage: "Senhas deve conter pelo menos 6 caracteres!" }
            });
        }
        if (password.value.length > 0 && password.value !== confirmpassword.value) {
            validate = false;
            this.setState({
                password: { value: this.state.password.value, errorMessage: "Senhas devem ser iguais!" },
                confirmpassword: { value: this.state.confirmpassword.value, errorMessage: "Senhas devem ser iguais!" }
            });
        }

        if (validate) {
            this.setState({
                emailerrorMessage: null, passworderrorMessage: null, confirmpassworderrorMessage: null
            });
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
                .then(() => {
                    console.log("usuario criado");

                    var user = firebase.auth().currentUser;

                    user.updateProfile({
                        displayName: name.value,
                        photoURL: ""
                    }).then(function () {
                        // Update successful.

                        user.sendEmailVerification().then(function () {
                            // Email sent.
                            _self.setState({ error: '', loading: null, feedback: 'Usuário criado, acesse seu email para confirmar a conta.' });
                        }).catch(function (error) {
                            // An error happened.
                        });
                    }).catch(function (error) {
                        // An error happened.
                    });


                    //getUserInfo(user.uid).then((res) => {
                    //    console.log("firebase.auth().currentUser.uid: ", firebase.auth().currentUser.uid);
                    //    console.log("name: ", name.value);
                    //    if (res === null) {
                    //        saveUserInfo(firebase.auth().currentUser.uid, name.value, '').then((res) => {
                    //            console.log("res: ", res);
                    //        });
                    //    }
                    //});

                })
                .catch((e) => {
                    console.log("erro: ", e);
                    this.setState({
                        email: { value: this.state.email.value, errorMessage: "Email já cadastrado!", loading: null }
                    });
                });
        } else {
            this.setState({
                loading: null
            });
        }
    }
    render() {
        const loadingButton = this.state.loading;
        const feedback = this.state.feedback;
        let nameerrorMessage;
        let emailerrorMessage;
        let passworderrorMessage;
        let confirmpassworderrorMessage;
        if (this.state.name.errorMessage !== null) {
            nameerrorMessage = <Text style={styles.errorFeedback}>{this.state.name.errorMessage}</Text>;
        }
        if (this.state.email.errorMessage !== null) {
            emailerrorMessage = <Text style={styles.errorFeedback}>{this.state.email.errorMessage}</Text>;
        }
        if (this.state.password.errorMessage !== null) {
            passworderrorMessage = <Text style={styles.errorFeedback}>{this.state.password.errorMessage}</Text>;
        }
        if (this.state.confirmpassword.errorMessage !== null) {
            confirmpassworderrorMessage = <Text style={styles.errorFeedback}>{this.state.confirmpassword.errorMessage}</Text>;
        }
        return (
            <View style={styles.container}
                keyboardShouldPersistTaps='handled'>
                {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
                <View style={styles.loginBox}>

                    <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

                    {feedback === "" ? (
                        <View style={styles.inputGroup}>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={this.state.name.errorMessage !== null ? styles.inputerror : styles.input}
                                    autoCapitalize="none"
                                    placeholder="Nome"
                                    onChangeText={text => this.setState({ name: { value: text, errorMessage: null } })}
                                    value={this.state.name.value}
                                />
                                {nameerrorMessage}
                            </View>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={this.state.email.errorMessage !== null ? styles.inputerror : styles.input}
                                    autoCapitalize="none"
                                    placeholder="Email"
                                    onChangeText={text => this.setState({ email: { value: text, errorMessage: null } })}
                                    value={this.state.email.value}
                                />
                                {emailerrorMessage}
                            </View>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={this.state.password.errorMessage !== null ? styles.inputerror : styles.input}
                                    autoCapitalize="none"
                                    placeholder="Password"
                                    onChangeText={text => this.setState({ password: { value: text, errorMessage: null } })}
                                    value={this.state.password.value}
                                    secureTextEntry={true}
                                />
                                {passworderrorMessage}
                            </View>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={this.state.confirmpassword.errorMessage !== null ? styles.inputerror : styles.input}
                                    autoCapitalize="none"
                                    placeholder="Confirm Password"
                                    onChangeText={text => this.setState({ confirmpassword: { value: text, errorMessage: null } })}
                                    value={this.state.confirmpassword.value}
                                    secureTextEntry={true}
                                />
                                {confirmpassworderrorMessage}
                            </View>
                        </View>
                    ) : (
                            <Text style={styles.buttonText}>{feedback}</Text>
                        )}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login'); }}>
                            <Text style={[styles.button, styles.buttonSecondary]}>
                                Voltar
                        </Text>
                        </TouchableOpacity>
                        <View style={[styles.button, styles.buttonPrimary]}>
                            {loadingButton === "register" ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                    <TouchableOpacity onPress={() => {
                                        this.register();
                                    }}>
                                        <Text style={styles.buttonText}>
                                            Criar conta
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
    },
    buttonText: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold'
    },
    buttonGroup: {
        flexDirection: 'row',
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
        fontSize: 20,
        marginBottom: -12
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