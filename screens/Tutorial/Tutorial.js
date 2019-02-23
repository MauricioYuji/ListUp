import React from 'react';
//import * as firebase from 'firebase';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    DeviceEventEmitter
} from 'react-native';
import * as firebase from 'firebase';
import { Font, Icon } from 'expo';
import Swiper from 'react-native-swiper';
import { setData } from '../../components/services/Service';

export default class Tutorial extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        currentPage: 0
    };
    componentDidMount() {
        var _self = this;
        //firebase.database().ref('/Games').on('value', function (snapshot) {
        //    console.log(snapshot.val());
        //    _self.setState({
        //        isLoading: false,
        //        dataSource: snapshot.val(),
        //    }, function () {

        //    });
        //});
    }

    _doneTutorial = () => {

        var user = firebase.auth().currentUser;

        var newuser = {
            uid: user.uid,
            photoURL: user.photoURL,
            displayName: user.displayName,
            email: user.email,
            flagtutorial: true
        };
        //setData('UserInfo/' + user.uid, obj).then((p) => {
        //    this.setState({ user: newuser });
        //});

        DeviceEventEmitter.emit('updateUser', { user: newuser });
    };
    render() {
        return (
            <Swiper
                loop={false}
                showsPagination={true}
                showsButtons={true}
                dot={<View style={{ backgroundColor: '#FFF', width: 16, height: 16, borderRadius: 8, marginLeft: 6, marginRight: 6, marginTop: 6, marginBottom: 6, }} />}
                activeDot={<View style={{ backgroundColor: '#006CD8', width: 16, height: 16, borderRadius: 8, marginLeft: 6, marginRight: 6, marginTop: 6, marginBottom: 6, }} />}
                nextButton={<Icon.FontAwesome
                    name='chevron-right'
                    size={40}
                    color='#FFF'
                />}
                prevButton={<Icon.FontAwesome
                    name='chevron-left'
                    size={40}
                    color='#FFF'
                />}
                onIndexChanged={(index) => {
                    console.log('index >>> ', index);
                    this.setState({
                        currentPage: index
                    })
                }}
                index={0}>

                <View style={styles.container}>
                    <Image source={require('../../assets/images/tutorial-1.png')} resizeMode={'contain'} style={styles.img} />
                    <Text style={styles.text}>
                        Lista seus games favoritos de diferentes consoles em um só lugar.
                    </Text>

                </View>
                <View style={styles.container}>
                    <Image source={require('../../assets/images/tutorial-2.png')} resizeMode={'contain'} style={styles.img} />
                    <Text style={styles.text}>
                        Organize seus games do jeito que quiser. Crie listas de top games, listas temáticas, lista de desejos e muito mais.
                        </Text>

                </View>
                <View style={styles.container}>
                    <Image source={require('../../assets/images/tutorial-3.png')} resizeMode={'contain'} style={styles.img} />
                    <Text style={styles.text}>
                        Compartilhe com seus amigos quando tiver um jogo novo, faça um review sobre o game, dê sua nota e discuta sobre.
                    </Text>

                    <TouchableOpacity onPress={() => { this._doneTutorial(); }} style={styles.startButton}>
                        <Text style={styles.startButtonText}>Começar</Text>
                    </TouchableOpacity>
                </View>
            </Swiper>
        );
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1
    },
    skipText: {

        fontSize: 24,
        color: '#FFF',
    },
    startButton: {
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: '#006CD8',
        fontFamily: 'SourceSansPro-SemiBold',
        bottom: 80,
        textAlign: 'center',
        position: 'absolute',
    },
    startButtonText: {
        fontSize: 24,
        color: '#FFF',
    },
    text: {
        fontSize: 24,
        color: '#FFF',
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 160,
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        fontFamily: 'SourceSansPro-SemiBold'
    },
    img: {
        maxWidth: '70%',
        marginBottom: 120

    },
});
