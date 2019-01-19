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
                        <Text  style={styles.textWhite}>d anslkd maklsmd lkamsdl kmaslkd m</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Black' }]}>black</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-BlackItalic' }]}>blackitalic</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Bold' }]}>bold</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-BoldItalic' }]}>bolditalic</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-ExtraLightItalic' }]}>extralightitalic</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Italic' }]}>italic</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Light' }]}>light</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-LightItalic' }]}>lightitalic</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Regular' }]}>regular</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-SemiBold' }]}>semibold</Text>
                        <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-SemiBoldItalic' }]}>semibolditalic</Text>
                    </View>
                    <View style={styles.grid}>
                        <View style={styles.leftColumn}>
                            <View style={styles.card}>
                                <Text style={styles.textWhite}>B</Text>
                            </View>
                            <View style={styles.card}>
                                <Text style={styles.textWhite}>C</Text>
                            </View>
                        </View>
                        <View style={styles.rightColumn}>
                            <Text style={styles.textWhite}>D</Text>
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
        flex: 2,
    },
    grid: {
        flex: 3,
        flexDirection: 'row',
    },
    leftColumn: {
        flex: 6,
        backgroundColor: '#FF0',
        opacity: 0.3
    },
    card: {
        flex: 1,
    },
    rightColumn: {
        flex: 4,
        backgroundColor: '#F0F',
        opacity: 0.3
    },
    textWhite: {
        fontSize: 26,
        color: '#FFF'
    }
});
