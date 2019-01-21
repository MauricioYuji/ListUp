import React from 'react';
import * as firebase from 'firebase';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
} from 'react-native';
import { WebBrowser, Icon, Constants, LinearGradient } from 'expo';

import Dimensions from '../constants/Layout';
import { getUserInfo, test } from '../components/Service';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        //var teste = Service.test();

        //getUserInfo("asd")
        //    .then((res) => {
        //        console.log("res: ", res);
        //        if (res.message === 'Not Found') {
        //            this.setState({
        //                error: 'User not found'
        //            });
        //        }
        //        else {
        //            this.props.navigator.push({
        //                title: res.name || 'No Title',
        //                passProps: { userInfo: res }
        //            });
        //            this.setState({
        //                error: false,
        //                username: ''
        //            })
        //        }
        //    });


        test()
            .then((res) => {
                console.log("res: ", res);

            });



        console.log("LIST: ");
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

    render() {
        return (
            <View style={styles.container}>
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.backgroundBanner} />
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']}
                    style={styles.backgroundBanner} />
                <View style={styles.content}>
                    <View style={styles.banner}>
                        <View style={styles.bannerCard}>
                            <Text style={styles.textWhite}>Call of Duty Black OPS IIII</Text>
                        </View>
                    </View>
                    <View style={styles.grid}>
                        <View style={styles.card}>
                            <Text style={styles.textWhite}>B</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.textWhite}>C</Text>
                        </View>
                    </View>
                    <View style={styles.grid}>
                        <View style={styles.card}>
                            <Text style={styles.textWhite}>C</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.textWhite}>C</Text>
                        </View>
                    </View>
                    <View style={styles.slidegroup}>
                        <Text style={styles.textWhite}>D</Text>
                    </View>
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111'
    },
    content: {
        flex: 1,
        marginTop: 60,
    },
    backgroundBanner: {
        width: '100%',
        height: Dimensions.window.height,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
    },
    banner: {
        flex: 3,
        padding: 5,
        marginBottom: 10
    },
    bannerCard: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start'
        
    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 5,
        paddingRight: 5,
    },
    card: {
        borderRadius: 10,
        margin: 3,
        padding: 5,
        backgroundColor: '#222',
        flex: 1
    },
    slidegroup: {
        flex: 3,
        padding: 10,
        marginTop: 10
    },
    textWhite: {
        fontSize: 26,
        color: '#FFF'
    }
});
